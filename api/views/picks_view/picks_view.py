from django.http import HttpResponse, JsonResponse
from django.contrib.auth import get_user_model

import json

from ...models import UserPicks, CurrentSeason, Competitor, Season
from ...serializers.picks_serializers import UserPicksSerializer, UserPicksWriteSerializer, UserPicksSimpleSerializer
from .picks_util import update_members_points
from .picks_validators import generate_validate_user_picks_data
from ..standings_view.standings_util import sort_standings

def get_user_picks(request):
    if request.method != "GET":
        return HttpResponse(status=405)
    
    season_id = request.GET.get("season")
    uid = request.GET.get("uid")
    User = get_user_model()

    try:
        season = Season.objects.filter(visible=True).get(pk=season_id)
    except Season.DoesNotExist:
        return HttpResponse(status=404)
    
    try:
        user = User.objects.get(pk=uid)
    except User.DoesNotExist:
        return HttpResponse(status=404)
    
    try:
        user_picks = UserPicks.objects.filter(season=season).get(user=user)
    except UserPicks.DoesNotExist:
        return HttpResponse(status=404)
        
    serializer = UserPicksSerializer(user_picks)

    context = {
        "user_picks": serializer.data,
    }

    return JsonResponse(context, status=200)

def get_user_picks_simple(request):
    if request.method != "GET":
        return HttpResponse(status=405)
    
    season_id = request.GET.get("season")
    uid = request.GET.get("uid")
    User = get_user_model()

    try:
        season = Season.objects.filter(visible=True).get(pk=season_id)
    except Season.DoesNotExist:
        return HttpResponse(status=404)
    
    try:
        user = User.objects.get(pk=uid)
    except User.DoesNotExist:
        return HttpResponse(status=404)
    
    try:
        user_picks = UserPicks.objects.filter(season=season).get(user=user)
    except UserPicks.DoesNotExist:
        return HttpResponse(status=404)
    
    serializer = UserPicksSimpleSerializer(user_picks)

    context = {
        "user_picks": serializer.data,
    }

    return JsonResponse(context, status=200)

def set_user_picks(request):
    current_season = CurrentSeason.objects.first()

    if request.method != "POST" or not request.user.is_authenticated or not current_season.season.selection_open or current_season is None or current_season.season.finalized:
        print(current_season.season.selection_open)
        return HttpResponse(status=400)
    
    user_has_picks = True

    try:
        user_picks = current_season.season.standings.users_picks.get(user=request.user)
    except UserPicks.DoesNotExist:
        user_has_picks = False

    data = json.loads(request.body)

    #generate and validate the user picks data dictionary
    response = generate_validate_user_picks_data(data, request, user_has_picks)

    #check for problems in picks
    if any(response["invalid_picks"]) or response["invalid_independent"] or response["picks_already_selected"] or response["invalid_season"] or response["cant_select_picks"]:
        response.pop("new_data")
        print(response)
        return JsonResponse(response, status=400)
        
    #validate with serializer
    serializer = UserPicksWriteSerializer(data=response["new_data"])

    if not serializer.is_valid():
        print(serializer.errors)
        response.pop("new_data")
        return JsonResponse(response, status=400)
    
    #save
    new_user_picks = serializer.save()
    current_season.season.standings.users_picks.add(new_user_picks)
    if user_has_picks:
        user_picks.delete()
    update_members_points()
    sort_standings(current_season.season)

    return HttpResponse(status=201)