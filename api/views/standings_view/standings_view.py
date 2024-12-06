from django.http import HttpResponse, JsonResponse
from django.contrib.auth import get_user_model

from ...models import Season, UserPicks
from ...serializers import UserPicksSerializer
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
        
    picks = season.picks.order_by("position")
    serializer = UserPicksSerializer(picks, many=True)

    if picks.count() == 0:
        return JsonResponse({
            "users": False,
        }, status=200)
        
    return JsonResponse({
        "users": serializer.data,
    }, status=200)