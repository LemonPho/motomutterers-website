from django.http import HttpResponse, JsonResponse

import json

from ...models import Announcement, AnnouncementComment
from ..notification_view import create_announcement_notification, create_announcement_comment_notification, create_comment_response_notification
from ...serializers.announcements_serializers import AnnouncementWriteSerializer, AnnouncementCommentSerializer, AnnouncementSerializer

#retrieving the 10 announcements of this page
def get_announcements(request):
    if request.method != "GET":
        return HttpResponse(status=405)

    id = int(request.GET.get("id", False))

    page = int(request.GET.get('page', 1))
    end = (page * 10)
    start = end - 10

    #for getting one announcement
    if id:
        announcement = retrieve_one_announcement(id)

        if announcement == None:
            return HttpResponse(status=404)
        
        announcement_serializer = AnnouncementSerializer(announcement)
        return JsonResponse({
            "announcement": announcement_serializer.data,
        }, status=200)
    #for getting multiple announcements
    else:
        amount_announcements = Announcement.objects.count()
        announcements = retrieve_multiple_announcements(start, end)
        if announcements == None:
            return HttpResponse(status=404)
        
        serialized_announcements = AnnouncementSerializer(announcements, many=True)
        return JsonResponse({
            "announcements": serialized_announcements.data,
            "amount_announcements": amount_announcements,
        }, status=200)

#getting comments of an announcement 
def get_announcement_comments(request):
    if request.method != "GET":
        return HttpResponse(status=405)
    
    id = int(request.GET.get("id", False))

    #if id is false, means url is invalid
    if not id:
        return HttpResponse(status=404)
    
    #id is valid
    announcement = retrieve_one_announcement(id)

    #if announcement doesnt exist
    if announcement == None:
        return HttpResponse(status=404)
    
    comments = retrieve_comments(announcement)
    comments_serializer = AnnouncementCommentSerializer(comments, many=True)

    return JsonResponse(comments_serializer.data, status=200, safe=False)
    
def get_comment(request):
    if request.method != "GET" or not request.user.is_authenticated:
        return HttpResponse(status=405)

    comment_id = int(request.GET.get("commentId", -1))
    
    try:
        comment = AnnouncementComment.objects.get(pk=comment_id)
    except AnnouncementComment.DoesNotExist:
        return HttpResponse(status=400)
    
    serializer = AnnouncementCommentSerializer(comment)

    return JsonResponse({
        "comment": serializer.data,
    }, status=200)
    

def edit_comment(request):
    if request.method != "POST" or not request.user.is_authenticated:
        return HttpResponse(status=405)
    
    data = json.loads(request.body)
    comment_id = data.get("commentId", -1)
    data.pop("commentId")
    
    try:
        comment = AnnouncementComment.objects.get(pk=comment_id)
    except AnnouncementComment.DoesNotExist:
        return HttpResponse(status=400)
    
    if comment.user.id != request.user.id:
        return HttpResponse(status=403)
    
    serializer = AnnouncementCommentSerializer(data=data, instance=comment)
    if not serializer.is_valid():
        return HttpResponse(status=400)
    
    serializer.save()

    return HttpResponse(status=200)

