from django.middleware.csrf import get_token
from django.shortcuts import render

# Create your views here.
def index(request, *args, **kwargs):
    #get token is for retrieving the csrftoken, it seems that without it, django doesn't set the csrftoken in the cookies, making the website basically unusable
    get_token(request)
    return render(request, "frontend/index.html")