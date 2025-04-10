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
    users_picks = list(season.standings.users_picks.all().order_by("-points"))
    competitors = list(season.competitors.all().order_by("-competitor_points__points"))

    #filling in previous positions
    for user_picks in users_picks:
        prev_positions[user_picks.user.id] = user_picks.position

    i = 1
    while i < len(users_picks):
        if i != 0:
            prev_user_picks = users_picks[i - 1]
            # tiebreaker
            if users_picks[i].points == prev_user_picks.points:
                temp = competitor_based_tie_breaker(users_picks[i], prev_user_picks, competitors, season)
                if temp is True:
                    print(f"{prev_user_picks.user.username} and {users_picks[i].user.username} have the same picks!")
                elif temp:
                    # Swap positions if the tie-breaker determines a change
                    if temp == users_picks[i]:
                        users_picks[i], users_picks[i - 1] = users_picks[i - 1], users_picks[i]
                        i = max(i - 2, 0)
                else:
                    temp = points_based_tie_breaker(users_picks[i], prev_user_picks)
                    if temp:
                        if temp == users_picks[i]:
                            users_picks[i], users_picks[i - 1] = users_picks[i - 1], users_picks[i]
                            i = max(i - 2, 0)
            
        i += 1

    users_not_found = []

    for i, user_picks in enumerate(users_picks):
        user_picks.position = i + 1
        user_picks.save()
        post_positions[user_picks.user.id] = user_picks.position #filling in post_positions at the same time
        try:
            race_user_picks = race_standings.get(user__id=user_picks.user.id)
        except UserPicksRace.DoesNotExist:
            race_user_picks = None
            users_not_found.append(user_picks.user.username)
        if race_user_picks:
            race_user_picks.position = user_picks.position
            race_user_picks.position_change = prev_positions[race_user_picks.user.id] - post_positions[race_user_picks.user.id]
            race_user_picks.save()

    if len(users_not_found) > 0:
        SeasonMessage.objects.create(
            season=season,
            message=f"When calculating the position changes in the race standings, these users were not found in the race standings: " + " ".join(users_not_found) + ". Please un-finalize then finalize again, if it keeps happening contact spongejunior.",
            type=0,
        )

    return users_not_found

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

        #if user1 has the pick in the correct position, in relation to the season competitors ordered by points, then they are put ahead
        #if user1 and user2 both have the pick in the correct position or both dont have the it goes to the next pick in list
        if user_1_picks[i].competitor_points.competitor == competitors[i].competitor_points.competitor and user_2_picks[i].competitor_points.competitor != competitors[i].competitor_points.competitor:
            return user1
        
        if user_1_picks[i].competitor_points.competitor != competitors[i].competitor_points.competitor and user_2_picks[i].competitor_points.competitor == competitors[i].competitor_points.competitor:
            return user2
    
    #in this case both either have the perfect picks (same top 5 as the season) or both dont have any correct picks in the top 5, so we check to see which has the independent or rookie with more points
    if season.top_independent and (user1.independent_pick.competitor_points.points > user2.independent_pick.competitor_points.points):
        return user1
    elif season.top_independent and (user1.independent_pick.competitor_points.points < user2.independent_pick.competitor_points.points):
        return user2
    
    if season.top_rookie and (user1.rookie_pick.competitor_points.points > user2.rookie_pick.competitor_points.points):
        return user1
    elif season.top_rookie and (user1.rookie_pick.competitor_points.points < user2.rookie_pick.competitor_points.points):
        return user2

    #if we have reached here, then they have the same picks or they have different picks but the same independent and rookie
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
