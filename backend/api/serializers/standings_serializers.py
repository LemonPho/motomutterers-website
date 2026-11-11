from rest_framework import serializers

from ..models import Standings, StandingsRace, UserPicksRace

import importlib

class StandingsSimpleSerializer(serializers.ModelSerializer):
    users_picks = importlib.import_module("api.serializers.picks_serializers").UserPicksSimpleSerializer(many=True)

    class Meta:
        model = Standings
        fields = ["users_picks"]

class StandingsWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Standings
        fields = []

class StandingsRaceWriteSerializer(serializers.ModelSerializer):
    users_picks = importlib.import_module("api.serializers.picks_serializers").UserPicksRaceWriteSerializer(many=True)

    class Meta:
        model = StandingsRace
        fields = ["users_picks"]

    def create(self, validated_data):
        users_picks_instances = []
        for user_picks in validated_data["users_picks"]:
            users_picks_instances.append(UserPicksRace.objects.create(points=user_picks["points"], user=user_picks["user"], position_change=user_picks["position_change"], position=user_picks["position"]))

        standings_instance = StandingsRace.objects.create()
        standings_instance.users_picks.set(users_picks_instances)

        return standings_instance
        

class StandingsRaceSerializer(serializers.ModelSerializer):
    users_picks = importlib.import_module("api.serializers.picks_serializers").UserPicksRaceSerializer(many=True)

    class Meta:
        model = StandingsRace
        fields = ["users_picks"]

