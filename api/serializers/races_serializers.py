from rest_framework import serializers
from django.contrib.auth import get_user_model

from . import competitors_serializers, user_serializers

from ..models import Race, RaceWeekend, Season, SeasonMessage

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
        fields = ["id", "track", "timestamp", "competitors_positions", "is_sprint", "race_weekend"]
    
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
        is_sprint = validated_data.pop("is_sprint")

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
    standings = importlib.import_module("api.serializers.standings_serializers").StandingsWriteSerializer(required=False)
    grid = serializers.JSONField(required=False)
    season = serializers.PrimaryKeyRelatedField(queryset=Season.objects.all(), required=False)
    start = serializers.DateField()
    end = serializers.DateField()

    class Meta:
        fields = ["title", "url", "standings", "grid", "start", "end", "season"]
        model = RaceWeekend

    def validate_grid(self, grid_data):
        serializer = competitors_serializers.CompetitorPositionWriteSerializer(data=grid_data, many=True)

        if not serializer.is_valid():
            raise serializers.ValidationError(f"Could not create qualifying positions: {serializer.errors}")
        
        instances = serializer.save()

        return instances
    
    def create(self, validated_data):
        season = validated_data.pop("season")

        instance = RaceWeekend.objects.create(**validated_data)
        season.race_weekends.add(instance)
        instance.save()
        season.save()

        return instance

    def update(self, instance, validated_data):
        grid_data = validated_data.get("grid", False)
        standings_data = validated_data.get("standings", False)
        race_data = validated_data.get("race", False)
        if not grid_data and not standings_data and not race_data:
            title = validated_data.get("title", False)
            url = validated_data.get("url", False)
            start = validated_data.get("start", False)
            end = validated_data.get("end", False)
            if not title or not url or not start or not end:
                SeasonMessage.objects.create(
                    season=None,
                    message = f"Data for editing: {instance.title} was incomplete",
                    type = 0,
                )
                raise serializers.ValidationError("Data was incomplete when editing a race weekend")

            if "?" in url:
                url = url.split("?")[0] #read up until the question mark

            instance.title = title
            instance.url = url
            instance.start = start
            instance.end = end
        
        if standings_data:
            standings_serializer = importlib.import_module("api.serializers.standings_serializers").StandingsRaceWriteSerializer(data=standings)
            if not standings_serializer.is_valid():
                SeasonMessage.objects.create(
                    season = None,
                    message = f"There was a problem with the standings data: {standings_serializer.errors}",
                    type = 0,
                )
                raise serializers.ValidationError("Standings data was invalid")
            standings = standings_serializer.save()
            instance.standings = standings

        if grid_data:
            if instance.grid.count() != 0:
                SeasonMessage.objects.create(
                    season = None,
                    message = f"There are already qualifying positions saved for this race weekend",
                    type = 0,
                )
                raise serializers.ValidationError("There are qualifying positions already set")
            grid_serializer = importlib.import_module("api.serializers.competitors_serializers").CompetitorPositionWriteSerializer(data=grid_data, many=True)
            if not grid_serializer.is_valid():
                SeasonMessage.objects.create(
                    season = None,
                    message = f"Qualifying positions data was invalid: {grid_serializer.errors}",
                    type = 0,
                )
                raise serializers.ValidationError("Qualifying positions data was invalid")
            grid = grid_serializer.save()
            instance.grid.set(grid)

        if race_data:
            if instance.race != None:
                SeasonMessage.objects.create(
                    season = None,
                    message = f"There is a race already saved, try deleting before if you want to change the race",
                    type = 0,
                )
                raise serializers.ValidationError("There was already an existing race in the race weekend")
            
            race_serializer = RaceWriteSerializer(data=race_data)
            if not race_serializer.is_valid():
                SeasonMessage.objects.create(
                    Season = None,
                    message = f"There was an error when trying to create the race: {race_serializer.errors}",
                    type = 0,
                )
                raise serializers.ValidationError("The race data did not pass validation")
            race_serializer.save()

        instance.save()
        return instance
    
class RaceWeekendSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ["title", "start", "end", "id"]
        model = RaceWeekend

class RaceWeekendAdminSerializer(serializers.ModelSerializer):
    race = importlib.import_module("api.serializers.races_serializers").RaceReadSerializer()
    sprint_race = importlib.import_module("api.serializers.races_serializers").RaceReadSerializer()
    grid = importlib.import_module("api.serializers.competitors_serializers").CompetitorPositionSimpleSerializer(many=True)
    url = serializers.URLField()
    standings = importlib.import_module("api.serializers.standings_serializers").StandingsRaceSerializer()
    start = serializers.DateField()
    end = serializers.DateField()

    class Meta:
        fields = ["id", "race", "sprint_race", "grid", "url", "standings", "start", "end", "title"]
        model = RaceWeekend
