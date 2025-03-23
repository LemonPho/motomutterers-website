from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from .utils import generate_image_path, is_email_valid, is_username_valid
from .storage import OverwriteStorage

class UserManager(BaseUserManager):
    def create_user(self, username, email, password):
        if not email:
            raise ValueError('User must have a valid email')
        
        if not username:
            raise ValueError("User must have a valid username")
        
        user = self.model(
            username = username,
            email = self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)

        return user
    
    def create_superuser(self, username, email, password):
        user = self.create_user(
            username,
            email,
            password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user
    
class Competitor(models.Model):
    first = models.CharField(max_length=64)
    last = models.CharField(max_length=64)
    number = models.PositiveIntegerField()

    class Meta:
        ordering = ["number"]

class CompetitorPoints(models.Model):
    competitor = models.ForeignKey(Competitor, on_delete=models.CASCADE, related_name="competitor_points", null=True, blank=True)
    points = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["points"]

class CompetitorPosition(models.Model):
    competitor_points = models.ForeignKey(CompetitorPoints, on_delete=models.CASCADE, related_name="competitor_position", null=True, blank=True)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position"]

class SeasonCompetitorPosition(models.Model):
    competitor_points = models.ForeignKey(CompetitorPoints, on_delete=models.CASCADE, related_name="season_competitor_position", null=True, blank=True)
    independent = models.BooleanField(default=False)
    rookie = models.BooleanField(default=False)

    class Meta:
        ordering = ["-competitor_points__points"]

class User(AbstractUser):
    is_admin = models.BooleanField(default=False)

    email = models.EmailField('email address', unique=True)
    date_created = models.DateTimeField(null=True, auto_now_add=True)
    date_username_edited = models.DateTimeField(null=True, blank=True)
    profile_picture = models.ImageField(null=True, blank=True, upload_to=generate_image_path, storage=OverwriteStorage)

    #Email notifications settings
    race_weekends_emails = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email']
    
    @property
    def since_changed_username(self):
        return (timezone.now() - self.date_username_edited).days

    def __str__(self):
        return f"{self.username}"
    
    def has_module_perms(self, app_label):
        return self.is_admin
    
    def has_perm(self, perm, obj=None):
        return self.is_admin
    
    @property
    def is_staff(self):
        return self.is_admin
    
#Managed in the user picks view
class UserPicksRace(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="simple_picks")
    points = models.FloatField()
    position = models.PositiveIntegerField()
    position_change = models.IntegerField()

    class Meta:
        ordering = ["position"]

#managed in the standings view
class StandingsRace(models.Model):
    users_picks = models.ManyToManyField(UserPicksRace)

    def delete(self, *args, **kwargs):
        # Delete all related UserPicksRace instances before deleting StandingsRace
        self.users_picks.all().delete()
        super().delete(*args, **kwargs)
    
class UserPicks(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="picks")
    picks = models.ManyToManyField(CompetitorPosition, related_name="picks", blank=True)
    independent_pick = models.ForeignKey(CompetitorPosition, on_delete=models.CASCADE, related_name="independent_pick", blank=True, null=True)
    rookie_pick = models.ForeignKey(CompetitorPosition, on_delete=models.CASCADE, related_name="rookie_pick", blank=True, null=True)
    points = models.FloatField(default=0)
    season = models.ForeignKey("Season", on_delete=models.CASCADE, related_name="picks", null=True, blank=True)
    position = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['-points']

class Standings(models.Model):
    users_picks = models.ManyToManyField(UserPicks)

    def delete(self, *args, **kwargs):
        # Delete all related UserPicksRace instances before deleting StandingsRace
        self.users_picks.all().delete()
        super().delete(*args, **kwargs)
    
class Announcement(models.Model):
    title = models.TextField(max_length=128)
    text = models.TextField(max_length=2048)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="anouncements")
    edited = models.BooleanField(default=False)
    date_created = models.DateTimeField(null=True, auto_now_add=True)
    date_edited = models.DateTimeField(null=True, blank=True)
    notifications = models.ManyToManyField("Notification", related_name="announcement", blank=True)
    comments = models.ManyToManyField("Comment", related_name="announcement", blank=True)

    # for deleting the notifications associated to the announcement
    def delete(self, *args, **kwargs):
        for notification in self.notifications.all():
            notification.delete()

        for comment in self.comments.all():
            comment.delete()

        super().delete(*args, **kwargs)

