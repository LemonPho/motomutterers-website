from django.contrib.auth import get_user_model
from django.http import HttpResponse

from selenium.webdriver.remote.webdriver import WebDriver
from selenium import webdriver


from ..models import SeleniumStatus

import threading
import json

ACTIVE_BROWSERS = {}

def check_selenium_status():
    if SeleniumStatus.objects.count() != 0:
        return False
    else:
        return True

def create_selenium_status(pid, message, request, browser):
    if SeleniumStatus.objects.count() != 0:
        return False
    
    ACTIVE_BROWSERS[pid] = browser
    
    return SeleniumStatus.objects.create(
        user=request.user,
        message=message,
        pid=pid,
    )

def close_selenium_status(instance):
    ACTIVE_BROWSERS.pop(instance.pid)
    instance.delete()

def terminate_selenium_pid(request):
    data = json.loads(request.body)
    pid = data.get("pid", False)

    if not pid:
        return HttpResponse(status=400)

    try:
        instance = SeleniumStatus.objects.get(pid=pid)
    except SeleniumStatus.DoesNotExist:
        return HttpResponse(status=404)
    
    browser = ACTIVE_BROWSERS.pop(instance.pid)
    #browser.quit() takes a little while, it has to wait until the webdriverwait is done
    browser.quit() 
    instance.delete()

    return HttpResponse(status=204)