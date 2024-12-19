'''
the competitor tie breaker is tried first, and it is not successful if neither users have better picks based on the current top 5.
if its not successful then the picks based tie breaker is run, where basically chooses the first user to have a pick with more points 
than the other users pick.
'''

from ...models import CurrentSeason

def sort_standings(season):

    standings = list(season.standings.users_picks.all())
    competitors = list(season.competitors.all().order_by("-competitor_points__points"))

    i = 0
    while i < len(standings):
        # tiebreaker
        if i != 0:
            prev_user_picks = standings[i - 1]
            if standings[i].points == prev_user_picks.points:
                temp = competitor_based_tie_breaker(standings[i], prev_user_picks, competitors)
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

def competitor_based_tie_breaker(user1, user2, competitors):
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
        
    if user1.independent_pick.competitor_points.competitor != user2.independent_pick.competitor_points.competitor:
        same_picks = False
    
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