class Race(models.Model):
    track = models.CharField(max_length=64, null=True)
    competitors_positions = models.ManyToManyField(CompetitorPosition, related_name="final_race")
    notifications = models.ManyToManyField("Notification", related_name="race")

    def delete(self, *args, **kwargs):
        self.competitors_positions.all().delete()
        self.notifications.all().delete()

        super().delete(*args, **kwargs)

class RaceWeekend(models.Model):
    title = models.CharField(max_length=128)
    sprint_race = models.ForeignKey(Race, on_delete=models.SET_NULL, null=True, related_name="sprint_race_weekend")
    race = models.ForeignKey(Race, on_delete=models.SET_NULL, null=True, related_name="main_race_weekend")
    grid = models.ManyToManyField(CompetitorPosition)
    url = models.URLField(null=True, blank=True)
    comments = models.ManyToManyField("Comment", related_name="race_weekend", blank=True)
    standings = models.ForeignKey(StandingsRace, on_delete=models.SET_NULL, null=True, blank=True)
    notifications = models.ManyToManyField("Notification", related_name="race_weekend")
    start = models.DateField()
    end = models.DateField()
    status = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-start"]

    def delete(self, *args, **kwargs):
        self.comments.all().delete()
        self.notifications.all().delete()
        self.grid.all().delete()

        return super().delete(*args, **kwargs)

class Season(models.Model):
    year = models.IntegerField()
    competitors = models.ManyToManyField(SeasonCompetitorPosition, related_name="season")
    races = models.ManyToManyField(Race, related_name="season", blank=True)
    visible = models.BooleanField(default=True)
    selection_open = models.BooleanField(default=False)
    top_independent = models.BooleanField(default=True)
    top_rookie = models.BooleanField(default=True)
    finalized = models.BooleanField(default=False)
    standings = models.ForeignKey(Standings, on_delete=models.SET_NULL, null=True, blank=True)
    race_weekends = models.ManyToManyField(RaceWeekend, related_name="season")

    def delete(self, *args, **kwargs):
        for competitor in self.competitors.all():
            competitor.delete()

        for race in self.races.all():
            race.delete()

        self.competitors.all().delete()
        self.races.all().delete()
        self.race_weekends.all().delete()

        super().delete(*args, **kwargs)

class CurrentSeason(models.Model):
    season = models.OneToOneField(Season, on_delete=models.CASCADE, related_name="current")

    def save(self, *args, **kwargs):
        if CurrentSeason.objects.exists() and not self.pk:
            raise Exception("There can be only one current season instance")
        return super(CurrentSeason, self).save(*args, **kwargs)
    
class CommentManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(parent_comment=None)
    
class Comment(models.Model):
    text = models.TextField(max_length=2048)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    parent_comment = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True, related_name="replies")
    notifications = models.ManyToManyField("Notification", blank=True, related_name="comments")
    date_created = models.DateTimeField(null=True, auto_now_add=True)
    edited = models.BooleanField(default=False)

    objects = CommentManager

    class Meta:
        ordering = ["-date_created"]

    def delete(self, *args, **kwargs):
        for notification in self.notifications.all():
            notification.delete()

        super().delete(*args, **kwargs) 

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    origin_user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    text = models.CharField(max_length=4096)
    path = models.CharField(max_length=256)
    date_created = models.DateTimeField(null=True, auto_now_add=True)
    read = models.BooleanField(default=False)

class SeleniumStatus(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="selenium_working")
    message = models.CharField(max_length=1024)
    timestamp = models.DateTimeField(auto_now_add=True)
    pid = models.IntegerField()
    executor_url = models.URLField(max_length=255, null=True, blank=True)

class SeasonMessage(models.Model):
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name="messages", null=True)
    message = models.CharField(max_length=1024)
    type = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)