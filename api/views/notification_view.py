from django.contrib.auth import get_user_model
from django.http import HttpResponse, JsonResponse

from ..models import Notification
from ..serializers.notification_serializers import NotificationReadSerializer, NotificationWriteSerializer

import json

def get_notifications(request):
    if not request.user.is_authenticated or request.method != "GET":
        return HttpResponse(status=405)
    
    notifications = request.user.notifications.all()
    serializer = NotificationReadSerializer(notifications, many=True) if notifications != None else None

    return JsonResponse(serializer.data, status=200, safe=False)

def read_notification(request):
    data = json.loads(request.body)
    notification_id = data.get("notification_id")

    print(notification_id)
    
    try:
        notification = Notification.objects.get(pk=notification_id)
    except Notification.DoesNotExist:
        notification = None

    if notification == None:
        return HttpResponse(status=404)
    
    if notification.user != request.user:
        return HttpResponse(status=403)
    
    notification.delete()

    return HttpResponse(status=200)

def create_notifications(text, path, origin_user, users):
    data = {
        "text": text,
        "path": path,
        "origin_user": origin_user.id,
        "user": None,
    }
    temp_data = data
    notifications = []

    for user in users:
        if user != origin_user:
            temp_data["user"] = user.id
            serializer = NotificationWriteSerializer(data=data)
            if serializer.is_valid():
                notifications.append(serializer.save())
            else:
                print(serializer.errors)

    return notifications
