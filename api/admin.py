from django.contrib import admin
from .models import User, UserPicks, UserPicksRace, Announcement, Race, Competitor, CompetitorPosition, CompetitorPoints, Season, CurrentSeason, Notification, SeasonCompetitorPosition, Standings, Comment, StandingsRace, SeleniumStatus

class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ["title", "user"]

class CommentAdmin(admin.ModelAdmin):
    list_display = ["id", "text", "user__username"]

class RaceAdmin(admin.ModelAdmin):
    list_display = ["title", "track", "timestamp", "finalized"]

class StandingsRaceAdmin(admin.ModelAdmin):
    list_display = ["id"]

class NotificationAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "date_created", "read"]

class CompetitorAdmin(admin.ModelAdmin):
    list_display = ["id", "first", "last", "number"]

class CompetitorPointsAdmin(admin.ModelAdmin):
    list_display = ["id", "competitor__number", "points"]

class CompetitorPositionAdmin(admin.ModelAdmin):
    list_display = ["id", "competitor_points__points", "competitor_points__competitor__number", "position"]

class SeasonCompetitorPositionAdmin(admin.ModelAdmin):
    list_display = ["id", "competitor_points__points", "competitor_points__competitor__number", "independent"]

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
    list_display = ["user__username", "points"]

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