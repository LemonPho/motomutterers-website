from ...models import CompetitorPosition

from ..picks_view.picks_util import update_members_points
from ..standings_view.standings_util import sort_standings, sort_race_standings

def add_points_to_season_competitors(season, race_weekend):
    race_competitors_positions = race_weekend.race.competitors_positions.all()
    sprint_competitors_positions = race_weekend.sprint_race.competitors_positions.all()
    season_competitors = season.competitors.all()
    updated_competitors = {}

    for race_competitor_position in race_competitors_positions:
        try:
            season_competitor_position = season_competitors.get(competitor_points__competitor__id=race_competitor_position.competitor_points.competitor.id)
        except CompetitorPosition.DoesNotExist:
            return False

        season_competitor_position.competitor_points.points += race_competitor_position.competitor_points.points
        updated_competitors[season_competitor_position.id] = season_competitor_position


    for sprint_competitor_position in sprint_competitors_positions:
        try:
            season_competitor_position = season_competitors.get(competitor_points__competitor__id=sprint_competitor_position.competitor_points.competitor.id)
        except CompetitorPosition.DoesNotExist:
            return False

        if season_competitor_position.id in updated_competitors:
            updated_competitors[season_competitor_position.id].competitor_points.points += sprint_competitor_position.competitor_points.points   
        else:
            season_competitor_position.competitor_points.points += race_competitor_position.competitor_points.points
            updated_competitors[season_competitor_position.id] = season_competitor_position
            
    for season_competitor in updated_competitors.values():
        season_competitor.competitor_points.save()

    update_members_points()
    sort_standings(season)

    return True

def remove_points_from_season_competitors(season, race_weekend):
    race_competitors_positions = race_weekend.race.competitors_positions.all()
    sprint_competitors_positions = race_weekend.sprint_race.competitors_positions.all()
    season_competitors = season.competitors.all()
    updated_competitors = {}

    for race_competitor_position in race_competitors_positions:
        try:
            season_competitor_position = season_competitors.get(competitor_points__competitor__id=race_competitor_position.competitor_points.competitor.id)
        except CompetitorPosition.DoesNotExist:
            return False
        season_competitor_position.competitor_points.points -= race_competitor_position.competitor_points.points
        updated_competitors[season_competitor_position.id] = season_competitor_position

    for sprint_competitor_position in sprint_competitors_positions:
        try:
            season_competitor_position = season_competitors.get(competitor_points__competitor__id=sprint_competitor_position.competitor_points.competitor.id)
        except CompetitorPosition.DoesNotExist:
            return False

        if season_competitor_position.id in updated_competitors:
            updated_competitors[season_competitor_position.id].competitor_points.points -= sprint_competitor_position.competitor_points.points   
        else:
            season_competitor_position.competitor_points.points -= race_competitor_position.competitor_points.points
            updated_competitors[season_competitor_position.id] = season_competitor_position

    for season_competitor in updated_competitors.values():
        season_competitor.competitor_points.save()

    update_members_points()
    sort_standings(season)

    return True