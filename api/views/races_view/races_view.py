from django.http import HttpResponse, JsonResponse

from .races_validators import validate_race_link_data, generate_link_race_data, validate_generate_complete_manual_race, process_retrieve_race_result, generate_race_weekend_standings, validate_race_weekend_data, generate_qualifying_positions_data, generate_race_data
from .races_validators import RACE_TYPE_UPCOMING, RACE_TYPE_SPRINT, RACE_TYPE_FINAL, RACE, SPRINT_RACE, GRID
from .races_util import add_points_to_season_competitors, remove_points_from_season_competitors

from ...models import Race, Season, CompetitorPosition, Competitor, CurrentSeason, SeasonCompetitorPosition, SeasonMessage, RaceWeekend
from ...serializers.competitors_serializers import CompetitorPositionWriteSerializer
from ...serializers.races_serializers import RaceWriteSerializer, RaceSimpleSerializer, RaceReadSerializer, RaceWeekendWriteSerializer, RaceWeekendAdminSerializer, RaceWeekendSimpleSerializer, RaceWeekendReadSerializer
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
        
    serializer = RaceReadSerializer(race)

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

def get_race_weekend(request):
    if request.method != 'GET':
        return HttpResponse(status=405)

    race_weekend_id = request.GET.get("id", -1)
    if race_weekend_id == -1:
        return HttpResponse(status=404)

    try:
        race_weekend = RaceWeekend.objects.get(pk=race_weekend_id)
    except RaceWeekend.DoesNotExist:
        return HttpResponse(status=404)

    serializer = RaceWeekendReadSerializer(race_weekend)

    return JsonResponse({"race_weekend": serializer.data}, status=200)

def get_race_weekends(request):
    if request.method != "GET":
        return HttpResponse(status=405)

    season_year = request.GET.get("season", False)
    response = {
        "invalid_season": not season_year,
        "race_weekends": [],
    }

    if not season_year:
        return JsonResponse(response, status=400)

    try:
        season = Season.objects.filter(visible=True).get(year=season_year)
    except season.DoesNotExist:
        response["invalid_season"] = True
        return JsonResponse(response, status=400)

    race_weekends = season.race_weekends.all()
    serializer = RaceWeekendSimpleSerializer(race_weekends, many=True)
    response["race_weekends"] = serializer.data

    return JsonResponse(response, status=200)
    

def get_race_weekend_admin(request):
    if request.method != "GET":
        return HttpResponse(status=405)
    
    if not request.user.is_admin:
        SeasonMessage.objects.create(
            season = None,
            message = f"User: {request.user.username} tried to retrieve a race weekend admin version",
            type = 0,
        )
        return HttpResponse(status=403)
    
    race_weekend_id = request.GET.get("id", -1)

    if race_weekend_id == -1:
        return HttpResponse(status=400)
    
    try:
        race_weekend = RaceWeekend.objects.get(pk=race_weekend_id)
    except RaceWeekend.DoesNotExist:
        return HttpResponse(status=404)
    
    serializer = RaceWeekendAdminSerializer(race_weekend)

    return JsonResponse({
        "race_weekend": serializer.data,
    }, status=200)

