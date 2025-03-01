from rest_framework import serializers

from . import user_serializers

from .serializers_util import sanitize_html
from .comments_serializers import CommentReadSerializer


from ..models import Announcement, CompetitorPoints, CompetitorPosition, Competitor

class AnnouncementWriteSerializer(serializers.ModelSerializer):
    text = serializers.CharField(write_only=True, allow_blank=False)
    title = serializers.CharField(write_only=True, allow_blank=False)

    class Meta:
        model = Announcement
        fields = ["title", "text"]

    def validate_title(self, value):
        if not value:
            raise serializers.ValidationError("No title found")
        value = sanitize_html(value)
        return value
    
    def validate_text(self, value):
        if not value:
            raise serializers.ValidationError("No text found")
        value = sanitize_html(value)
        return value
    
    def create(self, validated_data):
        request = self.context.get('request')

        if not request.user.is_admin:
            raise serializers.ValidationError("User is not an admin")
        
        announcement = Announcement.objects.create(user=request.user, **validated_data)
        
        return announcement

class AnnouncementSerializer(serializers.ModelSerializer):
    user = user_serializers.UserSimpleSerializer(read_only=True)
    edited = serializers.BooleanField(read_only=True)
    date_created = serializers.DateTimeField(read_only=True)
    date_edited = serializers.DateTimeField(read_only=True)
    amount_comments = serializers.SerializerMethodField()
    comments = CommentReadSerializer(many=True)
    class Meta:
        model = Announcement
        fields = ["id", "title", "text", "user", "edited", "date_created", "date_edited", "amount_comments", "comments"]

    def get_amount_comments(self, announcement):
        return announcement.comments.count()
    
class AnnouncementSimpleSerializer(serializers.ModelSerializer):
    title = serializers.CharField(read_only=True)
    text = serializers.CharField(read_only=True)
    user = user_serializers.UserSimpleSerializer(read_only=True)
    edited = serializers.BooleanField(read_only=True)
    date_created = serializers.DateTimeField(read_only=True)
    date_edited = serializers.DateTimeField(read_only=True)
    amount_comments = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Announcement
        fields = ["id", "title", "text", "user", "edited", "date_created", "date_edited", "amount_comments"]

    def get_amount_comments(self, announcement):
        return announcement.comments.count()