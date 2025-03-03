from rest_framework import serializers
from django.contrib.auth import get_user_model

from ..models import Notification

import importlib

class NotificationReadSerializer(serializers.ModelSerializer):
    origin_user = importlib.import_module("api.serializers.user_serializers").UserSimpleSerializer()

    class Meta:
        model = Notification
        fields = ["id", 'origin_user', 'text', 'path', 'date_created', 'read']

class NotificationWriteSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all())
    origin_user = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all())

    class Meta:
        model = Notification
        fields = ["origin_user", "user", "text", "path"]