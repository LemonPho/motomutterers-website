from rest_framework import serializers

from ..users_view.user_serializers import UserSimpleSerializer
from ..seasons_view.seasons_serializers import SeasonSimpleSerializer
from ..competitors_view.competitors_serializers import CompetitorSimpleSerializer
from ...models import UserPicks, CompetitorPosition
from ...serializers import CompetitorPositionSerializer

class UserPicksSimpleSerializer(serializers.ModelSerializer):
    picks = CompetitorSimpleSerializer(many=True)
    independent_pick = CompetitorSimpleSerializer()
    rookie_pick = CompetitorSimpleSerializer()
    user = UserSimpleSerializer()
    class Meta:
        model = UserPicks
        fields = ["picks", "independent_pick", "rookie_pick", "points", "user"]
    
class UserPicksSerializer(serializers.ModelSerializer):
    picks = CompetitorPositionSerializer(many=True, read_only=True)
    independent_pick = CompetitorPositionSerializer(read_only=True)
    rookie_pick = CompetitorPositionSerializer(read_only=True)
    user = UserSimpleSerializer(read_only=True)
    season = SeasonSimpleSerializer(read_only=True)
    class Meta:
        model = UserPicks
        fields = ["picks", "independent_pick", "rookie_pick", "points", "user", "season"]
