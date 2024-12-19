from rest_framework import serializers

from . import competitors_serializers, user_serializers

from ..models import Race, RaceComment

import importlib

class RaceSimpleSerializer(serializers.ModelSerializer):
    title = serializers.CharField()
    track = serializers.CharField()
    timestamp = serializers.CharField()
    is_sprint = serializers.BooleanField()
    finalized = serializers.BooleanField()
    competitors_positions = serializers.SerializerMethodField()
    id = serializers.IntegerField()

    class Meta:
        model = Race
        fields = ["title", "track", "timestamp", "is_sprint", "finalized", "competitors_positions", "id"]

    def get_competitors_positions(self, race):
        if race.finalized:
            competitors_positions = race.competitors_positions.order_by("position")
            competitors_positions = list(competitors_positions)

            competitors_dnf = []
            i=0

            while i < len(competitors_positions):
                if competitors_positions[i].position == 0 and len(competitors_positions) > 1:
                    competitors_dnf.append(competitors_positions.pop(i))
                else:
                    i += 1
            
            competitors_positions += competitors_dnf
                    
        else:
            competitors_positions = race.competitors_positions.all()

        
        serializer = competitors_serializers.CompetitorPositionSimpleSerializer(competitors_positions, many=True)
        return serializer.data

class RaceWriteSerializer(serializers.ModelSerializer):
    competitors_positions = serializers.SerializerMethodField()
    class Meta:
        model = Race
        fields = ["id", "title", "track", "timestamp", "is_sprint", "finalized", "competitors_positions"]
    
    def validate_track(self, value):
        value = importlib.import_module("api.serializers.serializers_util").sanitize_html(value)
        return value
    
    def validate_title(self, value):
        value = importlib.import_module("api.serializers.serializers_util").sanitize_html(value)
        return value

class RaceParentCommentSerializer(serializers.ModelSerializer):
    user = user_serializers.UserSerializer()
    race = RaceWriteSerializer()

    class Meta:
        model = RaceComment
        fields = ["id", "text", "user", "race", "date_created"]

class RaceCommentSerializer(serializers.ModelSerializer):
    user = user_serializers.UserSerializer()
    race = RaceWriteSerializer()
    parent_comment = serializers.SerializerMethodField()

    class Meta:
        model = RaceComment
        fields = ["id", "text", "user", "race", "parent_comment", "date_created"]

    def get_parent_comment(self, parent_comment):
        if parent_comment == None:
            return None
        
        serializer = RaceParentCommentSerializer(parent_comment)
        return serializer.data
