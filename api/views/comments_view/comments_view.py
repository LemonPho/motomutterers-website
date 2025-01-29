from django.http import HttpResponse

from ...models import Announcement, Comment
from ...serializers.comments_serializers import CommentWriteSerializer

from .comments_validators import validate_generate_comment_data

import json

def post_announcement_comment(request):
    data = json.loads(request.body)
    announcement_id = data.get("announcementId", False)

    if announcement_id:
        try:
            announcement = Announcement.objects.get(pk=announcement_id)
        except Announcement.DoesNotExist:
            announcement = None

    if request.method != "POST" or not announcement_id or announcement == None or not request.user.is_authenticated:
        return HttpResponse(status=405)
    
    validated_data = validate_generate_comment_data(data, request)
    
    serializer = CommentWriteSerializer(data=validated_data)
    
    if not serializer.is_valid():
        print(serializer.errors)
        return HttpResponse(status=400)
    
    comment = serializer.save()
    announcement.comments.add(comment)
    announcement.save()

    return HttpResponse(status=200)

def edit_announcement_comment(request):
    if request.method != "POST" or not request.user.is_authenticated:
        return HttpResponse(status=405)
    
    data = json.loads(request.body)
    comment_id = data.get("commentId", -1)
    data.pop("commentId")
    
    try:
        comment = Comment.objects.get(pk=comment_id)
    except CommentWriteSerializer.DoesNotExist:
        return HttpResponse(status=400)
    
    if comment.user.id != request.user.id:
        return HttpResponse(status=403)
    
    serializer = CommentWriteSerializer(data=data, instance=comment)
    if not serializer.is_valid():
        print(serializer.errors)
        return HttpResponse(status=400)
    
    print(serializer)
    
    serializer.save()

    return HttpResponse(status=200)

def delete_announcement_comment(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    
    if not request.user.is_authenticated:
        return HttpResponse(status=403)
    
    data = json.loads(request.body)
    comment_id = data.get("commentId", -1)

    try:
        comment = Comment.objects.get(pk=comment_id)
    except Comment.DoesNotExist:
        return HttpResponse(status=400)
    
    if comment.user.id != request.user.id and not request.user.is_admin:
        return HttpResponse(status=403)
    
    comment.delete()
    return HttpResponse(status=200)