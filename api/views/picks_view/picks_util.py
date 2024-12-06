from ...models import UserPicks, CurrentSeason

def update_members_points():
    current_season = CurrentSeason.objects.first()

    if current_season.season.finalized:
        return

    users_picks = current_season.season.picks.all()

    for user_picks in users_picks:
        points = 0
        for pick in user_picks.picks.all():
            points += pick.competitor_points.points

        points += user_picks.independent_pick.competitor_points.points
        user_picks.points = points
        user_picks.save()