def delete_comment(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    
    if not request.user.is_authenticated:
        return HttpResponse(status=403)
    
    data = json.loads(request.body)
    comment_id = data.get("commentId", -1)

    try:
        comment = AnnouncementComment.objects.get(pk=comment_id)
    except AnnouncementComment.DoesNotExist:
        return HttpResponse(status=400)
    
    if comment.user.id != request.user.id and not request.user.is_admin:
        return HttpResponse(status=403)
    
    comment.delete()
    return HttpResponse(status=200)

#get the replies of a comment  
def get_comment_replys(request):
    comment_id = int(request.GET.get("commentId", False))

    if request.method != "GET" or not request.user.is_authenticated or not id:
        return HttpResponse(status=405)
    
    try:
        comment = AnnouncementComment.objects.get(pk=comment_id)
    except AnnouncementComment.DoesNotExist:
        return HttpResponse(status=404)
    
    replys = retrieve_comment_replys(comment)

    serializer = AnnouncementCommentSerializer(replys, many=True)
    return JsonResponse(serializer.data, status=200, safe=False)

#get one announcement (detailed view)       
def retrieve_one_announcement(id):
    try:
        announcement = Announcement.objects.get(pk=id)
        return announcement
    except Announcement.DoesNotExist:
        return None

#post announcement, checks if user is admin and verifies post integrity  
def post_announcement(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    
    if not request.user.is_authenticated or not request.user.is_admin:
        return HttpResponse(status=403)
    
    
    data = json.loads(request.body)
    serializer = AnnouncementWriteSerializer(data=data, context={'request': request})

    if not serializer.is_valid():
        print(serializer.errors)
        return HttpResponse(status=400)
    
    announcement = serializer.save()

    notifications = create_announcement_notification(announcement=announcement, request=request)

    if len(notifications) > 0:
        for notification in notifications:
            announcement.notifications.add(notification)

    announcement.save()

    return HttpResponse(status=200)

def edit_announcement(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    
    if not request.user.is_authenticated or not request.user.is_admin:
        return HttpResponse(status=403)
    
    data = json.loads(request.body)
    announcement_id = data.get("announcementId", -1)

    if announcement_id == -1:
        return HttpResponse(status=400)
    
    try:
        announcement = Announcement.objects.get(pk=announcement_id)
    except Announcement.DoesNotExist:
        return HttpResponse(status=400)
    
    serializer = AnnouncementSerializer(data=data, instance=announcement)
    if not serializer.is_valid():
        return HttpResponse(status=400)
    
    serializer.save()
    return HttpResponse(status=200)

def delete_announcement(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    
    if not request.user.is_authenticated or not request.user.is_admin:
        return HttpResponse(status=403)
    
    data = json.loads(request.body)
    announcement_id = data.get("announcementId", -1)

    try:
        announcement = Announcement.objects.get(pk=announcement_id)
    except Announcement.DoesNotExist:
        return HttpResponse(status=400)
    
    announcement.delete()
    return HttpResponse(status=200)

def post_comment(request):
    data = json.loads(request.body)
    announcement_id = data.get("announcementId", False)

    if announcement_id:
        try:
            announcement = Announcement.objects.get(pk=announcement_id)
        except Announcement.DoesNotExist:
            announcement = None

    if request.method != "POST" or not announcement_id or announcement == None or not request.user.is_authenticated:
        return HttpResponse(status=405)
    
    serializer = AnnouncementCommentSerializer(data=data, context={'request': request, 'announcement_id': announcement_id})

    if not serializer.is_valid():
        return HttpResponse(status=400)
    
    comment = serializer.save()

    notification = create_announcement_comment_notification(announcement=announcement, comment=comment, request=request)
    if notification is not None:
        comment.notifications.add(notification)

    return HttpResponse(status=200)

def post_comment_response(request):
    data = json.loads(request.body)
    comment_id = data.get("commentId", False)
    announcement_id = data.get("announcementId", False)

    if comment_id:
        try:
            comment = AnnouncementComment.objects.get(pk=comment_id)
        except AnnouncementComment.DoesNotExist:
            comment = None

    if announcement_id:
        try:
            announcement = Announcement.objects.get(pk=announcement_id)
        except Announcement.DoesNotExist:
            announcement = None

    if request.method != "POST" or not comment_id or comment == None or not announcement_id or not announcement or not request.user.is_authenticated:
        return HttpResponse(status=405)

    serializer = AnnouncementCommentSerializer(data=data, context={'request': request})

    if not serializer.is_valid():
        return HttpResponse(status=400)
    
    comment_reply = serializer.save()

    notification = create_comment_response_notification(parent_comment=comment, child_comment=comment_reply, announcement=announcement, request=request)
    if notification is not None:
        comment.notifications.add(notification)

    return HttpResponse(status=200)

# ------ general functions, do what is in the name ------ #
def retrieve_comments(announcement):
    try:
        comments = announcement.comments.order_by("-date_created")
        return comments
    except Announcement.DoesNotExist:
        return None
    
def retrieve_comment_replys(comment):
    try:
        comments = comment.replies.order_by("-date_created")
        return comments
    except AnnouncementComment.DoesNotExist:
        return None

def retrieve_multiple_announcements(start, end):
    try:
        announcements = Announcement.objects.order_by("-date_created")[start:end]
        return announcements
    except Announcement.DoesNotExist:
        return None
    
