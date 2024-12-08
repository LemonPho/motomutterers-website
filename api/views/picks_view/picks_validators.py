from rest_framework import serializers
from django.contrib.auth import get_user_model

from ...models import CurrentSeason, Competitor, CompetitorPosition, UserPicks, SeasonCompetitorPosition, Season
from ...serializers import UserSerializer, CompetitorPositionSerializer

from collections import Counter

#new_picks should be an array of the competitors id's
def check_picks_conflict(new_picks, independent_pick, rookie_pick, current_season):
    users_picks = UserPicks.objects.filter(season=current_season.season).all()

    for user_picks in users_picks:
        same_picks = True
        picks = user_picks.picks.all().order_by("position") #need to sort by position in list
        for i in range(0, picks.count()):
            #print(f"{picks[i].competitor.id} != {new_picks[i]}")
            if picks[i].competitor_points.competitor.id != new_picks[i]:
                same_picks = False

        if current_season.season.top_independent and user_picks.independent_pick.competitor_points.competitor.id != independent_pick:
            same_picks = False

        if current_season.season.top_rookie and user_picks.rookie_pick.competitor_points.competitor.id != rookie_pick:
            same_picks = False

        if same_picks: return True
    
    return False

def check_duplicate_picks(picks_ids):
    invalid_picks = [False] * len(picks_ids)
    picks_counts = Counter(picks_ids)

    for i in range(0, len(picks_ids)):
        if picks_counts[picks_ids[i]] > 1:
            invalid_picks[i] = True

    return invalid_picks

def generate_validate_user_picks_data(data, request):
    current_season = CurrentSeason.objects.first()
    length_user_picks = 5

    result = {
        "invalid_picks": [False]*length_user_picks,
        "invalid_independent": False,
        "invalid_rookie": False,
        "picks_already_selected": False,
        "invalid_season": False,
        "new_data": {
            "picks": [],
            "independent_pick": {},
            "rookie_pick": {},
            "user": 0,
            "season": None
        },
    }

    picks_ids = data.get("picks_ids")
    independent_pick_id = int(data.get("independent_pick_id"))
    rookie_pick_id = int(data.get("rookie_pick_id"))

    result["invalid_picks"] = check_duplicate_picks(picks_ids)
    result["picks_already_selected"] = check_picks_conflict(picks_ids, independent_pick_id, rookie_pick_id, current_season)

    #check for problems
    if current_season is None:
        result["invalid_season"] = True
        return result
    
    if any(result["invalid_picks"]):
        return result

    if result["picks_already_selected"]:
        return result

    #build data

    user_picks_data = build_user_picks(picks_ids)
    user_independent_pick_data = build_independent_pick(independent_pick_id)
    user_rookie_pick_data = build_rookie_pick(rookie_pick_id)
    result["invalid_picks"] = user_picks_data["invalid_picks"]
    result["invalid_independent"] = user_independent_pick_data["invalid_independent"]
    result["invalid_rookie"] = user_rookie_pick_data["invalid_rookie"]

    if any(result["invalid_picks"]) or result["invalid_independent"]:
        return result

    result["new_data"]["picks"] = user_picks_data["new_data"]["picks"]
    result["new_data"]["independent_pick"] = user_independent_pick_data["new_data"]["independent_pick"]
    result["new_data"]["rookie_pick"] = user_rookie_pick_data["new_data"]["rookie_pick"]

    result["new_data"]["user"] = int(request.user.id)
    result["new_data"]["season"] = current_season.season.id
    
    return result

def build_user_picks(picks_ids):
    result = {
        "invalid_picks": [False, False, False, False, False],
        "new_data": {
            "picks": [],
        },
    }

    current_season = CurrentSeason.objects.first()

    for i in range(0, len(picks_ids)):
        try:
            temp_competitor = Competitor.objects.get(pk=picks_ids[i])
        except Competitor.DoesNotExist:
            temp_competitor = None

        if temp_competitor is None:
            result["invalid_picks"][i] = True
        else:
            try:
                temp_competitor_position = SeasonCompetitorPosition.objects.filter(season=current_season.season).get(competitor_points__competitor=temp_competitor)
            except SeasonCompetitorPosition.DoesNotExist:
                temp_competitor_position = None

        if temp_competitor_position is None:
            result["invalid_picks"][i] = True
        else:
            result["new_data"]["picks"].append({
                "competitor_points_id": temp_competitor_position.competitor_points.id,
                "position": i+1, 
                })

    return result

