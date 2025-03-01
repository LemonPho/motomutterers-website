from rest_framework import serializers
from django.db.models import Q

from . import competitors_serializers, races_serializers

from ..models import Season, SeasonCompetitorPosition, CompetitorPoints, Standings, SeleniumStatus, SeasonMessage
from ..views.seasons_view.seasons_util import get_competitors_sorted_number

import importlib

class SeasonSimpleSerializer(serializers.ModelSerializer):
    year = serializers.IntegerField()
    id = serializers.IntegerField()
    top_independent = serializers.BooleanField()
    top_rookie = serializers.BooleanField()
    finalized = serializers.BooleanField()
    selection_open = serializers.BooleanField()
    current = serializers.SerializerMethodField()

    class Meta:
        model = Season
        fields = ["year", "id", "top_independent", "top_rookie", "finalized", "selection_open", "current"]

    def get_current(self, season):
        if hasattr(season, 'current'):
            return True
        else:
            return False

class SeasonSimpleYearSerializer(serializers.ModelSerializer):
    year = serializers.IntegerField()
    id = serializers.IntegerField()

    class Meta:
        model = Season
        fields = ["year", "id"]

class SeasonWriteSerializer(serializers.ModelSerializer):
    year = serializers.IntegerField()
    top_independent = serializers.BooleanField()
    top_rookie = serializers.BooleanField()
    standings = importlib.import_module("api.serializers.standings_serializers").StandingsWriteSerializer(allow_null=True)

    class Meta:
        model = Season
        fields = ["year", "top_independent" , "top_rookie", "standings"]

    def create(self, validated_data):
        validated_data.pop("standings")
        standings = Standings.objects.create()

        return Season.objects.create(standings=standings, **validated_data)
    
class SeasonCompetitorPositionSimpleSerializer(serializers.ModelSerializer):
    competitor_id = serializers.SerializerMethodField()
    points = serializers.SerializerMethodField()
    independent = serializers.BooleanField()
    rookie = serializers.BooleanField()
    season = serializers.SerializerMethodField()
    first = serializers.SerializerMethodField()
    last = serializers.SerializerMethodField()
    number = serializers.SerializerMethodField()

    class Meta:
        model = SeasonCompetitorPosition
        fields = ["competitor_id", "points", "independent", "rookie", "season", "first", "last", "number"]

    def get_competitor_id(self, season_competitor_position):
        return season_competitor_position.competitor_points.competitor.id

    def get_season(self, season_competitor_position):
        serializer = SeasonSimpleYearSerializer(season_competitor_position.season.first())
        return serializer.data

    def get_points(self, season_competitor_position):
        return season_competitor_position.competitor_points.points
    
    def get_first(self, season_competitor_position):
        return season_competitor_position.competitor_points.competitor.first
    
    def get_last(self, season_competitor_position):
        return season_competitor_position.competitor_points.competitor.last
    
    def get_number(self, season_competitor_position):
        return season_competitor_position.competitor_points.competitor.number
    
class SeasonCompetitorPositionSerializer(serializers.ModelSerializer):
    competitor_points = competitors_serializers.CompetitorPointsSerializer()
    class Meta:
        model = SeasonCompetitorPosition
        fields = ["independent", "rookie", "id", "competitor_points"]
   
