from rest_framework import serializers

from ..competitors_view.competitors_serializers import CompetitorSimpleSerializer
from ...models import Race

class RaceSimpleSerializer(serializers.ModelSerializer):
    title = serializers.CharField()
    track = serializers.CharField()
    timestamp = serializers.CharField()
    is_sprint = serializers.BooleanField()
    finalized = serializers.BooleanField()
    competitors_positions = CompetitorSimpleSerializer(many=True)

    class Meta:
        model = Race
        fields = ["title", "track", "timestamp", "is_sprint", "finalized", "competitors_positions"]