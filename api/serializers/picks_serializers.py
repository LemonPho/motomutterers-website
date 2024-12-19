from rest_framework import serializers
from django.contrib.auth import get_user_model

from . import competitors_serializers, user_serializers

from ..models import UserPicks, CompetitorPosition, Season, CompetitorPoints

import importlib

class UserPicksSimpleSerializer(serializers.ModelSerializer):
    picks = competitors_serializers.CompetitorPositionSimpleSerializer(many=True)
    independent_pick = competitors_serializers.CompetitorPositionSimpleSerializer()
    rookie_pick = competitors_serializers.CompetitorPositionSimpleSerializer()
    user = user_serializers.UserSimpleSerializer()
    position = serializers.IntegerField()
    class Meta:
        model = UserPicks
        fields = ["picks", "independent_pick", "rookie_pick", "points", "user", "position"]
    
class UserPicksSerializer(serializers.ModelSerializer):
    picks = competitors_serializers.CompetitorPositionSerializer(many=True, read_only=True)
    independent_pick = competitors_serializers.CompetitorPositionSerializer(read_only=True)
    rookie_pick = competitors_serializers.CompetitorPositionSerializer(read_only=True)
    user = user_serializers.UserSimpleProfilePictureSerializer(read_only=True)
    season = importlib.import_module("api.serializers.seasons_serializers").SeasonSimpleSerializer(read_only=True)
    position = serializers.IntegerField()
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = UserPicks
        fields = ["id", "picks", "independent_pick", "rookie_pick", "points", "user", "season", "position"]

class UserPicksWriteSerializer(serializers.ModelSerializer):
    picks = competitors_serializers.CompetitorPositionWriteSerializer(many=True, write_only=True)
    independent_pick = competitors_serializers.CompetitorPositionWriteSerializer(write_only=True)
    rookie_pick = competitors_serializers.CompetitorPositionWriteSerializer(write_only=True)
    user = serializers.PrimaryKeyRelatedField(write_only=True, queryset=get_user_model().objects.all())
    season = serializers.PrimaryKeyRelatedField(write_only=True, queryset=Season.objects.all())

    class Meta:
        model = UserPicks
        fields = ["picks", "independent_pick", "rookie_pick", "user", "season"]

    def create(self, validated_data):
        picks = validated_data.pop("picks")
        independent_pick = validated_data.pop("independent_pick")
        rookie_pick = validated_data.pop("rookie_pick")
        season_instance = validated_data.get("season")

        picks_instances = []
        for pick in picks:
            pick_instance = CompetitorPosition.objects.create(**pick)
            picks_instances.append(pick_instance)

        validated_data["independent_pick"] = CompetitorPosition.objects.create(**independent_pick)
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


class UserPicksRaceSimpleSerializer(serializers.ModelSerializer):
    picks = competitors_serializers.CompetitorPositionSimpleSerializer(many=True, read_only=True)
    independent_pick = competitors_serializers.CompetitorPositionSimpleSerializer(read_only=True)
    rookie_pick = competitors_serializers.CompetitorPositionSimpleSerializer(read_only=True)
    user = user_serializers.UserSimpleSerializer(read_only=True)
    position_change = serializers.IntegerField(read_only=True)
    position = serializers.IntegerField(read_only=True)
    class Meta:
        model = UserPicks
        fields = ["picks", "independent_pick", "rookie_pick", "points", "user", "position_change", "position"]

class UserPicksRaceWriteSerializer(serializers.ModelSerializer):
    picks = competitors_serializers.CompetitorPositionWriteSerializer(many=True, write_only=True)
    independent_pick = competitors_serializers.CompetitorPositionWriteSerializer(write_only=True)
    rookie_pick = competitors_serializers.CompetitorPositionWriteSerializer(write_only=True)
    user = user_serializers.UserSerializer(write_only=True)
    class Meta:
        model=UserPicks
        fields = ["picks", "independent_pick", "rookie_pick", "points", "user"]

