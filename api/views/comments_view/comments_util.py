from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string

from ..utils_view import send_emails

def send_comment_response_email_notification(parent_comment, response_comment, url, request):
    domain = get_current_site(request).domain
    protocol = 'https' if request.is_secure() else 'http'
    users = [parent_comment.user]
    if protocol == "http": users = [request.user] #to avoid accidently sending emails to real users

    parent_comment_data = {
        "username": parent_comment.user.username,
        "text": parent_comment.text,
        "timestamp": parent_comment.date_created,
    }
    response_comment_data = {
        "username": response_comment.user.username,
        "text": response_comment.text,
        "timestamp": response_comment.date_created,
    }

    context = {
        "parent_comment": parent_comment_data,
        "response_comment": response_comment_data,
        "url": f"{protocol}://{domain}/{url}",
    }

    html_content_string = render_to_string("api/comment_response_template.html", context)
    subject = f"{response_comment.user.username} responded to your comment"
    body = html_content_string

    send_emails(subject, body, users, "html")

def send_announcement_response_email_notification(comment, destination_user, url, request):
    announcement = comment.announcement.first()
    domain = get_current_site(request).domain
    protocol = 'https' if request.is_secure() else 'http'
    users = [destination_user]
    if protocol == "http": users = [request.user] #to avoid accidently sending emails to real users

    comment_data = {
        "username": comment.user.username,
        "text": comment.text,
    }
    announcement_data = {
        "title": announcement.title,
        "username": announcement.user.username,
        "timestamp": announcement.date_created,
    }

    context = {
        "comment": comment_data,
        "announcement": announcement_data,
        "url": f"{protocol}://{domain}/{url}",
    }

    html_content_string = render_to_string("api/announcement_response_template.html", context)
    subject = f"{comment.user.username} responded to your announcement"
    body = html_content_string

    send_emails(subject, body, users, "html")
