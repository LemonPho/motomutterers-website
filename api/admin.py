from django.contrib import admin
from .models import User, UserPicks, Announcement, AnnouncementComment, Race, RaceComment, Competitor, CompetitorPosition, CompetitorPoints, Season, CurrentSeason, Notification, SeasonCompetitorPosition

class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ["title", "user"]

class AnnouncementCommentAdmin(admin.ModelAdmin):
    list_display = ["text", "user", "announcement"]

class RaceAdmin(admin.ModelAdmin):
    list_display = ["title", "track", "timestamp", "finalized"]

class RaceCommentAdmin(admin.ModelAdmin):
    list_display = ["text", "user", "race"]

class NotificationAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "date_created", "read"]

class CompetitorAdmin(admin.ModelAdmin):
    list_display = ["id", "first", "last", "number"]

class CompetitorPointsAdmin(admin.ModelAdmin):
    list_display = ["id", "competitor", "points"]

class CompetitorPositionAdmin(admin.ModelAdmin):
    list_display = ["id", "competitor_points", "position"]

class SeasonCompetitorPositionAdmin(admin.ModelAdmin):
    list_display = ["id", "competitor_points", "independent"]

class SeasonAdmin(admin.ModelAdmin):
    list_display = ["id", "year"]

class CurrentSeasonAdmin(admin.ModelAdmin):
    list_display = ["season"]

class UserPicksAdmin(admin.ModelAdmin):
    list_display = ["user"]

# Register your models here.
admin.site.register(User)
admin.site.register(Announcement, AnnouncementAdmin)
admin.site.register(AnnouncementComment, AnnouncementCommentAdmin)
admin.site.register(Race, RaceAdmin)
admin.site.register(RaceComment, RaceCommentAdmin)
admin.site.register(Notification, NotificationAdmin)
admin.site.register(Competitor, CompetitorAdmin)
admin.site.register(CompetitorPoints, CompetitorPointsAdmin)
admin.site.register(CompetitorPosition, CompetitorPositionAdmin)
admin.site.register(SeasonCompetitorPosition, SeasonCompetitorPositionAdmin)
admin.site.register(Season, SeasonAdmin)
admin.site.register(CurrentSeason, CurrentSeasonAdmin)
admin.site.register(UserPicks, UserPicksAdmin)