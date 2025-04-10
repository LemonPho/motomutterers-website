from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.contrib.sites.shortcuts import get_current_site
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.mail import EmailMessage
from django.http import HttpResponse, JsonResponse
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

from PIL import Image
from io import BytesIO
from pillow_heif import register_heif_opener, from_bytes

import os
import json
import datetime
import base64

from ...tokens import account_activation_token
from ...utils import is_username_valid, is_email_valid
from ...forms import ProfilePictureForm
from ...serializers.user_serializers import UserSerializer
from ...serializers.user_serializers import ProfilePictureSerializer, UserSimpleSerializer
from ...serializers.comments_serializers import CommentReadSerializer

def get_user(request):
    if request.method != "POST":
        return HttpResponse(status=405)

    data = json.loads(request.body)
    username = data.get("username", False)

    if not username:
        return HttpResponse(status=405)
    
    User = get_user_model()

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        user = None

    if user == None:
        return HttpResponse(status=404)
    
    serializer = UserSimpleSerializer(user)

    return JsonResponse(serializer.data, status=200)

def get_default_profile_picture(request):
    if request.method != "GET":
        return HttpResponse(status=405)
    
    image_data = {
        "format": "webp",
        "data": None
    }
    
    with open("media/profile_pictures/default.webp", 'rb') as picture_file:
        image_data["data"] = base64.b64encode(picture_file.read()).decode("utf-8")

    return JsonResponse({"profile_picture": image_data}, status=200)

def get_profile_pictures(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    
    body = json.loads(request.body)
    user_list = body.get("userList", False)

    if not user_list:
        return HttpResponse(status=400)

    User = get_user_model()

    users = User.objects.filter(username__in=user_list)
        
    serializer = ProfilePictureSerializer(users, many=True)
    profile_pictures_data = {
        user["username"]: user for user in serializer.data
    }

    return JsonResponse({"profile_pictures": profile_pictures_data}, status=200)
    
def get_current_user(request):
    #getting user data
    if request.method != "GET":
        return HttpResponse(status=405)

    #in this case we just return the user if its not signed in
    if not request.user.is_authenticated:
        context = {
            "is_admin": False,
            "username": False,
            "email": False,
            "profile_picture_data": False,
            "profile_picture_format": False,
            "notifications": False,
        }
        return JsonResponse(context, status=200)
    
    user = request.user
    serializer = UserSerializer(user)

    return JsonResponse(serializer.data, status=200)

def get_user_comments(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    
    data = json.loads(request.body)
    username = data.get("username", False)
    page = int(request.GET.get("page", 1))
    start = (page - 1) * 15
    end = start + 15

    if not username:
        return HttpResponse(status=405)
    
    User = get_user_model()

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        user = None

    if user == None:
        return HttpResponse(status=404)
    
    if start < 0:
        return HttpResponse(status=400)
    
    amount_comments = user.comments.count()
    comments = user.comments.all()[start:end]

    serializer = CommentReadSerializer(comments, many=True)

    return JsonResponse({
        "comments": serializer.data,
        "amount_comments": amount_comments,
    }, status=200)

def get_logged_in(request):
    if request.method != "GET":
        return HttpResponse(status=405)
    
    if request.user.is_authenticated:
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=204)

def change_password(request):
    if request.method != "POST" or not request.user.is_authenticated:
        return HttpResponse(status=405)
    
    data = json.loads(request.body)

    token = data.get("token", False)
    current_password = data.get("currentPassword", False)
    new_password = data.get("newPassword", False)

    current_password_correct = check_password(current_password, request.user.password)
    new_password_valid = len(new_password) > 8
    token_valid = account_activation_token.check_token(request.user, token)

    context = {
        "current_password_correct": current_password_correct,
        "new_password_valid": new_password_valid,
        "token_valid": token_valid,
    }
    json_context = json.dumps(context)

    if token_valid and current_password_correct and new_password_valid:
        request.user.set_password(new_password)
        request.user.save()
        return HttpResponse(json_context, status=200)
    else:
        return HttpResponse(json_context, status=400)
        

def change_username(request):
    if request.method != "POST" or not request.user.is_authenticated:
        return HttpResponse(status=405)
    
    UserModel = get_user_model()
    user = request.user
    data = json.loads(request.body)

    current_password = data.get("currentPassword", False)
    new_username = data.get("newUsername", False)

    current_password_correct = check_password(current_password, user.password)
    new_username_valid = is_username_valid(new_username)
    new_username_unique = not UserModel.objects.filter(username=new_username).exists()
    user_can_change_username = False

    if user.date_username_edited == None:
        user_can_change_username = True
    else:
        date_difference = user.since_changed_username
        if date_difference >= 30:
            user_can_change_username = True

    context = {
        "current_password_correct": current_password_correct,
        "new_username_valid": new_username_valid,
        "new_username_unique": new_username_unique,
        "user_can_change_username": user_can_change_username,
    }

    if current_password_correct and new_username_valid and new_username_unique and user_can_change_username:
        user.username = new_username
        user.date_username_edited = datetime.datetime.now()
        user.save()
        return JsonResponse(context, status=200)
    else:
        return JsonResponse(context, status=400)

def change_email(request):
    if request.method != "POST" or not request.user.is_authenticated:
        return HttpResponse(status=405)
    
    UserModel = get_user_model()
    user = request.user
    data = json.loads(request.body)

    current_password = data.get("currentPassword", False)
    new_email = data.get("newEmail", False)

    current_password_correct = check_password(current_password, user.password)
    new_email_valid = is_email_valid(new_email)
    new_email_unique = not UserModel.objects.filter(email=new_email).exists()

    context = {
        "current_password_correct": current_password_correct,
        "new_email_valid": new_email_valid,
        "new_email_unique": new_email_unique,
    }
    json_context = json.dumps(context)

    if current_password_correct and new_email_unique and new_email_valid:
        #getting site and activation token details to send in email
        domain = get_current_site(request).domain
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = account_activation_token.make_token(user)
        protocol = 'https' if request.is_secure() else 'http'
        email_subject = "Activate your new email"
        email_body = f"Hello {user.username},\nPlease activate your new email with this link, it will be valid for 15 minutes: {protocol}://{domain}/change-email?uid={uid}&token={token}&email={new_email}\nIf you don't manage to activate the email in time, you can restart the process from user settings on the website."
        email = EmailMessage(email_subject, email_body, to=[new_email])
        if email.send():
            return HttpResponse(json_context, status=200)
        else:
            return HttpResponse(json_context, status=500)
    else:
        return HttpResponse(json_context, status=400)

def change_profile_picture(request):
    if request.method != "POST" or not "profile_picture" in request.FILES or not request.user.is_authenticated:
        return HttpResponse(status=405)

    form = ProfilePictureForm(request.POST, request.FILES)
    user = request.user

    if form.is_valid():
        profile_picture_base = form.cleaned_data["profile_picture"]
        profile_picture_format = profile_picture_base.name.split('.')[-1].lower()

        if profile_picture_format == ".heif" or profile_picture_format == ".heic":
            register_heif_opener()
            heif_image = from_bytes(profile_picture_base.read())
            profile_picture = Image.frombytes(
                heif_image.mode,
                heif_image.size,
                heif_image.data,
                "raw",
                heif_image.mode)
            profile_picture_format = "jpeg"
        else:
            profile_picture = Image.open(profile_picture_base)


        profile_picture_resized = profile_picture.resize((250, 250))
        profile_picture_buffer = BytesIO()
        profile_picture_resized.save(profile_picture_buffer, format=profile_picture_format.upper(), quality=100)
        profile_picture_file = InMemoryUploadedFile(
            profile_picture_buffer, None, profile_picture_base.name, f"image/{profile_picture_format}", profile_picture_buffer.tell(), None
            )

        user.profile_picture = profile_picture_file
        user.save()
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=400)

