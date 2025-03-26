from rest_framework import serializers
from django.contrib.auth import get_user_model

from . import competitors_serializers, user_serializers

from ..models import Race, RaceWeekend, Season, SeasonMessage

from ..views.races_view.races_validators import RACE_TYPE_FINAL, RACE_TYPE_SPRINT, RACE_TYPE_UPCOMING
from ..views.notification_view import create_notifications
from ..views.standings_view.standings_util import sort_race_standings


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
    track = serializers.CharField()
    competitors_positions = serializers.SerializerMethodField()

    class Meta:
        model = Race
        fields = ["track", "competitors_positions", "id"]

    def get_competitors_positions(self, race):
        competitors_positions = race.competitors_positions.all()
        competitors_positions = list(competitors_positions)

        competitors_dnf = []
        i=0

        while i < len(competitors_positions):
            if competitors_positions[i].position == 0 and len(competitors_positions) > 1:
                competitors_dnf.append(competitors_positions.pop(i))
            else:
                i += 1
        
        competitors_positions += competitors_dnf
        
        serializer = competitors_serializers.CompetitorPositionSimpleSerializer(competitors_positions, many=True)
        return serializer.data

class RaceWriteSerializer(serializers.ModelSerializer):
    competitors_positions = serializers.JSONField()
    track = serializers.CharField(required=False)

    class Meta:
        model = Race
        fields = ["id", "track", "competitors_positions"]
    
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

        instance = Race.objects.create(**validated_data)
        instance.competitors_positions.set(competitors_positions)

        return instance
    

# -------------------------------------RACE WEEKEND------------------------------------- #

class RaceWeekendWriteSerializer(serializers.ModelSerializer):
    title = serializers.CharField(write_only=True, required=False)
    url = serializers.URLField(write_only=True, required=False)
    standings = serializers.JSONField(required=False)
    grid = serializers.JSONField(required=False)
    race = serializers.JSONField(required=False)
    sprint_race = serializers.JSONField(required=False)
    season = serializers.PrimaryKeyRelatedField(queryset=Season.objects.all(), required=False)
    start = serializers.DateField(required=False)
    end = serializers.DateField(required=False)

    class Meta:
        fields = ["title", "url", "standings", "grid", "race", "sprint_race", "start", "end", "season"]
        model = RaceWeekend

    def validate_standings(self, standings_data):
        standings_serializer = importlib.import_module("api.serializers.standings_serializers").StandingsRaceWriteSerializer(data=standings_data)
        if not standings_serializer.is_valid():
            SeasonMessage.objects.create(
                season = None,
                message = f"There was a problem with the standings data: {standings_serializer.errors}",
                type = 0,
            )
            raise serializers.ValidationError("Standings data was invalid")
        standings = standings_serializer.save()
        return standings
    
    def create(self, validated_data):
        season = validated_data.pop("season")

        instance = RaceWeekend.objects.create(**validated_data)
        season.race_weekends.add(instance)
        instance.save()
        season.save()

        return instance

    def update(self, instance, validated_data):
        STATUS_IN_PROGRESS = 1
        

        grid_data = validated_data.get("grid", False)
        standings = validated_data.get("standings", False)
        race_data = validated_data.get("race", False)
        if not grid_data and not standings and not race_data:
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
            instance.save()

            return instance
        
        if standings:
            if len(list(standings.users_picks.all())) != 0:
                instance.standings = standings
                sort_race_standings(instance.standings, instance.season.first())

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
            instance.status = STATUS_IN_PROGRESS
            if not race_data.get("is_sprint") and instance.race != None:
                SeasonMessage.objects.create(
                    season = None,
                    message = f"There is a sprint race already saved in the {instance.title} weekend, try deleting before if you want to change the sprint race",
                    type = 0,
                )
                raise serializers.ValidationError("There was already an existing race in the race weekend")

            if race_data.get("is_sprint") and instance.sprint_race != None:
                SeasonMessage.objects.create(
                    season = None,
                    message = f"There is a race already saved in the {instance.title} weekend, try deleting before if you want to change the race",
                    type = 0,
                )
                raise serializers.ValidationError("There was already an existing race in the race weekend")
            
            race_serializer = RaceWriteSerializer(data=race_data)
            if not race_serializer.is_valid():
                SeasonMessage.objects.create(
                    season = None,
                    message = f"There was an error when trying to create the race: {race_serializer.errors}",
                    type = 0,
                )
                raise serializers.ValidationError("The race data did not pass validation")
            race_instance = race_serializer.save()
            if race_data["is_sprint"]:
                instance.sprint_race = race_instance
            else:
                instance.race = race_instance

        instance.save()
        return instance
    
class RaceWeekendSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ["title", "start", "end", "id", "status"]
        model = RaceWeekend

class RaceWeekendReadSerializer(serializers.ModelSerializer):
    race = RaceReadSerializer()
    sprint_race = RaceReadSerializer()
    standings = importlib.import_module("api.serializers.standings_serializers").StandingsRaceSerializer()
    
    class Meta:
        fields = ["id", "race", "sprint_race", "standings", "start", "end", "title", "status"]
        model = RaceWeekend

class RaceWeekendAdminSerializer(serializers.ModelSerializer):
    race = RaceReadSerializer()
    sprint_race = RaceReadSerializer()
    grid = importlib.import_module("api.serializers.competitors_serializers").CompetitorPositionSimpleSerializer(many=True)
    url = serializers.URLField()
    standings = importlib.import_module("api.serializers.standings_serializers").StandingsRaceSerializer()
    start = serializers.DateField()
    end = serializers.DateField()

    class Meta:
        fields = ["id", "race", "sprint_race", "grid", "url", "standings", "start", "end", "title", "status"]
        model = RaceWeekend
