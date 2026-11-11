from django.contrib.auth import login, get_user_model
from django.http import HttpResponse
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_str, force_bytes
from django.contrib.sites.shortcuts import get_current_site


from ..tokens import account_activation_token
from ..backends import EmailBackend
from ..utils import send_email


import json

def request_activation_token(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    
    data = json.loads(request.body)

    uid64 = data.get("uid")
    User = get_user_model()

    try:
        uid = force_str(urlsafe_base64_decode(uid64).decode())
        user = User.objects.get(pk=uid)
    except User.DoesNotExist:
        user = None

    if user == None:
        return HttpResponse(status=404)
    
    if user.is_active:
        return HttpResponse(status=400)
    
    domain = get_current_site(request).domain
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = account_activation_token.make_token(user)
    protocol = 'https' if request.is_secure() else 'http'
    email_subject = "Activate your motomutterers fantasy league account"
    email_body = f"Hello {user.username},\nPlease activate your account with this link, it will be valid for 15 minutes: {protocol}://{domain}/activate?uid={uid}&token={token}"
    email = send_email(user.email, email_subject, email_body, "plain")
    if email.send():
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=500)

#after creating an account, user clicks the activation link which runs this method
def activate_account(request):
    #uid = user id
    uid64 = request.GET.get('uid', False)
    token = request.GET.get('token', False)

    User = get_user_model()

    try:
        uid = force_str(urlsafe_base64_decode(uid64).decode())
        user = User.objects.get(pk=uid)
    except User.DoesNotExist:
        user = None

    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        login(request, user)
        return HttpResponse(status=200)

    return HttpResponse(status=400)

def activate_email(request):
    uid64 = request.GET.get("uid", False)
    token = request.GET.get("token", False)
    new_email = request.GET.get("email", False)

    User = get_user_model()

    email_activated = None

    try:
        uid = force_str(urlsafe_base64_decode(uid64).decode())
        user = User.objects.get(pk=uid)
        email_activated = True
    except User.DoesNotExist:
        email_activated = False

    if email_activated and account_activation_token.check_token(user, token) and new_email:
        user.email = new_email
        user.save()
        login(request, user)
        return HttpResponse(status=200)
    
    return HttpResponse(status=400)
