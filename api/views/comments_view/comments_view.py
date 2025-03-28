from django.http import HttpResponse, JsonResponse

from ...models import Announcement, Comment, Race, RaceWeekend
from ...serializers.comments_serializers import CommentWriteSerializer, CommentReadSerializer

from .comments_validators import validate_generate_comment_data

import json

def get_comments(request):
    if request.method != "GET":
        return HttpResponse(status=405)

    parent_element = request.GET.get("parentElement", False)
    parent_id = request.GET.get("id", -1)

    if not parent_element or parent_id == -1:
        return HttpResponse(status=400)
    
    if parent_element == "RACE_WEEKEND":
        try:
            element = RaceWeekend.objects.get(pk=parent_id)
        except RaceWeekend.DoesNotExist:
            return HttpResponse(status=404)
    elif parent_element == "ANNOUNCEMENT":
        try:
            element = Announcement.objects.get(pk=parent_id)
        except Announcement.DoesNotExist:
            return HttpResponse(status=404)
    else:
        return HttpResponse(status=400)
    
    comments = element.comments.all()
    serializer = CommentReadSerializer(comments, many=True)

    return JsonResponse({
        "comments": serializer.data,
    }, status=200)


def post_comment(request):
    data = json.loads(request.body)
    parent_element = data.get("parentElement", False)
    parent_element_id = data.get("id", False)

    if request.method != "POST" or not request.user.is_authenticated:
        return HttpResponse(status=405)
    
    validated_data = validate_generate_comment_data(data, request, parent_element, parent_element_id)
    context = {
        "request": request,
    }
    
    serializer = CommentWriteSerializer(data=validated_data, context=context)

    if not serializer.is_valid():
        return HttpResponse(status=400)
    
    instance = serializer.save()
    print(instance.id)

    return JsonResponse({"new_comment_id": instance.id}, status=201)

def edit_comment(request):
    if request.method != "PUT" or not request.user.is_authenticated:
        return HttpResponse(status=405)
    
    data = json.loads(request.body)
    comment_id = data.get("commentId", -1)
    data.pop("commentId")
    
    try:
        comment = Comment.objects.get(pk=comment_id)
    except Comment.DoesNotExist:
        return HttpResponse(status=400)
    
    if comment.user.id != request.user.id:
        return HttpResponse(status=403)
    
    data["user"] = request.user.id
    context = {
        "request": request
    }
    
    serializer = CommentWriteSerializer(data=data, context=context, instance=comment)
    if not serializer.is_valid():
        return HttpResponse(status=400)
        
    comment = serializer.save()

    return HttpResponse(status=201)

def delete_comment(request):
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
    return HttpResponse(status=201)