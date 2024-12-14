from rest_framework import serializers
from django.contrib.auth import get_user_model
from pillow_heif import register_heif_opener, from_bytes
from io import BytesIO
from PIL import Image

import base64

ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "ico", "svg", "heic", "heif"]

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
        