def create_race_weekend(request):
    if request.method != 'POST':
        return HttpResponse(status=405)
    
    if not request.user.is_authenticated or not request.user.is_admin:
        SeasonMessage.objects.create(
            season = None,
            message = f"User: {request.user.username} tried to create a race weekend (they weren't an admin or not logged in)",
            type = 0
        )
        return HttpResponse(status=403)

    data = json.loads(request.body)
    
    validated_data = validate_race_weekend_data(data)

    if validated_data["invalid_link"]:
        SeasonMessage.objects.create(
            season = validated_data["season"],
            message = f"When trying to create a race weekend the link was found to not be valid or found",
            type = 0,
        )
        validated_data.pop("season")
        validated_data.pop("url")
        return JsonResponse(validated_data, status=400)
    
    if validated_data["invalid_season"]:
        SeasonMessage.objects.create(
            season = None,
            message = f"The season year given was invalid when trying to create a race weekend",
            type = 0,
        )
        validated_data.pop("season")
        validated_data.pop("link")
        return JsonResponse(validated_data, status=400)
    
    
    generated_data = {
        "start": data.get("start"),
        "end": data.get("end"),
        "title": data.get("title"),
        "url": validated_data.get("url"),
        "season": validated_data.get("season").id
    }

    serializer = RaceWeekendWriteSerializer(data=generated_data)

    if not serializer.is_valid():
        SeasonMessage.objects.create(
            season = validated_data.get("season"),
            message = f"When creating the race weekend, some data was invalid: {serializer.errors}",
            type = 0,
        )
        return HttpResponse(status=400)
    
    serializer.save()

    return HttpResponse(status=201)

def edit_race_weekend(request):
    if request.method != "PUT":
        return HttpResponse(status=405)
    
    if not request.user.is_admin:
        SeasonMessage.objects.create(
            season = None,
            message = f"User: {request.user.username} tried to edit a race weekend (they aren't an admin)",
            type= 0,
        )
        return HttpResponse(status=403)
    
    data = json.loads(request.body)
    new_race_weekend = data.get("race_weekend_data")
    id = new_race_weekend["id"]

    try:
        race_weekend = RaceWeekend.objects.get(pk=id)
    except RaceWeekend.DoesNotExist:
        return HttpResponse(status=404)
        
    race_weekend_serializer = RaceWeekendWriteSerializer(instance=race_weekend, data=new_race_weekend)

    if not race_weekend_serializer.is_valid():
        SeasonMessage.objects.create(
            season=race_weekend.season.first(),
            message=f"Some data was invalid when validating the {race_weekend.title} edits: {race_weekend_serializer.errors}",
            type = 0,
        )
        return HttpResponse(status=400)
    
    race_weekend_serializer.save()
    return HttpResponse(status=201)

