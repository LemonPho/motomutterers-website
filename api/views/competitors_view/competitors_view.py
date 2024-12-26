from django.http import HttpResponse, JsonResponse
from django.db import transaction

from ...models import Competitor, Season, CompetitorPosition, SeasonCompetitorPosition, CurrentSeason
from ...serializers.competitors_serializers import CompetitorWriteSerializer, CompetitorPositionWriteSerializer, CompetitorPointsWriteSerializer, CompetitorPositionSimpleSerializer
from ...serializers.seasons_serializers import SeasonCompetitorPositionWriteSerializer, SeasonCompetitorPositionSerializer
from .competitors_validators import validate_competitor_data, generate_season_competitor_position_data, generate_competitor_table_data, validate_season_competitors_data, generate_competitor_points_data

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException

import json

def get_competitor_position(request):
    if request.method != "GET":
        return HttpResponse(status=405)
    
    competitor_id = request.GET.get("id", False)
    
    if competitor_id:
        try:
            competitor = CompetitorPosition.objects.get(pk=competitor_id)
        except CompetitorPosition.DoesNotExist:
            return HttpResponse(status=404)
        
    serializer = CompetitorPositionSimpleSerializer(competitor)

    return JsonResponse({
        "competitorPosition": serializer.data,
    }, status=200)

def get_season_competitor(request):
    if request.method != "GET":
        return HttpResponse(status=405)
    
    competitor_id = request.GET.get("id", False)
    
    if competitor_id:
        try:
            competitor = SeasonCompetitorPosition.objects.get(pk=competitor_id)
        except SeasonCompetitorPosition.DoesNotExist:
            return HttpResponse(status=404)
        
    serializer = SeasonCompetitorPositionSerializer(competitor)

    return JsonResponse({
        "competitor": serializer.data,
    }, status=200)

def get_all_competitors(request):
    if request.method != "GET":
        return HttpResponse(status=405)
    
    try:
        competitors = CompetitorPosition.objects.all()
        serializer = CompetitorPositionSimpleSerializer(competitors, many=True)
    except Competitor.DoesNotExist:
        serializer = None
    
    if serializer == None:
        return HttpResponse(status=201)

    return JsonResponse({
        "competitors": serializer.data,
    }, status=200)
    
def get_season_competitors(request):
    if request.method != "GET":
        return HttpResponse(status=405)
    
    year = int(request.GET.get("season"))

    try:
        season = Season.objects.filter(visible=True).get(year=year)
    except Season.DoesNotExist:
        season = None

    if(season == None):
        return HttpResponse(status=404)
    
    try:
        competitors = season.competitors.order_by("-points")
        serializer = CompetitorPositionSimpleSerializer(competitors, many=True)
    except CompetitorPosition.DoesNotExist:
        serializer = None

    if serializer == None:
        return HttpResponse(status=201)

    return JsonResponse({
        "competitors": serializer.data
    }, status=200)

def create_season_competitors_link(request):
    if request.method != "POST" or not request.user.is_authenticated or not request.user.is_admin:
        return HttpResponse(status=405)
    
    #initializing variables
    data = json.loads(request.body)
    url = data.get("url")
    response = validate_season_competitors_data(data)
    season = response.pop("season")

    if response["invalidSeason"] or response["invalidLink"]:
        return JsonResponse(response, status=400)

    #process and generate competitor data
    table_data_response = generate_competitor_table_data(url, season)
    response["timeout"] = table_data_response["timeout"]

    if response["timeout"]:
        return JsonResponse(response, status=400)
    
    #serializer validation and creation of competitor positions
    serializer = SeasonCompetitorPositionWriteSerializer(data=table_data_response["data"], many=True)

    if not serializer.is_valid():
        print(serializer.errors)
        return JsonResponse(response, status=400)
    
    competitors = serializer.save()
    season.competitors.add(*competitors)

    return JsonResponse(response, status=201)

def create_competitor(request):
    if request.method != "POST" or not request.user.is_authenticated or not request.user.is_admin:
        return HttpResponse(status=405)
    
    data = json.loads(request.body)
    data = data.get("competitor_position")

    result = {
        "season_not_found": False,
        "rider_exists": False,
        "competitor_not_found": False,
        "points_not_valid": False,
        "competitor_points_not_found": False,
    }

    validated_competitor_data = validate_competitor_data(data)
    season = validated_competitor_data.pop("season")
    data["season"] = season.id
    result["season_not_found"] = validated_competitor_data.pop("season_not_found")
    result["rider_exists"] = validated_competitor_data.pop("rider_exists")

    if result["season_not_found"] or result["rider_exists"]:
        return JsonResponse(result, status=400)
            
    serializer = SeasonCompetitorPositionWriteSerializer(data=data)

    if not serializer.is_valid():
        print(serializer.errors)
        return JsonResponse(result, status=400)
    
    competitor_position = serializer.save()
    #save competitor position to season
    season.competitors.add(competitor_position)
    season.save()

    return JsonResponse(result, status=201)

def edit_season_competitor(request):
    if request.method != "POST" or not request.user.is_authenticated or not request.user.is_admin:
        return HttpResponse(status=405)
        
    data = json.loads(request.body)
    print(data)
    competitor_position_id = int(data.get("id", False))

    if not competitor_position_id:
        return HttpResponse(status=400)
    
    try:
        competitor_position = SeasonCompetitorPosition.objects.get(pk=competitor_position_id)
    except SeasonCompetitorPosition.DoesNotExist:
        return HttpResponse(status=404)
        
    if competitor_position.season.first().finalized:
        return HttpResponse(status=400)
        
    serializer = SeasonCompetitorPositionWriteSerializer(data=data, instance=competitor_position)
    
    if not serializer.is_valid():
        print(serializer.errors)
        return HttpResponse(status=400)
        
    competitor_position = serializer.save()

    return HttpResponse(status=200)


def delete_competitor(request):
    if request.method != "POST" or not request.user.is_authenticated or not request.user.is_admin:
        return HttpResponse(status=405)
    
    data = json.loads(request.body)
    competitor_id = int(data.get("competitor_id", False))
    season_id = int(data.get("season_id"))

    if not competitor_id:
        return HttpResponse(status=400)
    
    try:
        season_competitor = SeasonCompetitorPosition.objects.get(pk=competitor_id)
    except Competitor.DoesNotExist:
        return HttpResponse(status=404)
    
    try:
        season = Season.objects.get(pk=season_id)
    except Season.DoesNotExist:
        return HttpResponse(status=404)
    
    try:
        competitor = Competitor.objects.get(pk=season_competitor.competitor_points.competitor.id)
    except SeasonCompetitorPosition.DoesNotExist:
        return HttpResponse(status=404)
    
    competitor.delete()

    return HttpResponse(status=200)

def delete_all_competitors(request):
    if request.method != "POST" or not request.user.is_authenticated or not request.user.is_admin:
        return HttpResponse(status=405)
    
    data = json.loads(request.body)
    season_id = int(data.get("season_id", False))

    if not season_id:
        return HttpResponse(status=400)
    
    try:
        season = Season.objects.get(pk=season_id)
    except Season.DoesNotExist:
        return HttpResponse(status=404)
    
    season.competitors.all().delete()

    return HttpResponse(status=200)