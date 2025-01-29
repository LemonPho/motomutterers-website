from rest_framework import serializers

from django.contrib.auth import get_user_model

from ..models import Comment
from .serializers_util import sanitize_html

import importlib

class CommentWriteSerializer(serializers.ModelSerializer):
    text = serializers.CharField()
    user = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all())
    parent_comment = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all(), required=False)

    class Meta:
        model = Comment
        fields = ["text", "user", "parent_comment"]

    def create(self, validated_data):
        text = validated_data.pop("text")
        text = sanitize_html(text)

        parent_comment = validated_data.pop("parent_comment", None)

        if parent_comment:
            instance = Comment.objects.create(text=text, user=validated_data.pop("user"), parent_comment=parent_comment)
        else:
            instance = Comment.objects.create(text=text, user=validated_data.pop("user"))

        #TODO: create notifications for comment

        return instance
    
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
        fields = ["text", "user", "amount_replies", "replies", "parent_comment", "date_created", "id"]

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