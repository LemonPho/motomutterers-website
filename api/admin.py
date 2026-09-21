from django.contrib import admin
from .models import StandingsRace
from .models import User, UserPicks, UserPicksRace, Announcement, Race, Competitor, CompetitorPosition, CompetitorPoints, Season, CurrentSeason, Notification, SeasonCompetitorPosition, Standings, Comment, StandingsRace, SeleniumStatus, SeasonMessage, RaceWeekend

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ["username", "email", "is_admin", "last_login", "race_weekends_emails", "comment_response_emails"]

class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ["title", "user"]

class CommentAdmin(admin.ModelAdmin):
    list_display = ["id", "text", "username"]

    @admin.display(ordering="user__username", description="username")
    def username(self, obj):
        return obj.user.username

class RaceAdmin(admin.ModelAdmin):
    list_display = ["track"]

class StandingsRaceAdmin(admin.ModelAdmin):
    list_display = ["id"]

    def delete_model(self, request, obj):
        if obj.users_picks is not None:
            obj.users_picks.all().delete()
        super().delete_model(request, obj)

class NotificationAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "date_created", "read"]

class CompetitorAdmin(admin.ModelAdmin):
    list_display = ["id", "first", "last", "number"]

class CompetitorPointsAdmin(admin.ModelAdmin):
    list_display = ["id", "competitor_number", "points"]

    @admin.display(ordering="competitor__number", description="competitor number")
    def competitor_number(self, obj):
        return obj.competitor.number if obj.competitor else None

class CompetitorPointsMixin:
    @admin.display(ordering="competitor_points__points", description="points")
    def points(self, obj):
        return obj.competitor_points.points if obj.competitor_points else None

    @admin.display(ordering="competitor_points__competitor__number", description="competitor number")
    def competitor_number(self, obj):
        if obj.competitor_points and obj.competitor_points.competitor:
            return obj.competitor_points.competitor.number
        return None

class CompetitorPositionAdmin(CompetitorPointsMixin, admin.ModelAdmin):
    list_display = ["id", "points", "competitor_number", "position"]

class SeasonCompetitorPositionAdmin(CompetitorPointsMixin, admin.ModelAdmin):
    list_display = ["id", "points", "competitor_number", "independent"]

class SeasonAdmin(admin.ModelAdmin):
    list_display = ["id", "year"]

class CurrentSeasonAdmin(admin.ModelAdmin):
    list_display = ["season"]

class UserPicksAdmin(admin.ModelAdmin):
    list_display = ["id", "user"]

class StandingsAdmin(admin.ModelAdmin):
    list_display = ["id"]

class SeleniumStatusAdmin(admin.ModelAdmin):
    list_display = ["executor_url", "message", "id"]

class UserPicksRaceAdmin(admin.ModelAdmin):
    list_display = ["username", "points", "id"]

    @admin.display(ordering="user__username", description="username")
    def username(self, obj):
        return obj.user.username

class SeasonMessageAdmin(admin.ModelAdmin):
    list_display = ["message", "timestamp"]

class RaceWeekendAdmin(admin.ModelAdmin):
    list_display = ["title", "start", "end"]

# Register your models here.
admin.site.register(User)
admin.site.register(Announcement, AnnouncementAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Race, RaceAdmin)
admin.site.register(StandingsRace, StandingsRaceAdmin)
admin.site.register(Notification, NotificationAdmin)
admin.site.register(Competitor, CompetitorAdmin)
admin.site.register(CompetitorPoints, CompetitorPointsAdmin)
admin.site.register(CompetitorPosition, CompetitorPositionAdmin)
admin.site.register(SeasonCompetitorPosition, SeasonCompetitorPositionAdmin)
admin.site.register(Season, SeasonAdmin)
admin.site.register(CurrentSeason, CurrentSeasonAdmin)
admin.site.register(UserPicks, UserPicksAdmin)
admin.site.register(Standings, StandingsAdmin)
admin.site.register(SeleniumStatus, SeleniumStatusAdmin)
admin.site.register(UserPicksRace, UserPicksRaceAdmin)
admin.site.register(SeasonMessage, SeasonMessageAdmin)
admin.site.register(RaceWeekend, RaceWeekendAdmin)

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)