def build_rookie_pick(rookie_pick_id):
    result = {
        "invalid_rookie": False,
        "new_data": {
            "rookie_pick": {
                "competitor_points_id": None,
                "position": 0,
            },
        }
    }

    current_season = CurrentSeason.objects.first()

    try:
        rookie_competitor = Competitor.objects.get(pk=rookie_pick_id)
    except Competitor.DoesNotExist:
        result["invalid_rookie"] = True
        return result
    
    try:
        rookie_competitor_position = SeasonCompetitorPosition.objects.filter(season=current_season.season).filter(rookie=True).get(competitor_points__competitor=rookie_competitor)
    except SeasonCompetitorPosition.DoesNotExist:
        result["invalid_rookie"] = True
        return result
    
    result["new_data"]["rookie_pick"]["competitor_points_id"] = rookie_competitor_position.competitor_points.id

    return result    

def build_independent_pick(independent_pick_id):
    result = {
        "invalid_independent": False,
        "new_data": {
            "independent_pick": {
                "competitor_points_id": None,
                "position": 0,
            },
        }
    }

    current_season = CurrentSeason.objects.first()

    try:
        independent_competitor = Competitor.objects.get(pk=independent_pick_id)
    except Competitor.DoesNotExist:
        result["invalid_independent"] = True
        return result
    
    try:
        independent_competitor_position = SeasonCompetitorPosition.objects.filter(season=current_season.season).filter(independent=True).get(competitor_points__competitor=independent_competitor)
    except SeasonCompetitorPosition.DoesNotExist:
        result["invalid_independent"] = True
        return result
    
    result["new_data"]["independent_pick"]["competitor_points_id"] = independent_competitor_position.competitor_points.id

    return result

class WriteUserPicksSerializer(serializers.ModelSerializer):
    picks = CompetitorPositionSerializer(many=True)
    independent_pick = CompetitorPositionSerializer(required=False)
    rookie_pick = CompetitorPositionSerializer(required=False)
    user = serializers.PrimaryKeyRelatedField(write_only=True, queryset=get_user_model().objects.all())
    season = serializers.PrimaryKeyRelatedField(write_only=True, queryset=Season.objects.all())

    class Meta:
        model = UserPicks
        fields = ["picks", "independent_pick", "rookie_pick", "user", "season"]

    def create(self, validated_data):
        picks = validated_data.pop("picks")
        season_instance = validated_data.get("season")

        picks_instances = []
        for pick in picks:
            competitor_points_instance = pick.pop("competitor_points_id")
            picks_instances.append(CompetitorPosition.objects.create(competitor_points=competitor_points_instance, **pick))

        independent_pick = validated_data.pop("independent_pick", False)
        rookie_pick = validated_data.pop("rookie_pick", False)
        if season_instance.top_independent:
            competitor_points_instance = independent_pick.pop("competitor_points_id")
            independent_pick_instance = CompetitorPosition.objects.create(competitor_points=competitor_points_instance, **independent_pick)
        else:
            independent_pick_instance = None

        if season_instance.top_rookie:
            competitor_points_instance = rookie_pick.pop("competitor_points_id")
            rookie_pick_instance = CompetitorPosition.objects.create(competitor_points=competitor_points_instance, **rookie_pick)
        else:
            rookie_pick_instance = None

        user_picks = UserPicks.objects.create(independent_pick=independent_pick_instance, rookie_pick=rookie_pick_instance, points=0, **validated_data)
        
        points = 0
        if season_instance.top_independent:
            points += user_picks.independent_pick.competitor_points.points
        if season_instance.top_rookie:
            points += user_picks.rookie_pick.competitor_points.points

        for pick_instance in picks_instances:
            user_picks.picks.add(pick_instance)
            points += pick_instance.competitor_points.points
        user_picks.points = points
        user_picks.save()
        return user_picks