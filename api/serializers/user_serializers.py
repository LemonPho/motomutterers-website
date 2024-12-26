from rest_framework import serializers
from django.contrib.auth import get_user_model

import importlib
import base64

ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "ico", "svg", "heic", "heif"]
USERS_PICKS_LENGTH = 5

User = get_user_model()

class ProfilePictureSerializer(serializers.Serializer):
    profile_picture_format = serializers.SerializerMethodField()
    profile_picture_data = serializers.SerializerMethodField()

    class Meta:
        fields = ["profile_picture_format", "profile_picture_data"]

    def get_profile_picture_data(self, profile_picture):
        if profile_picture:
            with open(profile_picture.path, 'rb') as profile_picture_file:
                profile_picture_data = base64.b64encode(profile_picture_file.read()).decode("utf-8")
                return profile_picture_data
        else:
            default_profile_picture_path = "media/profile_pictures/default.webp"
            with open(default_profile_picture_path, 'rb') as profile_picture_file:
                profile_picture_data = base64.b64encode(profile_picture_file.read()).decode("utf-8")
                return profile_picture_data
        
    def get_profile_picture_format(self, profile_picture):
        if profile_picture:
            return profile_picture.name.split('.')[-1].lower()
        else:
            return ".webp"


class UserSimpleSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    id = serializers.IntegerField()

    class Meta:
        model = User
        fields = ["username", "id"]

class UserSimpleProfilePictureSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    profile_picture = ProfilePictureSerializer()
    id = serializers.IntegerField()

    class Meta:
        model = User
        fields = ["username", "profile_picture", "id"]
        
class UserSerializer(serializers.ModelSerializer):
    notifications = serializers.SerializerMethodField()
    profile_picture_data = serializers.SerializerMethodField()
    profile_picture_format = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()
    is_logged_in = serializers.SerializerMethodField()
    class Meta:
        model = get_user_model()
        fields = ["id", "username", "email", "date_created", "date_username_edited", "profile_picture_data", "profile_picture_format", "is_admin", "is_active", "is_logged_in", "notifications"]

    #get functions
    def get_is_admin(self, user):
        return user.is_admin
    
    def get_is_active(self, user):
        return user.is_active
    
    def get_is_logged_in(self, user):
        return user.is_authenticated

    def get_profile_picture_data(self, user):
        if user.profile_picture:
            with open(user.profile_picture.path, 'rb') as profile_picture_file:
                profile_picture_data = base64.b64encode(profile_picture_file.read()).decode("utf-8")
                return profile_picture_data
        else:
            default_profile_picture_path = "media/profile_pictures/default.webp"
            with open(default_profile_picture_path, 'rb') as profile_picture_file:
                profile_picture_data = base64.b64encode(profile_picture_file.read()).decode("utf-8")
                return profile_picture_data
        
    def get_profile_picture_format(self, user):
        if user.profile_picture:
            return user.profile_picture.name.split('.')[-1].lower()
        else:
            return ".webp"
        
    def get_notifications(self, user):
        notifications = user.notifications.all()
        if notifications is None:
            return notifications
        serializer = importlib.import_module("api.serializers.notification_serializers").NotificationSerializer(notifications, many=True)
        return serializer.data
    
    #validate functions
    def validate_profile_picture(self, value):
        if not value:
            raise serializers.ValidationError("No image found")
        file_extension = value.name.split('.')[-1].lower()
        if file_extension not in ALLOWED_EXTENSIONS:
            raise serializers.ValidationError("Extension not supported")
        
        return value