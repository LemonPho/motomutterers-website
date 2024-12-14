def get_competitors_sorted_number(season):
    return season.competitors.order_by("competitor_points__competitor__number")

def finalize_members_points(season):
    user_picks = list(season.picks.all())
    competitors = list(season.competitors.all())

    additional_points = [0.1, 0.07, 0.05, 0.0325, 0.02]

    for i in range(0, len(user_picks)):
        picks = list(user_picks[i].picks.all())
        for j in range(0, 5):
            if picks[j].competitor_points.competitor == competitors[j].competitor_points.competitor:
                print(picks[j].competitor_points.points * additional_points[j])
                user_picks[i].points += picks[j].competitor_points.points * additional_points[j]
                user_picks[i].save()