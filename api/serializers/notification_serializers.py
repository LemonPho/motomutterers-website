from rest_framework import serializers

from ..models import Notification

import importlib

class NotificationSerializer(serializers.ModelSerializer):
    origin_user = importlib.import_module("api.serializers.user_serializers").UserSimpleSerializer()

    class Meta:
        model = Notification
        fields = ["id", 'origin_user', 'text', 'path', 'date_created', 'read'] 