from ...models import CompetitorPosition

from ..picks_view.picks_util import update_members_points
from ..standings_view.standings_util import sort_standings, sort_race_standings

def add_points_to_season_competitors(season, race_weekend):
    race_competitors_positions = race_weekend.race.competitors_positions.all()
    sprint_competitors_positions = race_weekend.sprint_race.competitors_positions.all()
    for race_competitor_position in race_competitors_positions:
        try:
            season_competitor_position = season.competitors.get(competitor_points__competitor__id=race_competitor_position.competitor_points.competitor.id)
        except CompetitorPosition.DoesNotExist:
            return False
        season_competitor_position.competitor_points.points += race_competitor_position.competitor_points.points
        season_competitor_position.competitor_points.save()

    for sprint_competitor_position in sprint_competitors_positions:
        try:
            season_competitor_position = season.competitors.get(competitor_points__competitor__id=sprint_competitor_position.competitor_points.competitor.id)
        except CompetitorPosition.DoesNotExist:
            return False
        season_competitor_position.competitor_points.points += sprint_competitor_position.competitor_points.points
        season_competitor_position.competitor_points.save()

    update_members_points()
    sort_standings(season)

    return True