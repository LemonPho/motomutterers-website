from rest_framework import serializers

from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site

from ..models import Comment, Announcement, RaceWeekend, Notification
from ..views.notification_view import create_notifications
from ..views.utils_view import send_emails
from ..views.comments_view.comments_util import send_comment_response_email_notification, send_announcement_response_email_notification
from .serializers_util import sanitize_html

from ..utils import sanitize_text

import importlib

class CommentWriteSerializer(serializers.ModelSerializer):
    text = serializers.CharField(allow_blank=False)
    user = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all())
    parent_comment = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all(), required=False)
    announcement = serializers.PrimaryKeyRelatedField(queryset=Announcement.objects.all(), required=False)
    race_weekend = serializers.PrimaryKeyRelatedField(queryset=RaceWeekend.objects.all(), required=False)

    class Meta:
        model = Comment
        fields = ["text", "user", "parent_comment", "announcement", "race_weekend"]

    def create(self, validated_data):
        request = self.context.get("request", False)
        text = validated_data.pop("text")
        text = sanitize_html(text)

        parent_comment = validated_data.pop("parent_comment", None)
        user = validated_data.pop("user", None)
        notifications = None
        announcement = validated_data.get("announcement", None)
        race_weekend = validated_data.get("race_weekend", None)

        if user is None:
            raise serializers.ValidationError("Need to have user data when creating comment")

        if parent_comment:
            instance = Comment.objects.create(text=text, user=user, parent_comment=parent_comment)
            if announcement and parent_comment.user.id != user.id:
                notifications = create_notifications("responded to your comment", f"announcements/{announcement.id}?comment={instance.id}", user, [parent_comment.user])
                if parent_comment.user.comment_response_emails and request and parent_comment.user.id != user.id:
                    send_comment_response_email_notification(parent_comment, instance, f"announcements/{announcement.id}?comment={instance.id}", request)
            elif race_weekend and parent_comment.user.id != user.id:
                notifications = create_notifications("responded to your comment", f"race-weekends/{race_weekend.id}?comment={instance.id}", user, [parent_comment.user])
                if parent_comment.user.comment_response_emails and request and parent_comment.user.id != user.id:
                    send_comment_response_email_notification(parent_comment, instance, f"race-weekends/{race_weekend.id}?comment={instance.id}", request)
        else:
            instance = Comment.objects.create(text=text, user=user)
                
        if parent_comment is None:
            if announcement:
                announcement.comments.add(instance)
                notifications = create_notifications("added a comment to your announcement", f"announcements/{announcement.id}?comment={instance.id}", user, [announcement.user])
                if announcement.user.announcement_response_emails and request and instance.user.id != user.id:
                    send_announcement_response_email_notification(instance, instance.announcement.first().user, f"announcements/{instance.announcement.first().id}?comment={instance.id}", request)
            elif race_weekend:
                race_weekend.comments.add(instance)

        if notifications:
            instance.notifications.add(*notifications)

        return instance
    
    def update(self, instance, validated_data):
        instance.text = validated_data["text"]
        instance.edited = True
        instance.save()
        return instance
        
class ParentCommentReadSerializer(serializers.ModelSerializer):
    text = serializers.CharField(read_only=True)
    user = importlib.import_module("api.serializers.user_serializers").UserSimpleSerializer()
    date_created = serializers.DateTimeField()
    announcement = serializers.SerializerMethodField()
    race_weekend = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["text", "user", "date_created", "announcement", "race_weekend", "id"]

    def get_announcement(self, comment):        
        announcement = comment.announcement.first()
        if announcement is None:
            return None
        serializer = importlib.import_module("api.serializers.announcements_serializers").AnnouncementSimpleSerializer(announcement)
        return serializer.data
    
    def get_race_weekend(self, comment):
        race_weekend = comment.race_weekend.first()
        if race_weekend is None:
            return None
        
        serializer = importlib.import_module("api.serializers.races_serializers").RaceWeekendSimpleSerializer(race_weekend)

        return serializer.data
    
class CommentReadSerializer(serializers.ModelSerializer):
    text = serializers.CharField(read_only=True)
    user = importlib.import_module("api.serializers.user_serializers").UserSimpleSerializer()
    amount_replies = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    parent_comment = serializers.SerializerMethodField()
    date_created = serializers.DateTimeField()
    announcement = serializers.SerializerMethodField()
    race_weekend = serializers.SerializerMethodField()


    class Meta:
        model = Comment
        fields = ["text", "user", "amount_replies", "replies", "parent_comment", "date_created", "edited", "announcement", "race_weekend", "id"]

    def get_amount_replies(self, comment):
        amount_replies = str(comment.replies.count())
        return amount_replies
    
    def get_replies(self, comment):
        replies = comment.replies.all()
        serializer = CommentReadSerializer(replies, many=True)
        return serializer.data
    
    def get_parent_comment(self, comment):
        if comment.parent_comment is None:
            return None
        
        serializer = ParentCommentReadSerializer(comment.parent_comment)
        return serializer.data
    
    def get_announcement(self, comment):        
        announcement = comment.announcement.first()
        if announcement is None:
            return None
        serializer = importlib.import_module("api.serializers.announcements_serializers").AnnouncementSimpleSerializer(announcement)
        return serializer.data
    
    def get_race_weekend(self, comment):
        race_weekend = comment.race_weekend.first()
        if race_weekend is None:
            return None
        
        serializer = importlib.import_module("api.serializers.races_serializers").RaceWeekendSimpleSerializer(race_weekend)

        return serializer.data