class SeasonCompetitorPositionWriteSerializer(serializers.ModelSerializer):
    competitor_points = serializers.JSONField()
    season = serializers.PrimaryKeyRelatedField(queryset=Season.objects.all(), write_only=True, required=False)

    class Meta:
        model = SeasonCompetitorPosition
        fields = ["id", "competitor_points", "independent", "rookie", "season"]

    def validate_competitor_points(self, competitor_points):
        if isinstance(competitor_points, int):
            try:
                instance = CompetitorPoints.objects.get(pk=competitor_points)
            except CompetitorPoints.DoesNotExist:
                raise serializers.ValidationError("competitor points instance not found")
            
            return instance
        
        elif isinstance(competitor_points, dict):
            serializer = competitors_serializers.CompetitorPointsWriteSerializer(data=competitor_points)
            if not serializer.is_valid():
                raise serializers.ValidationError("competitor points data given was not valid for creation")
            
            instance = serializer.save()
            return instance
        
        raise serializers.ValidationError("competitor points given was not a valid data type (int, dict)")

    def update(self, instance, validated_data):
        print(validated_data)
        
        competitor_points = validated_data.pop("competitor_points", False)

        if not competitor_points:
            raise serializers.ValidationError("competitor points not found in validated data")
        
        if not isinstance(competitor_points, CompetitorPoints):
            raise serializers.ValidationError("competitor points was not a CompetitorPoints instance")
        
        instance.competitor_points = competitor_points
        instance.independent = validated_data.get("independent", instance.independent)
        instance.rookie = validated_data.get("rookie", instance.rookie)
        instance.save()
        return instance
    
    def create(self, validated_data):
        season = validated_data.pop("season")
        competitor_points = validated_data.pop("competitor_points", False)

        if not competitor_points:
            raise serializers.ValidationError("competitor points was not found in validated_data")
        
        if not isinstance(competitor_points, CompetitorPoints):
            raise serializers.ValidationError("competitor points was not a CompetitorPoints instance")
        

        season_competitor_position_instance = SeasonCompetitorPosition.objects.create(
            competitor_points=competitor_points,
            **validated_data
        )

        season.competitors.add(season_competitor_position_instance)

        return season_competitor_position_instance
    
class SeleniumStatusSerializer(serializers.ModelSerializer):
    user = importlib.import_module("api.serializers.user_serializers").UserSimpleSerializer()

    class Meta:
        model = SeleniumStatus
        fields = ["message", "user", "timestamp", "pid"]

class SeasonDetailedSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    year = serializers.IntegerField()
    competitors = SeasonCompetitorPositionSerializer(many=True)
    selection_open = serializers.BooleanField()
    top_independent = serializers.BooleanField()
    top_rookie = serializers.BooleanField()
    finalized = serializers.BooleanField()
    competitors_sorted_number = serializers.SerializerMethodField()

    class Meta:
        model = Season
        fields = ["id", "year", "competitors", "top_independent", "top_rookie", "finalized", "selection_open", "competitors_sorted_number"]
        
    def get_competitors_sorted_number(self, season):
        competitors_sorted_number = get_competitors_sorted_number(season)
        competitors_sorted_number_serializer = SeasonCompetitorPositionSerializer(competitors_sorted_number, many=True)
        return competitors_sorted_number_serializer.data
    
class SeasonMessageSerializer(serializers.ModelSerializer):
    season = SeasonSimpleSerializer()
    class Meta:
        model = SeasonMessage
        fields = ["message", "timestamp", "season", "id"]

class SeasonSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    year = serializers.IntegerField()
    competitors = SeasonCompetitorPositionSerializer(many=True)
    races = races_serializers.RaceSimpleSerializer(many=True)
    visible = serializers.BooleanField()
    selection_open = serializers.BooleanField()
    top_independent = serializers.BooleanField()
    top_rookie = serializers.BooleanField()
    finalized = serializers.BooleanField()
    current = serializers.SerializerMethodField()
    competitors_sorted_number = serializers.SerializerMethodField()
    selenium_status = serializers.SerializerMethodField()
    season_messages = serializers.SerializerMethodField()

    class Meta:
        model = Season
        fields = ["id", "year", "competitors", "races", "visible", "top_independent", "top_rookie", "finalized", "selection_open", "current", "competitors_sorted_number", "selenium_status", "season_messages"]

    def get_current(self, season):
        if hasattr(season, 'current'):
            return True
        else:
            return False
        
    def get_competitors_sorted_number(self, season):
        competitors_sorted_number = get_competitors_sorted_number(season)
        competitors_sorted_number_serializer = SeasonCompetitorPositionSerializer(competitors_sorted_number, many=True)
        return competitors_sorted_number_serializer.data
    
    def get_selenium_status(self, season):
        if SeleniumStatus.objects.count() == 0:
            return None
        
        instance = SeleniumStatus.objects.all()
        serializer = SeleniumStatusSerializer(instance, many=True)

        return serializer.data
    
    def get_season_messages(self, season):
        season_messages = SeasonMessage.objects.filter(Q(season=season) | Q(season=None))
        serializer = SeasonMessageSerializer(season_messages, many=True)
        return serializer.data
