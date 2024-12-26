from django.http import HttpResponse, JsonResponse

from ...models import Season, CurrentSeason
from ...serializers.seasons_serializers import SeasonCompetitorPositionSimpleSerializer, SeasonCompetitorPositionSerializer

from .seasons_util import get_competitors_sorted_number, finalize_members_points
from ...serializers.seasons_serializers import SeasonSimpleSerializer, SeasonSimpleYearSerializer, SeasonWriteSerializer, SeasonSerializer
from ..standings_view.standings_util import sort_standings

import json

def get_season(request):
    if request.method != "GET":
        return HttpResponse(status=405)
    
    season_year = request.GET.get("season", False)

    if not season_year:
        return HttpResponse(status=400)
    
    try:
        season = Season.objects.filter(visible=True).get(year=season_year)
    except Season.DoesNotExist:
        return HttpResponse(status=404)
    
    serializer = SeasonSerializer(season)

    return JsonResponse({
        "season": serializer.data,
    }, status=200)

def get_season_simple(request):
    if request.method != "GET":
        return HttpResponse(status=405)
    
    season_year = request.GET.get("season", -1)

    if season_year == -1:
        return HttpResponse(status=400)
    
    try:
        season = Season.objects.filter(visible=True).get(year=season_year)
    except Season.DoesNotExist:
        return HttpResponse(status=404)
    
    serializer = SeasonSimpleSerializer(season)

    return JsonResponse({"season": serializer.data}, status=200)

def get_seasons_simple(request):
    if request.method != "GET":
        return HttpResponse(status=405)

    try:
        seasons = Season.objects.filter(visible=True).order_by("-year")
    except Season.DoesNotExist:
        return HttpResponse(status=404)
            
    serializer = SeasonSimpleSerializer(seasons, many=True)
    return JsonResponse({
        "seasons": serializer.data,
    })

def get_seasons_simple_year(request):
    if request.method != "GET":
        return HttpResponse(status=405)
    
    seasons = Season.objects.filter(visible=True).order_by("-year")
    serializer = SeasonSimpleYearSerializer(seasons, many=True)

    return JsonResponse({"seasons": serializer.data}, status=200)

def get_current_season(request):
    if request.method != "GET":
        return HttpResponse(status=405)
    
    current_season = CurrentSeason.objects.first()

    if current_season == None or current_season.season == None:
        return HttpResponse(status=404)
    
    season_serializer = SeasonSimpleSerializer(current_season.season)
    competitors = get_competitors_sorted_number(current_season.season)
    competitors_serializer = SeasonCompetitorPositionSimpleSerializer(competitors, many=True)
    
    return JsonResponse({
        "current_season": season_serializer.data,
        "competitors_sorted_number": competitors_serializer.data,
    }, status=200)

def get_users_picks_state(request):
    if request.method != "GET":
        return HttpResponse(status=405)
    
    current_season = CurrentSeason.objects.first()
    if current_season == None or current_season.season == None:
        return JsonResponse({
            "users_picks_state": False,
        }, status=200)
    
    return JsonResponse({
        "users_picks_state": current_season.season.selection_open,
    }, status=200)

def delete_season(request):
    if request.method != "POST" or not request.user.is_authenticated or not request.user.is_admin:
        return HttpResponse(status=405)
    
    data = json.loads(request.body)
    season_id = data.get("seasonId", False)

    if not season_id:
        return HttpResponse(status=404)
    
    try:
        season = Season.objects.get(pk=season_id)
        season.visible = False
    except Season.DoesNotExist:
        return HttpResponse(status=404)
    
    current_season = CurrentSeason.objects.first()

    if current_season != None:
        if current_season.season == season:
            current_season.delete()
    
    season.save()

    return HttpResponse(status=200)

def create_season(request):
    if request.method != "POST" or not request.user.is_authenticated or not request.user.is_admin:
        return HttpResponse(status=405)
    
    data = json.loads(request.body)

    year = int(data.get("year", False))
    top_independent = bool(data.get("top_independent", -1))
    top_rookie = bool(data.get("top_rookie", -1))

    if not year or top_independent == -1 or top_rookie == -1:
        return HttpResponse(status=400)
    
    try:
        seasons = Season.objects.filter(visible=True).get(year=year)
    except Season.DoesNotExist:
        seasons = None

    if seasons is not None:
        return HttpResponse(status=400)
    
    data["standings"] = None
                
    serializer = SeasonWriteSerializer(data=data)

    if not serializer.is_valid():
        return HttpResponse(status=400)
    
    season = serializer.save()

    current_season = CurrentSeason.objects.first()

    current_season_list = list(CurrentSeason.objects.all())

    if len(current_season_list) == 0:
        current_season = CurrentSeason.objects.create(season=season)
        current_season.save()
        return HttpResponse(status=200)
    
    if len(current_season_list) == 1:
        current_season = CurrentSeason.objects.first()
        current_season.season = season
        current_season.save()
        return HttpResponse(status=200)


    return HttpResponse(status=200)

def set_current_season(request):
    if request.method != "PUT" or not request.user.is_authenticated or not request.user.is_admin:
        return HttpResponse(status=405)
    
    data = json.loads(request.body)
    year = int(data.get("year", False))

    if not year:
        return HttpResponse(status=400)
    
    try:
        season = Season.objects.filter(visible=True).get(year=year)
    except Season.DoesNotExist:
        season = None

    if season is None:
        return HttpResponse(status=400)
    
    current_season_list = list(CurrentSeason.objects.all())

    if len(current_season_list) == 0:
        current_season = CurrentSeason.objects.create(season=season)
        current_season.save()
        return HttpResponse(status=200)
    
    if len(current_season_list) == 1:
        current_season = CurrentSeason.objects.first()
        current_season.season = season
        current_season.save()
        return HttpResponse(status=200)
    
    if len(current_season_list) > 1:
        return HttpResponse(status=400)

    return HttpResponse(status=200)

def toggle_users_picks(request):
    current_season = CurrentSeason.objects.first()

    if request.method != "PUT" or not request.user.is_authenticated or not request.user.is_admin:
        return HttpResponse(status=405)
    
    if current_season == None or current_season.season == None or current_season.season.finalized:
        return HttpResponse(status=400)
    
    current_season = current_season.season
    
    seasons = Season.objects.all()
    if len(seasons) == 0:
        return HttpResponse(status=400)
    
    for temp_season in seasons:
        temp_season.selection_open = False
        temp_season.save()

    current_season.selection_open = not current_season.selection_open
    current_season.save()

    return HttpResponse(status=200)

def finalize_season(request):
    if request.method != "PUT" or not request.user.is_authenticated or not request.user.is_admin:
        return HttpResponse(status=405)
    
    data = json.loads(request.body)
    year = data.get("year")

    try:
        season = Season.objects.filter(visible=True).get(year=year)
    except Season.DoesNotExist:
        season = None

    if season == None or season.finalized:
        return HttpResponse(status=400)
    
    finalize_members_points(season)
    sort_standings(season)

    season.selection_open = False
    season.finalized = True
    season.save()

    return HttpResponse(status=200)
