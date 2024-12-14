from rest_framework import serializers

from ...models import CompetitorPosition

class CompetitorSimpleSerializer(serializers.ModelSerializer):
    first = serializers.SerializerMethodField()
    last = serializers.SerializerMethodField()
    number = serializers.SerializerMethodField()
    points = serializers.SerializerMethodField()
    id = serializers.IntegerField()
    position = serializers.IntegerField()

    class Meta:
        model = CompetitorPosition
        fields = ["first", "last", "number", "points", "id", "position"]

    def get_first(self, competitor_position):
        return competitor_position.competitor_points.competitor.first
    
    def get_last(self, competitor_position):
        return competitor_position.competitor_points.competitor.last
    
    def get_number(self, competitor_position):
        return competitor_position.competitor_points.competitor.number
    
    def get_points(self, competitor_position):
        return competitor_position.competitor_points.points