'''
the competitor tie breaker is tried first, and it is not successful if neither users have better picks based on the current top 5.
if its not successful then the picks based tie breaker is run, where basically chooses the first user to have a pick with more points 
than the other users pick.
'''

from ...models import CurrentSeason, UserPicks, UserPicksRace, SeasonMessage

#should only be used with @transaction.atomic
def sort_race_standings(standings, season):
    prev_positions = {}
    post_positions = {}
    race_standings = standings.users_picks.all()
    season_standings = list(season.standings.users_picks.all().order_by("-points"))
    competitors = list(season.competitors.all().order_by("-competitor_points__points"))

    #filling in previous positions
    for season_standing in season_standings:
        prev_positions[season_standing.user.id] = season_standing.position

    i = 1
    while i < len(season_standings):
        if i != 0:
            prev_user_picks = season_standings[i - 1]
            # tiebreaker
            if season_standings[i].points == prev_user_picks.points:
                temp = competitor_based_tie_breaker(season_standings[i], prev_user_picks, competitors, season)
                if temp is True:
                    print(f"{prev_user_picks.user.username} and {season_standings[i].user.username} have the same picks!")
                elif temp:
                    # Swap positions if the tie-breaker determines a change
                    if temp == season_standings[i]:
                        season_standings[i], season_standings[i - 1] = season_standings[i - 1], season_standings[i]
                        i = max(i - 2, 0)
                else:
                    temp = points_based_tie_breaker(season_standings[i], prev_user_picks)
                    if temp:
                        if temp == season_standings[i]:
                            season_standings[i], season_standings[i - 1] = season_standings[i - 1], season_standings[i]
                            i = max(i - 2, 0)
            
        i += 1

    users_not_found = []

    for i, season_standing in enumerate(season_standings):
        season_standing.position = i + 1
        season_standing.save()
        post_positions[season_standing.user.id] = season_standing.position #filling in post_positions at the same time
        try:
            race_standing = race_standings.get(user__id=season_standing.user.id)
        except UserPicksRace.DoesNotExist:
            race_standing = None
            users_not_found.append(season_standing.user.username)
        if race_standing:
            race_standing.position = season_standing.position
            race_standing.position_change = prev_positions[race_standing.user.id] - post_positions[race_standing.user.id]
            race_standing.save()

    if len(users_not_found) > 0:
        SeasonMessage.objects.create(
            season=season,
            message=f"When calculating the position changes in the race standings, these users were not found in the race standings: " + " ".join(users_not_found) + ". Please un-finalize then finalize again, if it keeps happening contact spongejunior.",
            type=0,
        )

#should only be used with @transaction.atomic
def sort_standings(season):

    standings = list(season.standings.users_picks.all().order_by("-points"))
    competitors = list(season.competitors.all().order_by("-competitor_points__points"))

    i = 1
    while i < len(standings):
        # tiebreaker
        if i != 0:
            prev_user_picks = standings[i - 1]
            if standings[i].points == prev_user_picks.points:
                temp = competitor_based_tie_breaker(standings[i], prev_user_picks, competitors, season)
                if temp is True:
                    print(f"{prev_user_picks.user.username} and {standings[i].user.username} have the same picks!")
                elif temp:
                    # Swap positions if the tie-breaker determines a change
                    if temp == standings[i]:
                        standings[i], standings[i - 1] = standings[i - 1], standings[i]
                        i = max(i - 2, 0)
                else:
                    temp = points_based_tie_breaker(standings[i], prev_user_picks)
                    if temp:
                        if temp == standings[i]:
                            standings[i], standings[i - 1] = standings[i - 1], standings[i]
                            i = max(i - 2, 0)
        i += 1

    for i, standing in enumerate(standings):
        standing.position = i + 1
        standing.save()

def competitor_based_tie_breaker(user1, user2, competitors, season):
    same_picks = True
    user_1_picks = list(user1.picks.all().order_by("position"))
    user_2_picks = list(user2.picks.all().order_by("position"))

    for i in range(5):
        if user_1_picks[i].competitor_points.competitor != user_2_picks[i].competitor_points.competitor:
            same_picks=False

        if user_1_picks[i].competitor_points.competitor == competitors[i].competitor_points.competitor and user_2_picks[i].competitor_points.competitor != competitors[i].competitor_points.competitor:
            return user1
        
        if user_1_picks[i].competitor_points.competitor != competitors[i].competitor_points.competitor and user_2_picks[i].competitor_points.competitor == competitors[i].competitor_points.competitor:
            return user2
        
    if season.top_independent and (user1.independent_pick.competitor_points.points > user2.independent_pick.competitor_points.points):
        return user1
    elif season.top_independent and (user1.independent_pick.competitor_points.points < user2.independent_pick.competitor_points.points):
        return user2
    
    if season.top_rookie and (user1.rookie_pick.competitor_points.points > user2.rookie_pick.competitor_points.points):
        return user1
    elif season.top_rookie and (user1.rookie_pick.competitor_points.points < user2.rookie_pick.competitor_points.points):
        return user2

    return same_picks

def points_based_tie_breaker(user1, user2):
    user_1_picks = list(user1.picks.all().order_by("position"))
    user_2_picks = list(user2.picks.all().order_by("position"))
    for i in range(5):
        if user_1_picks[i].competitor_points.points > user_2_picks[i].competitor_points.points:
            return user1
        elif user_1_picks[i].competitor_points.points < user_2_picks[i].competitor_points.points:
            return user2
        
    return True
