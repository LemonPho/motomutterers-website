from django.contrib.auth import get_user_model, login, logout
from django.contrib.sites.shortcuts import get_current_site
from django.http import HttpResponse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode

import json

from ..backends import EmailBackend
from ..forms import UserRegistrationForm
from ..tokens import account_activation_token
from ..utils import is_username_valid, is_email_valid, send_email

def register(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    
    User = get_user_model()
        
    #TODO: need to add verification for email format, i think username too
    username_unique = False
    username_valid = False
    passwords_match = True
    password_valid = True
    email_unique = False
    email_valid = False

    #load fetch data
    data = json.loads(request.body)
    
    #load fields
    username = data.get("username")
    email = data.get("email")
    password = data.get("password1")
    confirmation = data.get("password2")

    #verify all fields are correct and unique
    try:
        User.objects.get(username=username)
    except User.DoesNotExist:
        username_unique = True

    try:
        User.objects.get(email=email)
    except User.DoesNotExist:
        email_unique = True

    username_valid = is_username_valid(username)
    email_valid = is_email_valid(email)

    if password != confirmation:
        passwords_match = False
    
    if len(password) < 8:
        password_valid = False 

    form = UserRegistrationForm(data)
    if not form.is_valid():
        password_valid = False

    context = {
        "username_unique": username_unique,
        "username_valid": username_valid,
        "passwords_match": passwords_match,
        "password_valid": password_valid,
        "email_unique": email_unique,
        "email_valid": email_valid,
    }
    json_context = json.dumps(context)

    if not username_unique or not email_unique or not passwords_match or not password_valid:
        return HttpResponse(json_context, status=400)

    #create temporary user
    user = form.save(commit=False)
    user.is_active = False
    user.save()

    #getting site and activation token details to send in email
    domain = get_current_site(request).domain
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = account_activation_token.make_token(user)
    protocol = 'https' if request.is_secure() else 'http'
    email_subject = "Activate your motomutterers fantasy league account"
    email_body = f"Hello {user.username},\nPlease activate your account with this link, it will be valid for 15 minutes: {protocol}://{domain}/activate?uid={uid}&token={token}"
    email = send_email(email, email_subject, email_body)
    if email.send():
        return HttpResponse(json_context, status=200)
    else:
        return HttpResponse(json_context, status=500)

def login_view(request):
    if request.method != "POST":
        return HttpResponse(status=405)
        
    #request method is post, no need for an if, since the previous checks
    data = json.loads(request.body)
    
    is_username = data.get("is_username")
    login_key = data.get("login_key")
    password = data.get("password")

    email_backend = EmailBackend()

    if(is_username):
        user = email_backend.authenticate_username(request, username=login_key, password=password)
    else:
        user = email_backend.authenticate_email(request, email=login_key, password=password)

    if not user.is_active:
        return HttpResponse(status=403)

    #checks if login was successful
    if user is not None:
        login(request, user)
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=400)
    
def logout_view(request):
    logout(request)
    return HttpResponse(status=200)
