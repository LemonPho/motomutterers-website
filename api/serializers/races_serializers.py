from rest_framework import serializers
from django.contrib.auth import get_user_model

from . import competitors_serializers, user_serializers

from ..models import Race, RaceWeekend, Season

from ..views.races_view.races_validators import RACE_TYPE_FINAL, RACE_TYPE_SPRINT, RACE_TYPE_UPCOMING
from ..views.notification_view import create_notifications

import importlib

class RaceSimpleSerializer(serializers.ModelSerializer):
    title = serializers.CharField()
    track = serializers.CharField()
    id = serializers.IntegerField()
    finalized = serializers.BooleanField()
    timestamp = serializers.CharField()
    is_sprint = serializers.BooleanField()
    has_url = serializers.SerializerMethodField()

    class Meta:
        model = Race
        fields = ["title", "track", "id", "finalized", "timestamp", "is_sprint", "has_url"]

    def get_has_url(self, race):
        return race.url is not None

class RaceReadSerializer(serializers.ModelSerializer):
    title = serializers.CharField()
    track = serializers.CharField()
    timestamp = serializers.CharField()
    is_sprint = serializers.BooleanField()
    finalized = serializers.BooleanField()
    competitors_positions = serializers.SerializerMethodField()
    qualifying_positions = serializers.SerializerMethodField()
    standings = serializers.SerializerMethodField()
    id = serializers.IntegerField()
    has_url = serializers.SerializerMethodField()

    class Meta:
        model = Race
        fields = ["title", "track", "timestamp", "is_sprint", "finalized", "competitors_positions", "qualifying_positions", "id", "has_url", "standings"]

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
    
    def get_qualifying_positions(self, race):
        qualifying_positions = race.qualifying_positions.order_by("position")
        serializer = competitors_serializers.CompetitorPositionSimpleSerializer(qualifying_positions, many=True)
        return serializer.data
    
    def get_has_url(self, race):
        return race.url is not None
    
    def get_standings(self, race):
        standings = race.standings
        serializer = importlib.import_module("api.serializers.standings_serializers").StandingsRaceSerializer(standings)
        return serializer.data

class RaceWriteSerializer(serializers.ModelSerializer):
    competitors_positions = serializers.JSONField()
    race_weekend = serializers.PrimaryKeyRelatedField(queryset=RaceWeekend.objects.all())
    is_sprint = serializers.BooleanField()

    class Meta:
        model = Race
        fields = ["id", "track", "timestamp", "competitors_positions", "is_sprint"]
    
    def validate_track(self, value):
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
        race_weekend = validated_data.pop("race_weekend")
        is_sprint = validated_data.pop("is_sprint");

        instance = Race.objects.create(**validated_data)
        instance.competitors_positions.add(*competitors_positions)
        notifications = create_notifications("A new race has been submitted", f"raceresults/{instance.id}", None, get_user_model().objects.all())
        instance.notifications.set(notifications)
        
        if not is_sprint:
            race_weekend.race = instance
        else:
            race_weekend.sprint_race = instance
        race_weekend.save()

        return instance
    

# -------------------------------------RACE WEEKEND------------------------------------- #

class RaceWeekendWriteSerializer(serializers.ModelSerializer):
    title = serializers.CharField(write_only=True)
    url = serializers.URLField(write_only=True)
    standings = importlib.import_module("api.serializers.standings_serializers").StandingsWriteSerializer()
    qualifying_positions = serializers.JSONField(required=False)
    season = serializers.PrimaryKeyRelatedField(queryset=Season.objects.all())

    class Meta:
        fields = ["title", "url", "standings", "qualifying_positions"]
        model = RaceWeekend

    def validate_qualifying_positions(self, qualifying_positions):
        serializer = competitors_serializers.CompetitorPositionWriteSerializer(data=qualifying_positions, many=True)

        if not serializer.is_valid():
            raise serializers.ValidationError(f"Could not create qualifying positions: {serializer.errors}")
        
        instances = serializer.save()

        return instances
    
    def create(self, validated_data):
        season = validated_data.pop("season")
        standings = validated_data.pop("standings")

        instance = RaceWeekend.objects.create(**validated_data)
        instance.standings = standings
        season.race_weekends.add(instance)
        instance.save()
        season.save()

        return instance

    def update(self, instance, validated_data):
        qualifying_positions = validated_data.pop("qualifying_positions")
        instance.qualifying_positions.set(qualifying_positions)
        instance.save()
        return instance