def post_race_weekend_event(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    
    if not request.user.is_admin:
        SeasonMessage.objects.create(
            season = None,
            message = f"User: {request.user.username} tried to post a race weekend event",
            type = 0,
        )
        return HttpResponse(status=403)
    
    data = json.loads(request.body)
    id = data.get("id", -1)
    event_type = data.get("event_type", False)

    if id == -1 or not event_type:
        return HttpResponse(status = 400)
    
    try:
        race_weekend = RaceWeekend.objects.get(pk=id)
    except RaceWeekend.DoesNotExist:
        return HttpResponse(status=404)
    
    url = race_weekend.url
    season = race_weekend.season.first()
    if event_type == RACE:
        race_data = generate_race_data(race_weekend, False, request, season)
    elif event_type == SPRINT_RACE:
        race_data = generate_race_data(race_weekend, True, request, season)

    response = {
        "competitors_not_found": race_data.pop("competitors_not_found"),
        "timeout": race_data.pop("timeout"),
        "selenium_busy": race_data.pop("selenium_busy"),
    }

    if any(response["competitors_not_found"]) or response["timeout"] or response["selenium_busy"]:
        if any(response["competitors_not_found"]):
            SeasonMessage.objects.create(
                season = season,
                message = f"Couldn't create the race for {race_weekend.title}, because the competitors: {', '.join(response['competitors_not_found'])} were not found in the season riders",
                type = 0
            )
        
        if response["timeout"]:
            SeasonMessage.objects.create(
                season = season,
                message = f"Motorsport.com took too long to response",
                type = 0,
            )

        if response['selenium_busy']:
            SeasonMessage.objects.create(
                season = season,
                message = f"There is already another process in progress",
                type = 0,
            )

        return JsonResponse(response, status=400)

    serializer = RaceWeekendWriteSerializer(instance=race_weekend, data=race_data)

    if not serializer.is_valid():
        SeasonMessage.objects.create(
            season = season,
            message = f"These errors ocurred when trying to retrieve a race result for {race_weekend.title}: {serializer.errors}",
            type = 0,
        )
        return HttpResponse(status=400)
    
    serializer.save()
    return HttpResponse(status=201)

def finalize_race_weekend(request):
    if request.method != 'PUT':
        return HttpResponse(status=405)
    
    if not request.user.is_authenticated:
        SeasonMessage.objects.create(
            season = None,
            message = f"A user that isn't logged in tried to finalize a race weekend",
            type = 0,
        )
    
    if not request.user.is_admin:
        SeasonMessage.objects.create(
            season = None,
            message = f"User: {request.user.username} tried to finalize a race weekend event",
            type = 0,
        )
        return HttpResponse(status=403)
    
    STATUS_FINAL = 2
    data = json.loads(request.body)
    id = data.get("id", -1)

    if id == -1:
        return HttpResponse(status=400)
    
    try:
        race_weekend = RaceWeekend.objects.get(pk=id)
    except RaceWeekend.DoesNotExist:
        return HttpResponse(status=404)
    
    season = race_weekend.season.first()

    response = {
        "cant_be_finalized": race_weekend.race == None or race_weekend.sprint_race == None,
        "competitors_not_found": [],
    }

    if response["cant_be_finalized"]:
        SeasonMessage.objects.create(
            season = season,
            message = f"When trying to finalize the {race_weekend.title} weekend, make sure both the race and sprint race have been retrieved",
            type = 0,
        )
        return JsonResponse(response, status=400)

    standings_data = generate_race_weekend_standings(race_weekend, season)

    response["competitors_not_found"] = standings_data["competitors_not_found"]

    if any(response["competitors_not_found"]):
        SeasonMessage.objects.create(
            season = season,
            message = f"When creating the standings for the {race_weekend.title} weekend, these competitors were not found: {" ".join(standings_data["competitors_not_found"])} in the season competitors list",
            type = 0,
        )
        return JsonResponse(response, status=400)

    serializer = RaceWeekendWriteSerializer(instance=race_weekend, data=standings_data)
    
    if not serializer.is_valid():
        standings_data.pop("standings")
        SeasonMessage.objects.create(
            season = season,
            message = f"When validating the standings data for the {race_weekend.title} weekend, these errors occured: {serializer.errors}",
            type = 0,
        )
        return JsonResponse(response, status=400)
    
    instance = serializer.save()

    #TODO: move to serializer
    if add_points_to_season_competitors(season, instance):
        instance.status = STATUS_FINAL
        instance.save()
        return HttpResponse(status=201)
    else:
        SeasonMessage.objects.create(
            season=season,
            message=f"When trying to add the points from the race weekend to the season competitors, one or more weren't found",
            type = 0,
        )
        return HttpResponse(status=409)

def un_finalize_race_weekend(request):
    if request.method != "PUT":
        return HttpResponse(status=405)

    if not request.user.is_authenticated:
        SeasonMessage.objects.create(
            season = None,
            message = "A user that isn't logged in tried to un finalize a race weekend",
            type = 0,
        )
        return HttpResponse(status=403)

    if not request.user.is_admin:
        SeasonMessage.objects.create(
            season = None,
            message = f"User: {request.user.username} tried to un finalize a race weekend (they aren't an admin)",
            type = 0,
        )
        return HttpResponse(status=403)

    STATUS_IN_PROGRESS = 1


    data = json.loads(request.body)
    id = data.get("id", -1)

    if id == -1:
        return HttpResponse(status=400)

    try:
        race_weekend = RaceWeekend.objects.get(pk=id)
    except RaceWeekend.DoesNotExist:
        return HttpResponse(status=404)

    race_weekend.standings.delete()
    race_weekend.refresh_from_db()  # Refresh to clear deleted references
    race_weekend.save()

    if remove_points_from_season_competitors(race_weekend.season.first(), race_weekend):
        race_weekend.status = STATUS_IN_PROGRESS
        race_weekend.save()
        return HttpResponse(status=201)
    else:
        SeasonMessage.objects.create(
            season=season,
            message=f"When trying to remove the points from the race weekend to the season competitors, one or more weren't found",
            type = 0,
        )
        return HttpResponse(status=409)

def delete_race_weekend(request):
    if request.method != "PUT":
        return HttpResponse(status=405)
    
    if not request.user.is_admin:
        SeasonMessage.objects.create(
            season = None,
            message = f"User: {request.user.username} tried to delete a race weekend",
            type = 0,
        )
        return HttpResponse(status=403)
    
    data = json.loads(request.body)
    race_weekend_id = data.get("id")

    try:
        race_weekend = RaceWeekend.objects.get(pk=race_weekend_id)
    except RaceWeekend.DoesNotExist:
        return HttpResponse(status=404)

    if not race_weekend.status == 2:
        race_weekend.delete()
        return HttpResponse(status=201)

    if remove_points_from_season_competitors(race_weekend.season.first(), race_weekend):
        race_weekend.delete()
        return HttpResponse(status=201)
    else:
        SeasonMessage.objects.create(
            season=season,
            message=f"When trying to remove the points from the race weekend to the season competitors, one or more weren't found",
            type = 0,
        )
        return HttpResponse(status=409)
    


def create_race_weekend_qualifying_positions(request):
    if request.method != "POST":
        return HttpResponse(status=405)

    if not request.user.is_admin:
        return HttpResponse(status=403)
    
    data = json.loads(request.body)
    race_weekend_id = data.get("race_weekend_id")

    try:
        race_weekend = RaceWeekend.objects.get(pk=race_weekend_id)
    except RaceWeekend.DoesNotExist:
        return HttpResponse(status=404)
    
    qualifying_positions_data = generate_qualifying_positions_data(race_weekend.url, race_weekend.season.first())
    if qualifying_positions_data["timeout"]:
        SeasonMessage.objects.create(
            season = race_weekend.season.first(),
            message = f"failed to connect to motorsport.com",
            type = 0,
        )
        qualifying_positions_data.pop("data")
        return JsonResponse(qualifying_positions_data, status=400)

    serializer = RaceWeekendWriteSerializer(instance=race_weekend, data=qualifying_positions_data["data"])

    if not serializer.is_valid():
        SeasonMessage.objects.create(
            season=race_weekend.season.first(),
            message = f"There was a problem validating the qualifying positions: {serializer.errors}",
            type = 0,
        )

    serializer.save()
    return HttpResponse(status=201)        

def create_complete_race(request):
    if request.method != 'POST':
        return HttpResponse(status=405)
    
    if not request.user.is_authenticated or not request.user.is_admin:
        SeasonMessage.objects.create(
            season = None,
            message = f"User: {request.user.username} tried to create a race (they weren't an admin or not logged in)",
            type = 0
        )
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
        SeasonMessage.objects.create(
            season = None,
            message = f"When creating the race: {data['race']['title']}, the season: {season_year} was not found",
            type = 0
        )
        return JsonResponse(response, status=400)
    
    if season.finalized:
        SeasonMessage.objects.create(
            season = season,
            message = f"Couldn't create the race: {data['race']['title']}, because the season: {season_year} is finalized",
            type = 0
        )
        return HttpResponse(status=405)
    
    validated_race_data = validate_generate_complete_manual_race(data)

    response["invalid_competitors_positions_spacing"] = validated_race_data.pop("invalid_competitors_positions_spacing")
    response["competitors_not_found"] = validated_race_data.pop("competitors_not_found")

    if any(response["invalid_competitors_positions_spacing"]) or any(response["competitors_not_found"]):
        SeasonMessage.objects.create(
            season = season,
            message = f"Couldn't create the race: {data['race']['title']}, because the competitors: {', '.join(response['competitors_not_found'])} were not found in the season riders",
            type = 0
        )
        return JsonResponse(response, status=400)
        
    race_serializer = RaceWriteSerializer(data=validated_race_data['race'])

    if not race_serializer.is_valid():
        print(race_serializer.errors)
        response["invalid_race_data"] = True
        SeasonMessage.objects.create(
            season = season,
            message = f"Data was invalid: {race_serializer.errors} when creating race: {data['race']['title']}",
            type = 0
        )
        return JsonResponse(response, status=400)
    
    race = race_serializer.save()

    season.races.add(race)
    season.save()

    add_points = add_points_to_season_competitors(race=race, season=season)

    season.save()

    if not add_points:
        race.delete()

    update_members_points()
    sort_standings(season)

    return JsonResponse(response, status=201)
    
def create_race(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    
    if not request.user.is_authenticated or not request.user.is_admin:
        SeasonMessage.objects.create(
            season = None,
            message = f"User: {request.user.username} tried to create a race (they weren't an admin or not logged in)",
            type = 0
        )
        return HttpResponse(status=403)
    
    data = json.loads(request.body)
    season_year = data.get("seasonYear", False)

    try:
        season = Season.objects.filter(visible=True).get(year=season_year)
    except Season.DoesNotExist:
        SeasonMessage.objects.create(
            season = None,
            message = f"When creating the race: {data['race']['title']}, the season: {season_year} was not found",
            type = 0
        )
        return HttpResponse(status=400)
    
    if season.finalized:
        SeasonMessage.objects.create(
            season = season,
            message = f"Couldn't create the race: {data['race']['title']}, because the season: {season_year} is finalized",
            type = 0
        )
        return HttpResponse(status=400)

    serializer = RaceWriteSerializer(data)

    if not serializer.is_valid() or not season_year:
        SeasonMessage.objects.create(
            season = season,
            message = f"Data was invalid: {serializer.errors}",
            type = 0
        )
        return HttpResponse(status=400)
    
    race = serializer.save()
    season.races.add(race)

    return HttpResponse(status=200)

def create_race_link(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    
    if not request.user.is_authenticated or not request.user.is_admin:
        SeasonMessage.objects.create(
            season = None,
            message = f"User: {request.user.username} tried to create a race (they weren't an admin or not logged in)",
            type = 0
        )
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
        SeasonMessage.objects.create(
            season = season,
            message = 
                " ".join(filter(None, [
                "Link was invalid" if response["invalid_link"] else "",
                "Invalid season" if response["invalid_season"] else "",
                "Invalid race type" if response["invalid_type"] else "",
                "Server can't retrieve result right now, contact admin" if not response["selenium_available"] else "",
                f"when validating: {data['link']}"])),

            type = 0
        )
        return JsonResponse(response, status=400)
    
    race_data = generate_link_race_data(data, season, is_sprint, is_final)

    response["timeout"] = race_data["timeout"]
    response["competitors_not_found"] = race_data["competitors_not_found"]
    
    if any(response["competitors_not_found"]):
        SeasonMessage.objects.create(
            season = season,
            message = f"Couldn't create the race: {data['race']['title']}, because the competitors: {', '.join(response['competitors_not_found'])} were not found in the season riders",
            type = 0
        )
        return JsonResponse(response, status=400)
    
    if response["timeout"]:
        SeasonMessage.objects.create(
            season = season,
            message = f"motorsport.com didn't response when using link: {data['link']}",
            type = 0
        )
        return JsonResponse(response, status=400)
        
    serializer = RaceWriteSerializer(data=race_data["data"])

    if not serializer.is_valid():
        print(serializer.errors)
        SeasonMessage.objects.create(
            season = season,
            message = f"Data was invalid: {serializer.errors} when building race from link: {data['link']}",
            type = 0
        )
        return JsonResponse(validated_data_response, status=400)
    
    race = serializer.save()

    if race.finalized:
        competitors_positions = race.competitors_positions.all()
        race_standings_data = generate_race_standings(competitors_positions, season)
        standings_serializer = StandingsRaceWriteSerializer(data=race_standings_data["data"])

        if not standings_serializer.is_valid() or race_standings_data["competitor_not_found"]:
            print(standings_serializer.errors)
            print(standings_serializer.error_messages)
            response["standings_error"] = True
            SeasonMessage.objects.create(
                season = season,
                message = f"Standings data was invalid: {standings_serializer.errors} when building race from link: {data['link']}",
                type = 0
            )
            return JsonResponse(response, status=400)
                
        race_standings = standings_serializer.save()
        sort_race_standings(race_standings, season)
        race.standings = race_standings
        race.is_sprint = is_sprint
        race.save()

    add_points = add_points_to_season_competitors(season, race)

    if not add_points:
        SeasonMessage.objects.create(
            season = season,
            message = f"When adding the points to the season competitors after making the race: {race.title}, something went wrong, the race was automatically deleted",
            type = 0
        )
        race.delete()
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
        SeasonMessage.objects.create(
            season = None,
            message = f"User: {request.user.username} tried to retrieve a race result (they weren't an admin or not logged in)",
            type = 0
        )
        return HttpResponse(status=403)
    
    data = json.loads(request.body)
    race_id = data.get("race_id", -1)

    if race_id == -1:
        SeasonMessage.objects.create(
            season = None,
            message = f"Could not find race_id in the data sent to the server",
            type = 0
        )
        return HttpResponse(status=400)
    
    try:
        race = Race.objects.get(pk=race_id)
    except Race.DoesNotExist:
        SeasonMessage.objects.create(
            season = None,
            message = f"Could not find the race associated to the race id: {race_id} in the data sent to the server",
            type = 0
        )
        return HttpResponse(status=404)
    
    if race.finalized or race.url is None:
        return HttpResponse(status=400)
    
    season = race.season.first()
    
    positions_data = process_retrieve_race_result(race, request)

    if not positions_data["selenium_available"]:
        SeasonMessage.objects.create(
            season = season,
            message = f"Server could not start the browser used for retreiving race results",
            type = 0
        )
        return HttpResponse(status=503)
    
    if positions_data["timeout"]:
        SeasonMessage.objects.create(
            season = season,
            message = f"motorsport.com took to long to respond to the link: {race.url}",
            type = 0
        )
        return HttpResponse(status=408)
    
    competitors_serializer = CompetitorPositionWriteSerializer(data=positions_data["data"]["competitors_positions"], many=True)

    if not competitors_serializer.is_valid():
        print(competitors_serializer.errors)
        SeasonMessage.objects.create(
            season = season,
            message = f"When creating the competitors positions data, this error ocurred: {competitors_serializer.errors}",
            type = 0
        )
        return HttpResponse(status=422)
    
    competitors_positions = competitors_serializer.save()
    race.competitors_positions.add(*competitors_positions)
    competitors_positions = CompetitorPosition.objects.filter(final_race=race)

    race_standings_data = generate_race_standings(competitors_positions, season)
    standings_serializer = StandingsRaceWriteSerializer(data=race_standings_data["data"])

    if not standings_serializer.is_valid():
        print(standings_serializer.errors)
        for competitor_position in competitors_positions:
            competitor_position.delete()

        SeasonMessage.objects.create(
            season = season,
            message = f"When creating the race standings data, this error ocurred: {standings_serializer.errors}",
            type = 0
        )

        return HttpResponse(status=400)
    
    if race_standings_data["competitor_not_found"]:
        for competitor_position in competitors_positions:
            competitor_position.delete()

        SeasonMessage.objects.create(
            season = season,
            message = f"When creating the race standings data, one or more competitors were not found in the season rider list",
            type = 0
        )

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
        SeasonMessage.objects.create(
            season = None,
            message = f"User: {request.user.username} tried to add a race result (they weren't an admin or not logged in)",
            type = 0
        )
        return HttpResponse(status=403)
    
    data = json.loads(request.body)
    competitors_positions = data.get("competitors_positions")
    race_id = int(data.get("raceId", -1))
    finalized = False

    if race_id == -1:
        SeasonMessage.objects.create(
            season = None,
            message = f"Could not find race_id in the data sent to the server",
            type = 0
        )
        return HttpResponse(status=400)
    
    try:
        race = Race.objects.get(pk=race_id)
        finalized = race.finalized
    except Race.DoesNotExist:
        SeasonMessage.objects.create(
            season = None,
            message = f"Race (id): {race_id} was not found",
            type = 0
        )
        return HttpResponse(status=404)
    
    season = race.season
    
    if finalized:
        SeasonMessage.objects.create(
            season = season,
            message = f"Race: {race.title} is already finalized",
            type = 0
        )
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
                SeasonMessage.objects.create(
                    season = season,
                    message = f"There was a difference of positions bigger than 1 ({competitor_position['position']} - {prev_competitor['position']})",
                    type = 0
                )
                return HttpResponse(status=400)
        
        try:
            competitor = Competitor.objects.get(pk=competitor_position["competitorId"])
        except Competitor.DoesNotExist:
            SeasonMessage.objects.create(
                season = season,
                message = f"Could not find competitor data for the competitor id: {competitor_position['competitorId']}",
                type = 0
            )
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
            SeasonMessage.objects.create(
                season = season,
                message = f"When trying to create a competitor position, this error ocurred: {serializer.errors}",
                type = 0
            )
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
        SeasonMessage.objects.create(
            season = None,
            message = f"User: {request.user.username} tried to edit a race, they aren't logged in or aren't an admin",
            type = 0
        )
        return HttpResponse(status=403)
    
    data = json.loads(request.body)
    race_id = int(data.get("raceId", -1))

    if race_id == -1:
        SeasonMessage.objects.create(
            season = None,
            message = f"Could not find race_id in the data sent to the server",
            type = 0
        )
        return HttpResponse(status=400)
    
    try:
        race = Race.objects.get(pk=race_id)
    except Race.DoesNotExist:
        SeasonMessage.objects.create(
            season = None,
            message = f"Could not find a race associated to the id: {race_id}",
            type = 0
        )
        return HttpResponse(status=404)
    
    season = race.season

    serializer = RaceWriteSerializer(data=data, instance=race)
    if not serializer.is_valid():
        SeasonMessage.objects.create(
            season = season,
            message = f"When trying to edit the race, this error ocurred: {serializer.errors}",
            type = 0
        )
        return HttpResponse(status=400)

    race = serializer.save()

    return HttpResponse(status=201)

def delete_race(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    
    if not request.user.is_authenticated or not request.user.is_admin:
        SeasonMessage.objects.create(
            season = None,
            message = f"User: {request.user.username} tried to delete a race, they aren't logged in or aren't an admin",
            type = 0
        )
        return HttpResponse(status=403)
    
    data = json.loads(request.body)
    race_id = data.get("raceId", -1)
    year = data.get("year", 0)

    if not year:
        SeasonMessage.objects.create(
            season = None,
            message = f"Season year data was not found",
            type = 0
        )
        return HttpResponse(status=400)

    if race_id == -1:
        SeasonMessage.objects.create(
            season = None,
            message = f"Race id was not found in the data sent",
            type = 0
        )
        return HttpResponse(status=400)
    
    try:
        race = Race.objects.get(pk=race_id)
    except Race.DoesNotExist:
        SeasonMessage.objects.create(
            season = None,
            message = f"No race was found associated to the id: {race_id}",
            type = 0
        )
        return HttpResponse(status=404)
    
    try:
        season = Season.objects.filter(visible=True).get(year=year)
    except Season.DoesNotExist:
        SeasonMessage.objects.create(
            season = None,
            message = f"Season: {year} was not found",
            type = 0
        )
        return HttpResponse(status=404)
    
    if season.finalized:
        SeasonMessage.objects.create(
            season = season,
            message = f"Season: {year} is finalized, no races or competitors can be modified",
            type = 0
        )
        return HttpResponse(status=400)

    race.delete()
    return HttpResponse(status=201)