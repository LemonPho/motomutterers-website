from rest_framework import serializers
from django.contrib.auth import get_user_model

from . import competitors_serializers, user_serializers

from ..models import UserPicks, CompetitorPosition, Season, CompetitorPoints, UserPicksRace

import importlib

class UserPicksSimpleSerializer(serializers.ModelSerializer):
    picks = competitors_serializers.CompetitorPositionSimpleSerializer(many=True)
    independent_pick = serializers.SerializerMethodField()
    rookie_pick = serializers.SerializerMethodField()
    user = user_serializers.UserSimpleSerializer()
    position = serializers.IntegerField()
    class Meta:
        model = UserPicks
        fields = ["picks", "independent_pick", "rookie_pick", "points", "user", "position"]

    def get_independent_pick(self, user_picks):
        if user_picks.independent_pick is None:
            return

        serializer = competitors_serializers.CompetitorPositionSimpleSerializer(user_picks.independent_pick)
        return serializer.data
    
    def get_rookie_pick(self, user_picks):
        if user_picks.rookie_pick is None:
            return
        
        serializer = competitors_serializers.CompetitorPositionSimpleSerializer(user_picks.rookie_pick)
        return serializer.data
    
class UserPicksSerializer(serializers.ModelSerializer):
    picks = competitors_serializers.CompetitorPositionSerializer(many=True, read_only=True)
    independent_pick = serializers.SerializerMethodField(read_only=True)
    rookie_pick = serializers.SerializerMethodField(read_only=True)
    user = user_serializers.UserSimpleProfilePictureSerializer(read_only=True)
    season = importlib.import_module("api.serializers.seasons_serializers").SeasonSimpleSerializer(read_only=True)
    position = serializers.IntegerField()
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = UserPicks
        fields = ["id", "picks", "independent_pick", "rookie_pick", "points", "user", "season", "position"]

    def get_independent_pick(self, user_picks):
        if user_picks.independent_pick is None:
            return

        serializer = competitors_serializers.CompetitorPositionSerializer(user_picks.independent_pick)
        return serializer.data
    
    def get_rookie_pick(self, user_picks):
        if user_picks.rookie_pick is None:
            return
        
        serializer = competitors_serializers.CompetitorPositionSerializer(user_picks.rookie_pick)
        return serializer.data

class UserPicksWriteSerializer(serializers.ModelSerializer):
    picks = competitors_serializers.CompetitorPositionWriteSerializer(many=True, write_only=True)
    independent_pick = competitors_serializers.CompetitorPositionWriteSerializer(write_only=True, required=False)
    rookie_pick = competitors_serializers.CompetitorPositionWriteSerializer(write_only=True, required=False)
    user = serializers.PrimaryKeyRelatedField(write_only=True, queryset=get_user_model().objects.all())
    season = serializers.PrimaryKeyRelatedField(write_only=True, queryset=Season.objects.all())

    class Meta:
        model = UserPicks
        fields = ["picks", "independent_pick", "rookie_pick", "user", "season"]

    def create(self, validated_data):
        picks = validated_data.pop("picks")
        independent_pick = validated_data.pop("independent_pick", False)
        rookie_pick = validated_data.pop("rookie_pick", False)
        season_instance = validated_data.get("season")

        picks_instances = []
        for pick in picks:
            pick_instance = CompetitorPosition.objects.create(**pick)
            picks_instances.append(pick_instance)

        if independent_pick and season_instance.top_independent:
            validated_data["independent_pick"] = CompetitorPosition.objects.create(**independent_pick)
        if rookie_pick and season_instance.top_rookie:
            validated_data["rookie_pick"] = CompetitorPosition.objects.create(**rookie_pick)

        user_picks = UserPicks.objects.create(points=0, **validated_data)
        user_picks.picks.set(picks_instances)
        
        points = 0
        if season_instance.top_independent:
            points += user_picks.independent_pick.competitor_points.points
        if season_instance.top_rookie:
            points += user_picks.rookie_pick.competitor_points.points

        for pick_instance in picks_instances:
            points += pick_instance.competitor_points.points
        user_picks.points = points
        user_picks.save()
        season_instance.standings.users_picks.add(user_picks)
        return user_picks


class UserPicksRaceSerializer(serializers.ModelSerializer):
    user = user_serializers.UserSimpleSerializer(read_only=True)
    position_change = serializers.IntegerField(read_only=True)
    position = serializers.IntegerField(read_only=True)
    points = serializers.IntegerField(read_only=True)
    class Meta:
        model = UserPicksRace
        fields = ["points", "user", "position_change", "position"]
    
class UserPicksRaceWriteSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(write_only=True, queryset=get_user_model().objects.all())
    points = serializers.IntegerField(write_only=True)
    position_change = serializers.IntegerField(write_only=True)
    class Meta:
        model=UserPicksRace
        fields = ["points", "user", "position_change"]

