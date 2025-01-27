from rest_framework import serializers

from ..models import Standings, StandingsRace

import importlib

class StandingsSimpleSerializer(serializers.ModelSerializer):
    users_picks = importlib.import_module("api.serializers.picks_serializers").UserPicksSimpleSerializer(many=True)

    class Meta:
        model = Standings
        fields = ["users_picks"]

class StandingsSerializers(serializers.ModelSerializer):
    users_picks = importlib.import_module("api.serializers.picks_serializers").UserPicksSerializer(many=True)

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

class StandingsRaceSerializer(serializers.ModelSerializer):
    users_picks = importlib.import_module("api.serializers.picks_serializers").UserPicksRaceSerializer(many=True)

    class Meta:
        model = StandingsRace
        fields = ["users_picks"]

