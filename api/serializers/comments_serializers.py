from rest_framework import serializers

from django.contrib.auth import get_user_model

from ..models import Comment, Announcement, Race
from ..views.notification_view import create_notifications
from .serializers_util import sanitize_html

from ..utils import sanitize_text

import importlib

class CommentWriteSerializer(serializers.ModelSerializer):
    text = serializers.CharField(allow_blank=False)
    user = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all())
    parent_comment = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all(), required=False)
    announcement = serializers.PrimaryKeyRelatedField(queryset=Announcement.objects.all(), required=False)
    race = serializers.PrimaryKeyRelatedField(queryset=Race.objects.all(), required=False)

    class Meta:
        model = Comment
        fields = ["text", "user", "parent_comment", "announcement", "race"]

    def create(self, validated_data):
        text = validated_data.pop("text")
        text = sanitize_html(text)

        parent_comment = validated_data.pop("parent_comment", None)
        user = validated_data.pop("user", None)

        if user is None:
            raise serializers.ValidationError("Need to have user data when creating comment")

        if parent_comment:
            instance = Comment.objects.create(text=text, user=user, parent_comment=parent_comment)
            if hasattr(parent_comment, "announcement"):
                notification = create_notifications("responded to your comment", f"announcements/{parent_comment.announcement.first().id}?comment={instance.id}", user, [parent_comment.user])
            else:
                notification = create_notifications("responded to your comment", f"raceresults/{parent_comment.race.first().id}?comment={instance.id}", user, [parent_comment.user])
        else:
            instance = Comment.objects.create(text=text, user=user)
            if hasattr(instance, "announcement"):
                notification = create_notifications("added a comment to your announcement", f"announcements/{validated_data['announcement'].id}?comment={instance.id}", user, [validated_data['announcement'].user])

        instance.notifications.add(*notification)

        if parent_comment is None:
            if validated_data['announcement']:
                validated_data['announcement'].comments.add(instance)
            elif validated_data['race']:
                validated_data['race'].comments.add(instance)

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
    race = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["text", "user", "date_created", "announcement", "race", "id"]

    def get_announcement(self, comment):        
        announcement = comment.announcement.first()
        if announcement is None:
            return None
        serializer = importlib.import_module("api.serializers.announcements_serializers").AnnouncementSimpleSerializer(announcement)
        return serializer.data
    
    def get_race(self, comment):
        race = comment.race.first()
        if race is None:
            return None
        
        serializer = importlib.import_module("api.serializers.races_serializers").RaceSimpleSerializer(race)

        return serializer.data
    
class CommentReadSerializer(serializers.ModelSerializer):
    text = serializers.CharField(read_only=True)
    user = importlib.import_module("api.serializers.user_serializers").UserSimpleSerializer()
    amount_replies = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    parent_comment = serializers.SerializerMethodField()
    date_created = serializers.DateTimeField()
    announcement = serializers.SerializerMethodField()
    race = serializers.SerializerMethodField()


    class Meta:
        model = Comment
        fields = ["text", "user", "amount_replies", "replies", "parent_comment", "date_created", "edited", "announcement", "race", "id"]

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
    
    def get_race(self, comment):
        race = comment.race.first()
        if race is None:
            return None
        
        serializer = importlib.import_module("api.serializers.races_serializers").RaceSimpleSerializer(race)

        return serializer.data