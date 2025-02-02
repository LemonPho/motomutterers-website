from django.contrib.auth import get_user_model
from django.http import HttpResponse

from ..models import SeleniumStatus

import os
import signal
import json
import psutil

def check_selenium_status():
    if SeleniumStatus.objects.count() != 0:
        return False
    else:
        return True

def create_selenium_status(pid, message, request):
    if SeleniumStatus.objects.count() != 0:
        return False
    
    return SeleniumStatus.objects.create(
        user=request.user,
        message=message,
        pid=pid,
    )

def close_selenium_status(instance):
    try:
        process = psutil.Process(instance.pid)
        process.terminate()

        process.wait(timeout=3)
    except psutil.NoSuchProcess:
        None
    instance.delete()

def terminate_selenium_pid(request):
    print(request.body)
    data = json.loads(request.body)
    pid = data.get("pid", False)

    if not pid:
        return HttpResponse(status=400)

    try:
        instance = SeleniumStatus.objects.get(pid=pid)
        instance.delete()
    except SeleniumStatus.DoesNotExist:
        return HttpResponse(status=404)
    
    try:
        process = psutil.Process(pid)
        process.terminate()

        process.wait(timeout=3)
    except psutil.NoSuchProcess:
        return HttpResponse(status=404)

    return HttpResponse(status=400)