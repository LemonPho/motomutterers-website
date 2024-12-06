from ...models import CompetitorPosition

def add_points_to_season_competitors(season, race):
    race_competitors_positions = race.competitors_positions.all()
    for race_competitor_position in race_competitors_positions:
        try:
            season_competitor_position = season.competitors.get(competitor_points__competitor__id=race_competitor_position.competitor_points.competitor.id)
        except CompetitorPosition.DoesNotExist:
            return False
        season_competitor_position.competitor_points.points += race_competitor_position.competitor_points.points
        season_competitor_position.competitor_points.save()

    return True