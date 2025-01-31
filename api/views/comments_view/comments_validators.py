def validate_generate_comment_data(data, request):
    response = {
        "text": data["text"],
        "user": request.user.id,
    }

    parent_comment_id = data.pop("commentId")

    if parent_comment_id:
        response["parent_comment"] = parent_comment_id

    return response