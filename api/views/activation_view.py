from django.contrib.auth import login, get_user_model
from django.http import HttpResponse
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str

from ..tokens import account_activation_token

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
