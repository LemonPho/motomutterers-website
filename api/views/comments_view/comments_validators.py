from ...models import Announcement, Race

def validate_generate_comment_data(data, request, parent_element, parent_element_id):
    response = {
        "text": data["text"],
        "user": request.user.id,
    }

    parent_comment_id = data.pop("commentId")
    announcement = None
    race = None

    if parent_comment_id:
        response["parent_comment"] = parent_comment_id

    if parent_element == "ANNOUNCEMENT":
        try:
            announcement = Announcement.objects.get(pk=parent_element_id)
        except Announcement.DoesNotExist:
            announcement = None
    elif parent_element == "RACE":
        try:
            race = Race.objects.get(pk=parent_element_id)
        except Race.DoesNotExist:
            race = None
    
    if announcement:
        response["announcement"] = announcement.id
    else:
        response["race"] = race.id

    return response