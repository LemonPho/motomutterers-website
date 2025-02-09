from django.http import HttpResponse, JsonResponse

from .races_validators import validate_race_link_data, generate_link_race_data, validate_generate_complete_manual_race, process_retrieve_race_result, generate_race_standings
from .races_validators import RACE_TYPE_UPCOMING, RACE_TYPE_SPRINT, RACE_TYPE_FINAL
from .races_util import add_points_to_season_competitors

from ...models import Race, Season, CompetitorPosition, Competitor, CurrentSeason, SeasonCompetitorPosition
from ...serializers.competitors_serializers import CompetitorPositionWriteSerializer
from ...serializers.races_serializers import RaceWriteSerializer, RaceSimpleSerializer
from ...serializers.standings_serializers import StandingsRaceWriteSerializer

from ..picks_view.picks_util import update_members_points
from ..standings_view.standings_util import sort_standings, sort_race_standings

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException


import json

def get_race(request):
    if request.method != "GET":
        return HttpResponse(status=405)
    
    race_id = request.GET.get("race", -1)

    if race_id == -1:
        return HttpResponse(status=400)
    
    try:
        race = Race.objects.get(pk=race_id)
    except Race.DoesNotExist:
        return HttpResponse(status=404)
    
    serializer = RaceSimpleSerializer(race)

    return JsonResponse({
        "race": serializer.data,
    }, status=200)

def get_season_races(request):
    if request.method != "GET":
        return HttpResponse(status=405)
    
    season_year = int(request.GET.get("season", -1))

    if season_year == -1:
        return HttpResponse(status=404)
    
    try:
        season = Season.objects.filter(visible=True).get(year=season_year)
    except Season.DoesNotExist:
        return HttpResponse(status=404)
    
    races = season.races.order_by("-timestamp")

    serializer = RaceSimpleSerializer(races, many=True)

    return JsonResponse({
        "races": serializer.data,
    }, status=200)

def create_complete_race(request):
    if request.method != 'POST':
        return HttpResponse(status=405)
    
    if not request.user.is_authenticated or not request.user.is_admin:
        return HttpResponse(status=403)
    
    response = {
        "competitors_not_found": [],
        "invalid_competitors_positions_spacing": [],
        "invalid_competitors_positions": False,
        "invalid_season": False,
        "invalid_race_data": False,
    }
    
    data = json.loads(request.body)
    season_year = data.pop("season_year", False)

    try:
        season = Season.objects.filter(visible=True).get(year=season_year)
    except Season.DoesNotExist:
        response["invalid_season"] = True
        return JsonResponse(response, status=400)
    
    if season.finalized:
        return HttpResponse(status=405)
    
    validated_race_data = validate_generate_complete_manual_race(data)

    response["invalid_competitors_positions_spacing"] = validated_race_data.pop("invalid_competitors_positions_spacing")
    response["competitors_not_found"] = validated_race_data.pop("competitors_not_found")

    if any(response["invalid_competitors_positions_spacing"]) or any(response["competitors_not_found"]):
        return JsonResponse(response, status=400)
        
    race_serializer = RaceWriteSerializer(data=validated_race_data["race"])

    if not race_serializer.is_valid():
        print(race_serializer.errors)
        response["invalid_race_data"] = True
        return JsonResponse(response, status=400)
    
    race = race_serializer.save()

    season.races.add(race)
    season.save()

    add_points = add_points_to_season_competitors(race=race, season=season)

    season.save()

    if not add_points:
        race.remove()

    update_members_points()
    sort_standings(season)

    return JsonResponse(response, status=201)
    
