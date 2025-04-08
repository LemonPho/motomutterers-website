from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.db import transaction

from ...serializers.standings_serializers import StandingsRaceSerializer

from ...models import CompetitorPosition

from ..picks_view.picks_util import update_members_points
from ..standings_view.standings_util import sort_standings, sort_race_standings

from ..utils_view import send_emails
from ...utils import binary_search

#should only be used with @transaction.atomic
def add_points_to_season_competitors(race_weekend, season):
    if season.finalized: return False

    race_competitors = sorted(list(race_weekend.race.competitors_positions.all()), key = lambda x:x.competitor_points.competitor.id)
    sprint_competitors = sorted(list(race_weekend.sprint_race.competitors_positions.all()), key = lambda x:x.competitor_points.competitor.id)
    season_competitors = sorted(list(season.competitors.all()), key = lambda x:x.competitor_points.competitor.id)

    updated_competitors = {}

    for race_competitor in race_competitors:
        season_competitor = binary_search(season_competitors, race_competitor.competitor_points.competitor.id, lambda x:x.competitor_points.competitor.id)
        if season_competitor is None: return False

        season_competitor.competitor_points.points += race_competitor.competitor_points.points
        updated_competitors[season_competitor.id] = season_competitor


    for sprint_competitor in sprint_competitors:
        season_competitor = binary_search(season_competitors, sprint_competitor.competitor_points.competitor.id, lambda x:x.competitor_points.competitor.id)
        if season_competitor is None: return False

        if season_competitor.id in updated_competitors:
            updated_competitors[season_competitor.id].competitor_points.points += sprint_competitor.competitor_points.points   
        else:
            season_competitor.competitor_points.points += sprint_competitor.competitor_points.points
            updated_competitors[season_competitor.id] = season_competitor
            
    for season_competitor in updated_competitors.values():
        season_competitor.competitor_points.save()

    update_members_points()

    return True

#should only be used with @transaction.atomic
def remove_points_from_season_competitors(season, race_weekend):
    if season.finalized: return False
    
    race_competitors = sorted(list(race_weekend.race.competitors_positions.all()), key = lambda x:x.competitor_points.competitor.id)
    sprint_competitors = sorted(list(race_weekend.sprint_race.competitors_positions.all()), key = lambda x:x.competitor_points.competitor.id)
    season_competitors = sorted(list(season.competitors.all()), key = lambda x:x.competitor_points.competitor.id)

    updated_competitors = {}

    for race_competitor in race_competitors:
        season_competitor = binary_search(season_competitors, race_competitor.competitor_points.competitor.id, lambda x:x.competitor_points.competitor.id)
        if season_competitor is None: return False

        season_competitor.competitor_points.points -= race_competitor.competitor_points.points
        updated_competitors[season_competitor.id] = season_competitor

    for sprint_competitor in sprint_competitors:
        season_competitor = binary_search(season_competitors, sprint_competitor.competitor_points.competitor.id, lambda x:x.competitor_points.competitor.id)
        if season_competitor is None: return False

        if season_competitor.id in updated_competitors:
            updated_competitors[season_competitor.id].competitor_points.points -= sprint_competitor.competitor_points.points   
        else:
            season_competitor.competitor_points.points -= sprint_competitor.competitor_points.points
            updated_competitors[season_competitor.id] = season_competitor

    for season_competitor in updated_competitors.values():
        season_competitor.competitor_points.save()

    update_members_points()
    sort_standings(season)

    return True

def send_finalize_emails(standings, race_weekend, request):
    EMAILS_SENT = 1
    EMAILS_FAILED_TO_SEND = 2
    STANDINGS_INVALID = 3
    if standings == None:
        return STANDINGS_INVALID

    domain = get_current_site(request).domain
    protocol = 'https' if request.is_secure() else 'http'

    users_picks = standings.users_picks.all().filter(user__race_weekends_emails = True)
    users = [pick.user for pick in users_picks]
    if protocol == "http": users = [request.user if request.user.race_weekends_emails else None] #to avoid accidently sending emails to real users

    standings = race_weekend.standings    
    standings_serializer = StandingsRaceSerializer(standings)
    serializer_data = standings_serializer.data.copy()
    serializer_data["users_picks"] = serializer_data["users_picks"][0:10]

    race_weekend_data = {
        "url": f"{protocol}://{domain}/race-weekends/{race_weekend.id}",
        "title": race_weekend.title,
    }

    context = {
        "standings": serializer_data,
        "race_weekend": race_weekend_data,
    }

    html_content_string = render_to_string("api/standings_email_template.html", context)
    subject = f"{race_weekend.title}'s race results have been posted"
    body = html_content_string

    send_emails(subject, body, users, "html")



