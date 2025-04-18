from django.http import HttpResponse, JsonResponse

import json

from ...models import Announcement
from ...serializers.announcements_serializers import AnnouncementWriteSerializer, AnnouncementSerializer, AnnouncementSimpleSerializer

def get_latest_announcement(request):
    if request.method != 'GET':
        return HttpResponse(status=405)
    
    announcement = Announcement.objects.latest("date_created")
    serializer = AnnouncementSimpleSerializer(announcement)
    return JsonResponse({"announcement": serializer.data}, status=200)

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
        
        announcement_serializer = AnnouncementSimpleSerializer(announcement)
        return JsonResponse({
            "announcement": announcement_serializer.data,
        }, status=200)
    #for getting multiple announcements
    else:
        amount_announcements = Announcement.objects.count()
        announcements = retrieve_multiple_announcements(start, end)
        if len(list(announcements)) == 0:
            return HttpResponse(status=404)
        
        serialized_announcements = AnnouncementSimpleSerializer(announcements, many=True)
        return JsonResponse({
            "announcements": serialized_announcements.data,
            "amount_announcements": amount_announcements,
        }, status=200)
    
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
        return HttpResponse(status=400)
    
    announcement = serializer.save()

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
    
    serializer = AnnouncementWriteSerializer(data=data, instance=announcement)
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

# ------ general functions, do what is in the name ------ #
def retrieve_multiple_announcements(start, end):
    announcements = Announcement.objects.order_by("-date_created")[start:end]
    return announcements
    
