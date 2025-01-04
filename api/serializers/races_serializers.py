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
    
class UpcomingRaceWriteSerializer(serializers.ModelSerializer):
    qualifying_positions = competitors_serializers.CompetitorPositionWriteSerializer(many=True)
    class Meta:
        model = Race
        fields = ["id", "title", "track", "timestamp", "is_sprint", "finalized", "qualifying_positions"]

    def validate_track(self, value):
        value = importlib.import_module("api.serializers.serializers_util").sanitize_html(value)
        return value
    
    def validate_title(self, value):
        value = importlib.import_module("api.serializers.serializers_util").sanitize_html(value)
        return value

    def create(self, instance, validated_data):
        qualifying_positions = validated_data.pop("qualifying_positions", False)

        if not qualifying_positions:
            raise serializers.ValidationError("Qualifying positions must be included in upcoming race")
        
        instance.qualifying_positions.add(*qualifying_positions)
        instance.save()

        return instance

class RaceWriteSerializer(serializers.ModelSerializer):
    competitors_positions = serializers.JSONField()

    class Meta:
        model = Race
        fields = ["id", "title", "track", "timestamp", "is_sprint", "finalized", "competitors_positions"]
    
    def validate_track(self, value):
        value = importlib.import_module("api.serializers.serializers_util").sanitize_html(value)
        return value
    
    def validate_title(self, value):
        value = importlib.import_module("api.serializers.serializers_util").sanitize_html(value)
        return value
    
    def validate_competitors_positions(self, competitors_positions):
        serializer = competitors_serializers.CompetitorPositionWriteSerializer(data=competitors_positions, many=True)

        if not serializer.is_valid():
            raise serializers.ValidationError(f"Could not create competitors positions: {serializer.errors}")
        
        instances = serializer.save()
        return instances
    
    def create(self, validated_data):
        competitors_positions = validated_data.pop("competitors_positions", False)

        #print(competitors_positions)

        if not competitors_positions:
            raise serializers.ValidationError("Competitors positions must be included in final race serializer")
        
        instance = Race.objects.create(**validated_data)
        
        instance.competitors_positions.add(*competitors_positions)
        instance.save()

        return instance

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
