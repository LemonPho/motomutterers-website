from rest_framework import serializers

from ..users_view.user_serializers import UserSimple, UserSimpleSerializer
from ...models import UserPicks

class PickSimple:
    def __init__(self, first=None, last=None, number=None, points=None, position=None, id=None):
        self.first = first
        self.last = last
        self.number = number
        self.points = points
        self.position = position
        self.id = id

class PickSimpleSerializer(serializers.Serializer):
    first = serializers.CharField()
    last = serializers.CharField()
    number = serializers.IntegerField()
    points = serializers.FloatField()
    id = serializers.IntegerField()
    position = serializers.IntegerField()

    class Meta:
        fields = ["first", "last", "number", "points", "id", "position"]

class UserPicksSimpleSerializer(serializers.ModelSerializer):
    picks = serializers.SerializerMethodField()
    independent_pick = serializers.SerializerMethodField()
    rookie_pick = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    class Meta:
        model = UserPicks
        fields = ["picks", "independent_pick", "rookie_pick", "points", "user"]

    def get_user(self, user_picks):
        temp_user = UserSimple()
        temp_user.id = user_picks.user.id
        temp_user.username = user_picks.user.username

        user_serializer = UserSimpleSerializer(temp_user)

        return user_serializer.data
    
    def get_picks(self, user_picks):
        picks = user_picks.picks.all()
        picks_for_serializer = []
        for pick in picks:
            temp_pick = PickSimple()
            temp_pick.first = pick.competitor_points.competitor.first
            temp_pick.last = pick.competitor_points.competitor.last
            temp_pick.number = pick.competitor_points.competitor.number
            temp_pick.points = pick.competitor_points.points
            temp_pick.position = pick.position
            temp_pick.id = pick.id
            picks_for_serializer.append(temp_pick)


        picks_serializer = PickSimpleSerializer(picks_for_serializer, many=True)
        return picks_serializer.data

    def get_independent_pick(self, user_picks):
        if user_picks.independent_pick == None:
            return

        independent_pick = user_picks.independent_pick
        temp_independent_pick = independent_pick
        independent_pick = temp_independent_pick.competitor_points.competitor
        independent_pick.points = temp_independent_pick.competitor_points.points
        independent_pick.position = temp_independent_pick.position
        independent_pick.id = temp_independent_pick.id

        independent_pick_serializer = PickSimpleSerializer(independent_pick)

        return independent_pick_serializer.data

    def get_rookie_pick(self, user_picks):
        if user_picks.rookie_pick == None:
            return
        
        rookie_pick = user_picks.rookie_pick
        
        temp_rookie_pick = PickSimple()

        temp_rookie_pick.first = rookie_pick.competitor_points.competitor.first
        temp_rookie_pick.last = rookie_pick.competitor_points.competitor.last
        temp_rookie_pick.number = rookie_pick.competitor_points.competitor.number
        temp_rookie_pick.points = rookie_pick.competitor_points.points
        temp_rookie_pick.position = rookie_pick.position
        temp_rookie_pick.id = rookie_pick.id

        rookie_pick_serializer = PickSimpleSerializer(temp_rookie_pick)
        
        return rookie_pick_serializer.data
