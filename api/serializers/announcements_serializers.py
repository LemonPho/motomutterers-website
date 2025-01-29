from rest_framework import serializers

from . import user_serializers

from .serializers_util import sanitize_html
from .comments_serializers import CommentReadSerializer


from ..models import Announcement, AnnouncementComment, CompetitorPoints, CompetitorPosition, Competitor

class AnnouncementWriteSerializer(serializers.ModelSerializer):
    text = serializers.CharField(write_only=True)
    title = serializers.CharField(write_only=True)

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

class AnnouncementParentCommentSerializer(serializers.ModelSerializer):
    announcement = AnnouncementSerializer()
    user = user_serializers.UserSimpleSerializer()
    class Meta:
        model = AnnouncementComment
        fields = ["id", "text", "announcement", "user", "date_created", "edited"]

    def get_amount_replies(self, comment):
        amount_replies = comment.replies.count()
        amount_replies = str(amount_replies)
        return amount_replies

class AnnouncementCommentSerializer(serializers.ModelSerializer):
    user = user_serializers.UserSimpleSerializer(read_only=True)
    amount_replies = serializers.SerializerMethodField(read_only=True)
    replies = serializers.SerializerMethodField(read_only=True)
    announcement = AnnouncementSerializer(read_only=True)
    parent_comment = serializers.SerializerMethodField(read_only=True)
    date_created = serializers.DateTimeField(read_only=True)
    edited = serializers.BooleanField(read_only=True)

    #fields for creating
    announcementId = serializers.IntegerField(write_only=True, required=False)
    commentId = serializers.IntegerField(write_only=True, required=False) #sent if comment is a response to another comment
    class Meta:
        model = AnnouncementComment
        #fields for serializing
        fields = ["id", "text", "replies", "amount_replies", "announcement", "parent_comment", "user", "date_created", "edited"]
        #fields for creating
        fields += ["announcementId", "commentId"]

    def get_amount_replies(self, comment):
        amount_replies = comment.replies.count()
        amount_replies = str(amount_replies)
        return amount_replies
    
    def get_replies(self, comment):
        replies = comment.replies.all()
        replies = AnnouncementCommentSerializer(replies, many=True)
        return replies.data
    
    def get_parent_comment(self, comment):
        if comment.parent_comment == None:
            return None
        parent_comment = comment.parent_comment
        serializer = AnnouncementParentCommentSerializer(parent_comment)
        return serializer.data
    
    def validate_text(self, value):
        if not value:
            raise serializers.ValidationError("no text found")
        value = sanitize_html(value)
        return value
    
    def create(self, validated_data):
        request = self.context.get("request")

        if not request.user.is_authenticated:
            raise serializers.ValidationError("User is not logged in")
        
        try:
            announcement = Announcement.objects.get(pk=validated_data.get("announcementId"))
        except Announcement.DoesNotExist:
            raise serializers.ValidationError("Announcement not found")
        
        #check if comment is a reply or normal comment
        if validated_data.get("commentId"):
            try:
                parent_comment = AnnouncementComment.objects.filter(announcement=announcement).get(pk=validated_data.get("commentId"))
            except AnnouncementComment.DoesNotExist:
                raise serializers.ValidationError("Parent comment not found")
            
            validated_data.pop("commentId")
            validated_data.pop("announcementId")

            announcement_comment = AnnouncementComment.objects.create(user=request.user, announcement=announcement, parent_comment=parent_comment, **validated_data)            
        else:
            validated_data.pop("announcementId")

            announcement_comment = AnnouncementComment.objects.create(user=request.user, announcement=announcement, **validated_data)

        return announcement_comment
    
    def update(self, instance, validated_data):
        instance.text = validated_data.get("text")
        instance.edited = True
        instance.save()

        return instance
