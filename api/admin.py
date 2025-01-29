from django.contrib import admin
from .models import User, UserPicks, Announcement, Race, Competitor, CompetitorPosition, CompetitorPoints, Season, CurrentSeason, Notification, SeasonCompetitorPosition, Standings, Comment, StandingsRace

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