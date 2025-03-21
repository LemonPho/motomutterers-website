from ...models import Announcement, RaceWeekend

def validate_generate_comment_data(data, request, parent_element, parent_element_id):
    response = {
        "text": data["text"],
        "user": request.user.id,
    }

    parent_comment_id = data.pop("commentId")

    announcement = None
    race_weekend = None

    if parent_comment_id:
        response["parent_comment"] = parent_comment_id

    if parent_element == "ANNOUNCEMENT":
        try:
            announcement = Announcement.objects.get(pk=parent_element_id)
        except Announcement.DoesNotExist:
            announcement = None
    elif parent_element == "RACE_WEEKEND":
        try:
            race_weekend = RaceWeekend.objects.get(pk=parent_element_id)
        except Race.DoesNotExist:
            race_weekend = None
    
    if announcement:
        response["announcement"] = announcement.id
    else:
        response["race_weekend"] = race_weekend.id

    return response