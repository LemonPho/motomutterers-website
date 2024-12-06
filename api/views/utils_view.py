from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpResponse, JsonResponse

import base64
import os
import pathlib
import json

from ..tokens import account_activation_token

def get_token(request):
    if request.method != "GET":
        return HttpResponse(status=405)
    
    token = account_activation_token.make_token(request.user)

    return JsonResponse({
        "token": token,
    }, status=200)

def logged_in(request):
    #returns wether user is logged in or not
    if request.method != "GET":
        return HttpResponse(status=405)
        
    return JsonResponse({
        "logged_in": request.user.is_authenticated,
    })

def find_account(request):
    User = get_user_model()

    email = request.GET.get("email", False)
    username = request.GET.get("username", False)

    if not email and not username or request.method != "GET":
        return HttpResponse(status=405)

    email_found = None
    username_found = None
    user_instance = None

    try:
        user_instance = User.objects.get(username=username)
    except User.DoesNotExist:
        username_found = False
    else:
        username_found = True
        username = user_instance.username

    try:
        user_instance = User.objects.get(email=email)
    except User.DoesNotExist:
        email_found = False
    else:
        email_found = True
        username = user_instance.username

    context = {
        "email_found": email_found,
        "username_found": username_found,
        "username": user_instance.username if user_instance else False,
    }
    json_context = json.dumps(context)

    if not username_found and not email_found:
        return HttpResponse(status=404)

    return HttpResponse(json_context, status=200)

def find_image(request):
    #finds an image, if its not found, or the extension isn't present, it will return error
    if request.method != "GET":
        return HttpResponse(status=405)
    
    image_path = request.GET.get("path", False)

    if not image_path:
        return HttpResponse(status=405)
    
    image_path = os.path.join(settings.MEDIA_ROOT, image_path)

    if not os.path.exists(image_path):
        return HttpResponse(status=404)
    
    image_format = pathlib.Path(image_path).suffix

    if image_format:
        with open(image_path, 'rb') as image_file:
            image_data = base64.b64encode(image_file.read()).decode('utf-8')
        return JsonResponse({
            "image_data": image_data,
            "image_format": image_format,
        })
    else:
        return HttpResponse(status=405)