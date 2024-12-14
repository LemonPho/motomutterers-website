from rest_framework import serializers

from ..picks_view.picks_serializers import UserPicksSimpleSerializer
from ..seasons_view.seasons_serializers import SeasonSimpleYearSerializer
from ..races_view.races_serializers import RaceSimpleSerializer
from ...models import Standings

class StandingsSimpleSerializer(serializers.ModelSerializer):
    users_picks = UserPicksSimpleSerializer(many=True)

    class Meta:
        model = Standings
        fields = ["users_picks"]