def create_race(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    
    if not request.user.is_authenticated or not request.user.is_admin:
        return HttpResponse(status=403)
    
    data = json.loads(request.body)
    season_year = data.get("seasonYear", False)

    try:
        season = Season.objects.filter(visible=True).get(year=season_year)
    except Season.DoesNotExist:
        return HttpResponse(status=400)
    
    if season.finalized:
        return HttpResponse(status=400)

    serializer = RaceWriteSerializer(data)

    if not serializer.is_valid() or not season_year:
        return HttpResponse(status=400)
    
    race = serializer.save()
    season.races.add(race)

    return HttpResponse(status=200)

def create_race_link(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    
    if not request.user.is_authenticated or not request.user.is_admin:
        return HttpResponse(status=403)
    
    response = {
        "invalid_link": False,
        "invalid_season": False,
        "invalid_type": False,
        "timeout": False,
        "selenium_available": True,
        "standings_error": False,
    }

    data = json.loads(request.body)

    validated_data_response = validate_race_link_data(data)
    response["invalid_link"] = validated_data_response["invalid_link"]
    response["invalid_season"] = validated_data_response["invalid_season"]
    response["invalid_type"] = validated_data_response["invalid_type"]
    response["selenium_available"] = validated_data_response["selenium_available"]
    data["link"] = validated_data_response["link"]
    data["request"] = request
    season = validated_data_response.pop("season")
    race_type = int(data.pop("race_type"))
    is_sprint = race_type == RACE_TYPE_SPRINT
    is_final = race_type == RACE_TYPE_FINAL

    if response["invalid_link"] or response["invalid_season"] or response["invalid_type"] or not response["selenium_available"]:
        return JsonResponse(response, status=400)
    
    race_data = generate_link_race_data(data, season, is_sprint, is_final)

    response["timeout"] = race_data["timeout"]
    response["competitors_not_found"] = race_data["competitors_not_found"]
    
    if response["timeout"] or any(response["competitors_not_found"]):
        return JsonResponse(response, status=400)
        
    serializer = RaceWriteSerializer(data=race_data["data"])

    if not serializer.is_valid():
        print(serializer.errors)
        return JsonResponse(validated_data_response, status=400)
    
    race = serializer.save()

    if race.finalized:
        competitors_positions = race.competitors_positions.all()
        race_standings_data = generate_race_standings(competitors_positions, season)
        standings_serializer = StandingsRaceWriteSerializer(data=race_standings_data["data"])

        if not standings_serializer.is_valid() or race_standings_data["competitor_not_found"]:
            print(standings_serializer.errors)
            race.remove()
            race.save()
            response["standings_error"] = True
            return JsonResponse(response, status=400)
        
        race_standings = standings_serializer.save()
        sort_race_standings(race_standings, season)
        race.standings = race_standings
        race.save()

    add_points = add_points_to_season_competitors(season, race)

    if not add_points:
        race.remove()
        race.save()
        return JsonResponse(response, status=400)
    
    season.races.add(race)

    update_members_points()
    sort_standings(season)
    
    return JsonResponse(response, status=201)

def retrieve_race_result(request):
    if request.method != "PUT":
        return HttpResponse(status=405)
    
    if not request.user.is_authenticated or not request.user.is_admin:
        return HttpResponse(status=403)
    
    data = json.loads(request.body)
    race_id = data.get("race_id", -1)

    if race_id == -1:
        return HttpResponse(status=400)
    
    try:
        race = Race.objects.get(pk=race_id)
    except Race.DoesNotExist:
        return HttpResponse(status=404)
    
    if race.finalized or race.url is None:
        return HttpResponse(status=400)
    
    season = race.season.first()
    
    positions_data = process_retrieve_race_result(race, request)

    if not positions_data["selenium_available"]:
        return HttpResponse(status=503)
    
    if positions_data["timeout"]:
        return HttpResponse(status=408)
    
    competitors_serializer = CompetitorPositionWriteSerializer(data=positions_data["data"]["competitors_positions"], many=True)

    if not competitors_serializer.is_valid():
        print(competitors_serializer.errors)
        return HttpResponse(status=422)
    
    competitors_positions = competitors_serializer.save()
    race.competitors_positions.add(*competitors_positions)
    competitors_positions = CompetitorPosition.objects.filter(final_race=race)

    race_standings_data = generate_race_standings(competitors_positions, season)
    standings_serializer = StandingsRaceWriteSerializer(data=race_standings_data["data"])

    if not standings_serializer.is_valid() or race_standings_data["competitor_not_found"]:
        print(standings_serializer.errors)
        for competitor_position in competitors_positions:
            competitor_position.delete()

        return HttpResponse(status=400)

    race_standings = standings_serializer.save()

    race.standings = race_standings
    race.finalized = True
    race.save()

    add_points_to_season_competitors(race=race, season=season)
    season.save()

    update_members_points()
    sort_race_standings(race.standings, season)
    sort_standings(season)

    return HttpResponse(status=201)

#this is for when the admin adds a race result manually
def add_race_results(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    
    if not request.user.is_authenticated or not request.user.is_admin:
        return HttpResponse(status=403)
    
    data = json.loads(request.body)
    competitors_positions = data.get("competitors_positions")
    race_id = int(data.get("raceId", -1))
    finalized = False
    
    try:
        race = Race.objects.get(pk=race_id)
        finalized = race.finalized
    except Race.DoesNotExist:
        return HttpResponse(status=404)
    
    if finalized:
        return HttpResponse(status=400)
    
    if race.is_sprint:
        points_list = [12, 9, 7, 6, 5, 4, 3, 2, 1]
    else:
        points_list = [25, 20, 16, 13, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    
    final_competitors_positions = []
    prev_competitor = {
        "competitorId": None,
        "position": 0,
    }

    #check that positions are valid and save each competitor position
    for competitor_position in competitors_positions:
        #making sure they are all valid before saving
        if competitor_position["position"] != 0:
            if (competitor_position["position"] - prev_competitor["position"]) != 1:
                return HttpResponse(status=400)
        
        try:
            competitor = Competitor.objects.get(pk=competitor_position["competitorId"])
        except Competitor.DoesNotExist:
            return HttpResponse(status=400)
        
        temp_final_competitor_position = {
            "race": race,
            "competitor": competitor,
            "position": competitor_position["position"],
        }
        final_competitors_positions.append(temp_final_competitor_position)
        prev_competitor = competitor_position

    for final_competitor_position in final_competitors_positions:
        serializer = CompetitorPositionWriteSerializer(final_competitor_position)

        if not serializer.is_valid():
            return HttpResponse(status=400)

    for final_competitor_position in final_competitors_positions:
        serializer = CompetitorPositionWriteSerializer(final_competitor_position)
        serializer.save()

    j = len(points_list)
    if len(points_list) > len(final_competitors_positions):
        j = len(final_competitors_positions)

    for i in range(0, j):
        if final_competitors_positions[i]["position"] != 0:
            final_competitors_positions[i]["competitor"].points += points_list[final_competitors_positions[i]["position"]-1]
            final_competitors_positions[i]["competitor"].save()

    race.finalized = True
    race.save()

    update_members_points()
    sort_standings(race.season)

    return HttpResponse(status=200) 


def edit_race(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    
    if not request.user.is_authenticated or not request.user.is_admin:
        return HttpResponse(status=403)
    
    data = json.loads(request.body)
    race_id = int(data.get("raceId", -1))

    if race_id == -1:
        return HttpResponse(status=400)
    
    try:
        race = Race.objects.get(pk=race_id)
    except Race.DoesNotExist:
        return HttpResponse(status=404)

    serializer = RaceWriteSerializer(data=data, instance=race)
    if not serializer.is_valid():
        return HttpResponse(status=400)

    race = serializer.save()

    return HttpResponse(status=201)

def delete_race(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    
    if not request.user.is_authenticated or not request.user.is_admin:
        return HttpResponse(status=403)
    
    data = json.loads(request.body)
    race_id = data.get("raceId", -1)
    year = data.get("year", 0)

    if not year:
        return HttpResponse(status=400)

    if race_id == -1:
        return HttpResponse(status=400)
    
    try:
        race = Race.objects.get(pk=race_id)
    except Race.DoesNotExist:
        return HttpResponse(status=404)
    
    try:
        season = Season.objects.filter(visible=True).get(year=year)
    except Season.DoesNotExist:
        return HttpResponse(status=404)
    
    if season.finalized:
        return HttpResponse(status=400)

    if race.finalized:
        try:
            competitors_positions = CompetitorPosition.objects.filter(final_race=race)
        except CompetitorPosition.DoesNotExist:
            return HttpResponse(status=400)
        
        if race.is_sprint:
            points_list = [12, 9, 7, 6, 5, 4, 3, 2, 1]
        else:
            points_list = [25, 20, 16, 13, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

        for competitor_position in competitors_positions:
            if competitor_position.position != 0:
                index = competitor_position.position - 1
                if index < len(points_list):
                    try:
                        season_competitor_position = SeasonCompetitorPosition.objects.filter(season=season).get(competitor_points__competitor__number=competitor_position.competitor_points.competitor.number)
                    except SeasonCompetitorPosition.DoesNotExist:
                        season_competitor_position = None

                    if season_competitor_position is not None:
                        season_competitor_position.competitor_points.points -= points_list[index]
                        if season_competitor_position.competitor_points.points < 0:
                            season_competitor_position.competitor_points.points = 0
                        season_competitor_position.competitor_points.save()

                    

    race.delete()
    update_members_points()
    sort_standings(season)
    return HttpResponse(status=200)