def toggle_email_notifications(request):
    if request.method != "PUT" or not request.user.is_authenticated:
        return HttpResponse(status=405)
    
    TYPE_RACE_WEEKENDS = 1
    TYPE_COMMENT_RESPONSE = 2
    TYPE_ANNOUNCEMENT_RESPONSE = 3
    
    data = json.loads(request.body)
    type = data.get("type", False)

    if not type:
        return HttpResponse(status=400)
        
    if type == TYPE_RACE_WEEKENDS:
        request.user.race_weekends_emails = not request.user.race_weekends_emails
    elif type == TYPE_COMMENT_RESPONSE:
        request.user.comment_response_emails = not request.user.comment_response_emails
    elif type == TYPE_ANNOUNCEMENT_RESPONSE and request.user.is_admin:
        request.user.announcement_response_emails = not request.user.announcement_response_emails

    request.user.save()
    
    return HttpResponse(status=201)


def email_new_password(request):
    username = request.GET.get("username", False)
    User = get_user_model()

    if not username:
        return HttpResponse(status=405)
    
    try:
        user = User.objects.get(username=username)
        email = user.email
    except User.DoesNotExist:
        return HttpResponse(status=405)
    
    domain = get_current_site(request).domain
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = account_activation_token.make_token(user)
    protocol = 'https' if request.is_secure() else 'http'
    email_subject = "Change your motomutters fantasy league account password"
    email_body = f"Hello {user.username},\nPlease change your account password with this link, it will be valid for 15 minutes: {protocol}://{domain}/change-password?uid={uid}&token={token}"
    email = EmailMessage(email_subject, email_body, to=[email])
    if email.send():
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=500)

def reset_password(request):
    if request.method != "POST":
        return HttpResponse(status=405)

    data = json.loads(request.body)
    uid64 = data.get("uid64", False)
    token = data.get("token")
    password1 = data.get("password1")
    password2 = data.get("password2")

    User = get_user_model()

    #here the user is changing their password from the forgot password process
    if not password1 or not password2 or not uid64 or not token:
        return HttpResponse(status=400)

    try:
        uid = force_str(urlsafe_base64_decode(uid64).decode())
        user = User.objects.get(pk=uid)
    except User.DoesNotExist:
        return HttpResponse(status=404)
    
    password_valid = True if len(password1) > 8 else False
    passwords_match = True if password1 == password2 else False

    context = {
        "passwords_match": passwords_match,
        "password_valid": password_valid,
        "token_valid": account_activation_token.check_token(user, token),
    }
    json_context = json.dumps(context)

    if passwords_match and password_valid and account_activation_token.check_token(user, token):
        user.set_password(password1)
        user.save()
        return HttpResponse(json_context, status=200)
    
    return HttpResponse(json_context, status=400)

def delete_account(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    
    if not request.user.is_authenticated:
        return HttpResponse(status=403)
    
    User = get_user_model()
    
    try:
        user = User.objects.get(username=request.user.username)
    except User.DoesNotExist:
        return HttpResponse(status=404)
    
    user.delete()

    return HttpResponse(status=200)