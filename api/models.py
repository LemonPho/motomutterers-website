from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from .utils import generate_image_path, is_email_valid, is_username_valid
from .storage import OverwriteStorage

class UserManager(BaseUserManager):
    def create_user(self, username, email, password):
        print(f"username: {username}, email: {email}, password: {password}")
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
    points = models.PositiveIntegerField()
    position = models.PositiveIntegerField()
    position_change = models.IntegerField()

    class Meta:
        ordering = ["position"]

#managed in the standings view
class StandingsRace(models.Model):
    users_picks = models.ManyToManyField(UserPicksRace)
    
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
    title = models.CharField(max_length=128)
    track = models.CharField(max_length=64, blank=True)
    timestamp = models.DateField()
    is_sprint = models.BooleanField()
    finalized = models.BooleanField(default=False)
    qualifying_positions = models.ManyToManyField(CompetitorPosition, related_name="qualifying_race")
    competitors_positions = models.ManyToManyField(CompetitorPosition, related_name="final_race")
    standings = models.ForeignKey(StandingsRace, on_delete=models.SET_NULL, related_name="race_standings", null=True, blank=True)
    url = models.URLField(null=True, blank=True)
    comments = models.ManyToManyField("Comment", blank=True, related_name="race")

    class Meta:
        ordering = ["timestamp"]

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

class AnnouncementComment(models.Model):
    text = models.TextField(max_length=2048)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="announcements_comments")
    announcement = models.ForeignKey(Announcement, on_delete=models.CASCADE, null=True, blank=True, related_name="old_comments")
    parent_comment = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True, related_name="replies")
    notifications = models.ManyToManyField("Notification", blank=True, related_name="announcements_comments")
    date_created = models.DateTimeField(null=True, auto_now_add=True)
    edited = models.BooleanField(default=False)

    # for deleting the notifications associated to the comment
    def delete(self, *args, **kwargs):
        for notification in self.notifications.all():
            notification.delete()

        super().delete(*args, **kwargs)    

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    origin_user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length=4096)
    path = models.CharField(max_length=256)
    date_created = models.DateTimeField(null=True, auto_now_add=True)
    read = models.BooleanField(default=False)