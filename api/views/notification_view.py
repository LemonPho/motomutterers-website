from django.contrib.auth import get_user_model
from django.http import HttpResponse, JsonResponse

from ..models import Notification
from ..serializers.notification_serializers import NotificationSerializer

import json

def get_notifications(request):
    if not request.user.is_authenticated or request.method != "GET":
        return HttpResponse(status=405)
    
    notifications = request.user.notifications.all()
    serializer = NotificationSerializer(notifications, many=True) if notifications != None else None

    return JsonResponse(serializer.data, status=200, safe=False)

def read_notification(request):
    data = json.loads(request.body)
    notification_id = data.get("notification_id")
    
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

def create_announcement_notification(announcement, request):
    path = f"/announcements/{announcement.id}"
    origin_user = request.user
    text = "posted a new announcement"
    User = get_user_model()

    users = User.objects.all()

    notifications = []

    for user in users:
        if user != origin_user:
            notification = Notification.objects.create(
                user = user,
                origin_user = origin_user,
                path = path,
                text = text,
            )
            notifications.append(notification)

    return notifications

def create_announcement_comment_notification(announcement, comment, request):
    path = f"/announcements/{announcement.id}?comment={comment.id}"
    origin_user = request.user
    text = "commented on your announcement"
    user = announcement.user

    if user == origin_user:
        return None
    
    notification = Notification.objects.create(
        user = user,
        origin_user = origin_user,
        path = path,
        text = text,
    )

    return notification

def create_comment_response_notification(parent_comment, child_comment, announcement, request):
    path = f"/announcements/{announcement.id}?comment={parent_comment.id}&response={child_comment.id}"
    origin_user = request.user
    text = "replied to your comment"
    user = parent_comment.user

    if user == origin_user:
        return None
    
    notification = Notification.objects.create(
        user = user,
        origin_user = origin_user,
        path = path,
        text = text,
    )

    return notification