from rest_framework import serializers
from pillow_heif import register_heif_opener, from_bytes
from io import BytesIO
from PIL import Image

import base64

ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "ico", "svg", "heic", "heif"]

class UserSimple():
    def __init__(self, username=None, id=None):
        self.username = username
        self.id = id

class UserSimpleProfilePicture():
    def __init__(self, username=None, id=None, profile_picture=None):
        self.username = username
        self.id = id
        self.profile_picture = profile_picture

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


class UserSimpleSerializer(serializers.Serializer):
    username = serializers.CharField()
    id = serializers.IntegerField()

    class Meta:
        fields = ["username", "id"]

class UserSimpleProfilePictureSerializer(serializers.Serializer):
    username = serializers.CharField()
    profile_picture = ProfilePictureSerializer()
    id = serializers.IntegerField()

    class Meta:
        fields = ["username", "profile_picture", "id"]
        
