from django.http import HttpResponse, JsonResponse
from django.contrib.auth import get_user_model

from ...models import Season, UserPicks
from .standings_serializers import StandingsSimpleSerializer
from ..picks_view.picks_serializers import UserPicksSimpleSerializer, UserPicksSerializer
from .standings_util import points_based_tie_breaker, competitor_based_tie_breaker, sort_standings
from ..picks_view.picks_util import update_members_points

def get_standings(request):
    if request.method != 'GET':
        return HttpResponse(status=405)
    
    season_year = request.GET.get("season", 0)

    if not season_year:
        return HttpResponse(status=400)
    
    try:
        season = Season.objects.filter(visible=True).get(year=season_year)
    except Season.DoesNotExist:
        return HttpResponse(status=404)
        
    standings = season.standings
    serializer = StandingsSimpleSerializer(standings)

    if standings == None:
        return JsonResponse({
            "standings": False,
        }, status=200)
        
    return JsonResponse({
        "standings": serializer.data,
    }, status=200)

def get_standing(request):
    if request.method != "GET":
        return HttpResponse(status=405)
    
    season_year = request.GET.get("season")
    uid = request.GET.get("uid")
    User = get_user_model()

    try:
        season = Season.objects.filter(visible=True).get(year=season_year)
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
