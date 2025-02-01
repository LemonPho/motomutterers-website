from rest_framework import serializers

from django.contrib.auth import get_user_model

from ..models import Comment
from .serializers_util import sanitize_html

from ..utils import sanitize_text

import importlib

class CommentWriteSerializer(serializers.ModelSerializer):
<<<<<<< HEAD
    text = serializers.CharField()
    user = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all(), required=False)
=======
    text = serializers.CharField(allow_blank=False)
    user = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all())
>>>>>>> new_features
    parent_comment = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all(), required=False)

    class Meta:
        model = Comment
        fields = ["text", "user", "parent_comment"]

    def create(self, validated_data):
        text = validated_data.pop("text")
        text = sanitize_html(text)

        parent_comment = validated_data.pop("parent_comment", None)
        user = validated_data.pop("user", None)

        if user is None:
            raise serializers.ValidationError("Need to have user data when creating comment")

        if parent_comment:
            instance = Comment.objects.create(text=text, user=user, parent_comment=parent_comment)
        else:
            instance = Comment.objects.create(text=text, user=user)

        #TODO: create notifications for comment

        return instance
    
    def update(self, instance, validated_data):
<<<<<<< HEAD
        text = validated_data.pop("text")
        text = sanitize_text(text)
        instance.text = text
        instance.save()
        return instance

    
=======
        instance.text = validated_data["text"]
        instance.edited = True
        instance.save()
        return instance
        
>>>>>>> new_features
class ParentCommentReadSerializer(serializers.ModelSerializer):
    text = serializers.CharField(read_only=True)
    user = importlib.import_module("api.serializers.user_serializers").UserSimpleSerializer()
    date_created = serializers.DateTimeField()

    class Meta:
        model = Comment
        fields = ["text", "user", "date_created", "id"]
    
class CommentReadSerializer(serializers.ModelSerializer):
    text = serializers.CharField(read_only=True)
    user = importlib.import_module("api.serializers.user_serializers").UserSimpleSerializer()
    amount_replies = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    parent_comment = serializers.SerializerMethodField()
    date_created = serializers.DateTimeField()


    class Meta:
        model = Comment
        fields = ["text", "user", "amount_replies", "replies", "parent_comment", "date_created", "edited", "id"]

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