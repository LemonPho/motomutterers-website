from rest_framework import serializers
from django.conf import settings
from django.contrib.auth import get_user_model

from .models import Announcement, AnnouncementComment, Race, RaceComment, Notification, Competitor, CompetitorPosition, CompetitorPoints, Season, UserPicks, CurrentSeason, SeasonCompetitorPosition

import base64
import re

ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "ico", "svg"]
USERS_PICKS_LENGTH = 5

#for sanitizing comments
def sanitize_html(text):
    cleaned_text = re.compile(r'<[^>]+>')
    cleaned_text = re.sub(cleaned_text, '\n', text)
    cleaned_text = re.sub(r'\n+', '\n', cleaned_text)
    cleaned_text = cleaned_text.strip()
    return cleaned_text

class UserSerializer(serializers.ModelSerializer):
    notifications = serializers.SerializerMethodField()
    profile_picture_data = serializers.SerializerMethodField()
    profile_picture_format = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()
    class Meta:
        model = get_user_model()
        fields = ["id", "username", "email", "date_created", "date_username_edited", "profile_picture_data", "profile_picture_format", "is_admin", "is_active", "notifications"]

    #get functions
    def get_is_admin(self, user):
        return user.is_admin
    
    def get_is_active(self, user):
        return user.is_active

    def get_profile_picture_data(self, user):
        if user.profile_picture:
            with open(user.profile_picture.path, 'rb') as profile_picture_file:
                profile_picture_data = base64.b64encode(profile_picture_file.read()).decode("utf-8")
                return profile_picture_data
        else:
            default_profile_picture_path = "media/profile_pictures/default.webp"
            with open(default_profile_picture_path, 'rb') as profile_picture_file:
                profile_picture_data = base64.b64encode(profile_picture_file.read()).decode("utf-8")
                return profile_picture_data
        
    def get_profile_picture_format(self, user):
        if user.profile_picture:
            return user.profile_picture.name.split('.')[-1].lower()
        else:
            return ".webp"
        
    def get_notifications(self, user):
        notifications = user.notifications.all()
        if notifications is None:
            return notifications
        serializer = NotificationSerializer(notifications, many=True)
        return serializer.data
    
    #validate functions
    def validate_profile_picture(self, value):
        if not value:
            raise serializers.ValidationError("No image found")
        file_extension = value.name.split('.')[-1].lower()
        if file_extension not in ALLOWED_EXTENSIONS:
            raise serializers.ValidationError("Extension not supported")
        
        return value

class AnnouncementSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    edited = serializers.BooleanField(read_only=True)
    date_created = serializers.DateTimeField(read_only=True)
    date_edited = serializers.DateTimeField(read_only=True)
    class Meta:
        model = Announcement
        fields = ["id", "title", "text", "user", "edited", "date_created", "date_edited"]        

    def validate_title(self, value):
        if not value:
            raise serializers.ValidationError("No title found")
        value = sanitize_html(value)
        return value
    
    def validate_text(self, value):
        if not value:
            raise serializers.ValidationError("No text found")
        value = sanitize_html(value)
        return value
    
    def create(self, validated_data):
        request = self.context.get('request')

        if not request.user.is_admin:
            raise serializers.ValidationError("User is not an admin")
        
        announcement = Announcement.objects.create(user=request.user, **validated_data)
        
        return announcement

class AnnouncementParentCommentSerializer(serializers.ModelSerializer):
    announcement = AnnouncementSerializer()
    user = UserSerializer()
    class Meta:
        model = AnnouncementComment
        fields = ["id", "text", "announcement", "user", "date_created", "edited"]

    def get_amount_replies(self, comment):
        amount_replies = comment.replies.count()
        amount_replies = str(amount_replies)
        return amount_replies

class AnnouncementCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    amount_replies = serializers.SerializerMethodField(read_only=True)
    replies = serializers.SerializerMethodField(read_only=True)
    announcement = AnnouncementSerializer(read_only=True)
    parent_comment = serializers.SerializerMethodField(read_only=True)
    date_created = serializers.DateTimeField(read_only=True)
    edited = serializers.BooleanField(read_only=True)

    #fields for creating
    announcementId = serializers.IntegerField(write_only=True, required=False)
    commentId = serializers.IntegerField(write_only=True, required=False) #sent if comment is a response to another comment
    class Meta:
        model = AnnouncementComment
        #fields for serializing
        fields = ["id", "text", "replies", "amount_replies", "announcement", "parent_comment", "user", "date_created", "edited"]
        #fields for creating
        fields += ["announcementId", "commentId"]

    def get_amount_replies(self, comment):
        amount_replies = comment.replies.count()
        amount_replies = str(amount_replies)
        return amount_replies
    
    def get_replies(self, comment):
        replies = comment.replies.all()
        replies = AnnouncementCommentSerializer(replies, many=True)
        return replies.data
    
    def get_parent_comment(self, comment):
        if comment.parent_comment == None:
            return None
        parent_comment = comment.parent_comment
        serializer = AnnouncementParentCommentSerializer(parent_comment)
        return serializer.data
    
    def validate_text(self, value):
        if not value:
            raise serializers.ValidationError("no text found")
        value = sanitize_html(value)
        return value
    
    def create(self, validated_data):
        request = self.context.get("request")

        if not request.user.is_authenticated:
            raise serializers.ValidationError("User is not logged in")
        
        try:
            announcement = Announcement.objects.get(pk=validated_data.get("announcementId"))
        except Announcement.DoesNotExist:
            raise serializers.ValidationError("Announcement not found")
        
        #check if comment is a reply or normal comment
        if validated_data.get("commentId"):
            try:
                parent_comment = AnnouncementComment.objects.get(pk=validated_data.get("commentId"))
            except AnnouncementComment.DoesNotExist:
                raise serializers.ValidationError("Parent comment not found")
            
            validated_data.pop("commentId")
            validated_data.pop("announcementId")

            announcement_comment = AnnouncementComment.objects.create(user=request.user, announcement=announcement, parent_comment=parent_comment, **validated_data)            
        else:
            validated_data.pop("announcementId")

            announcement_comment = AnnouncementComment.objects.create(user=request.user, announcement=announcement, **validated_data)

        return announcement_comment
    
    def update(self, instance, validated_data):
        instance.text = validated_data.get("text")
        instance.edited = True
        instance.save()

        return instance
    
class CompetitorSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = Competitor
        fields = ["id", "first", "last", "number"]

    def validate_number(self, value):
        if value < 1:
            raise serializers.ValidationError("Number invalid")
        return value
    
    def validate_first(self, value):
        value = sanitize_html(value)
        return value
    
    def validate_last(self, value):
        value = sanitize_html(value)
        return value
    
class CompetitorPointsSerializer(serializers.ModelSerializer):
    competitor = CompetitorSerializer(required=False)
    competitor_id = serializers.PrimaryKeyRelatedField(queryset=Competitor.objects.all(), required=False, write_only=True)

    class Meta:
        model = CompetitorPoints
        fields = ["id", "competitor", "competitor_id", "points"]

    def update(self, instance, validated_data):
        competitor_data = validated_data.get("competitor", False)

        if not competitor_data:
            raise serializers.ValidationError("Could not find data for competitor")
        
        if isinstance(instance.competitor, Competitor):
            competitor_serializer = CompetitorSerializer(instance=instance.competitor, data=competitor_data)
        else:
            competitor_serializer = CompetitorSerializer(data=competitor_data)

        if not competitor_serializer.is_valid():
            raise serializers.ValidationError("Competitor data was not valid for creating")
        instance.competitor = competitor_serializer.save()

        instance.points = validated_data.get("points", instance.points)
        instance.save()
        return instance
    
    def create(self, validated_data):
        competitor = validated_data.pop("competitor") if validated_data.get("competitor", False) else validated_data.pop("competitor_id")
        if not isinstance(competitor, Competitor):
            competitor_serializer = CompetitorSerializer(data=competitor)

            if not competitor_serializer.is_valid():
                raise serializers.ValidationError("Competitor data not valid")
            
            competitor = competitor_serializer.save()

        competitor_points_instance = CompetitorPoints.objects.create(competitor=competitor, **validated_data)
        competitor_points_instance.save()

        return competitor_points_instance

class CompetitorPositionSerializer(serializers.ModelSerializer):
    competitor_points = CompetitorPointsSerializer(required=False)
    competitor_points_id = serializers.PrimaryKeyRelatedField(queryset=CompetitorPoints.objects.all(), required=False, write_only=True)
    
    class Meta:
        model = CompetitorPosition
        fields = ["id", "competitor_points_id", "competitor_points", "position"]

    def update(self, instance, validated_data):
        competitor_points_data = validated_data.get("competitor_points", False)
        
        if not competitor_points_data:
            raise serializers.ValidationError("No competitor points data found")

        if isinstance(instance.competitor_points, CompetitorPoints):
            competitor_points_serializer = CompetitorPointsSerializer(data=competitor_points_data)
        else:
            competitor_points_serializer = CompetitorPointsSerializer(instance=instance.competitor_points, data=competitor_points_data)
        
        if not competitor_points_serializer.is_valid():
            raise serializers.ValidationError(competitor_points_serializer.errors)
        instance.competitor_points = competitor_points_serializer.save()

        instance.position = validated_data.get("position")
        instance.save()
        return instance
    
    def create(self, validated_data):
        competitor_points = validated_data.pop("competitor_points") if validated_data.get("competitor_points", False) else validated_data.pop("competitor_points_id")
        if not isinstance(competitor_points, CompetitorPoints):
            if isinstance(competitor_points["competitor_id"], Competitor):
                competitor_points["competitor_id"] = competitor_points["competitor_id"].id
            competitor_points_serializer = CompetitorPointsSerializer(data=competitor_points)
            if not competitor_points_serializer.is_valid():
                raise serializers.ValidationError(competitor_points_serializer.errors)
            
            competitor_points = competitor_points_serializer.save()
        competitor_position_instance = CompetitorPosition.objects.create(competitor_points=competitor_points, **validated_data)
        competitor_position_instance.save()

        return competitor_position_instance
    
class SeasonCompetitorPositionSerializer(serializers.ModelSerializer):
    competitor_points = CompetitorPointsSerializer(required=False)
    competitor_points_id = serializers.PrimaryKeyRelatedField(queryset=CompetitorPoints.objects.all(), required=False, write_only=True)
    season = serializers.PrimaryKeyRelatedField(queryset=Season.objects.all(), write_only=True, required=False)

    class Meta:
        model = SeasonCompetitorPosition
        fields = ["id", "competitor_points", "competitor_points_id", "independent", "rookie", "season"]

    def update(self, instance, validated_data):
        competitor_points_data = validated_data.get("competitor_points")
        
        if isinstance(instance.competitor_points, CompetitorPoints):
            competitor_points_serializer = CompetitorPointsSerializer(instance=instance.competitor_points, data=competitor_points_data)
        else:
            competitor_points_serializer = CompetitorPointsSerializer(data=competitor_points_data)

        if not competitor_points_serializer.is_valid():
            raise serializers.ValidationError("New competitor points data is not valid")
        instance.competitor_points = competitor_points_serializer.save()
        
        instance.independent = validated_data.get("independent", instance.independent)
        instance.rookie = validated_data.get("rookie", instance.rookie)
        instance.save()
        return instance
    
    def create(self, validated_data):
        competitor_points = validated_data.pop("competitor_points") if validated_data.get("competitor_points", False) else validated_data.pop("competitor_points_id")
        season = validated_data.pop("season")

        if not isinstance(competitor_points, CompetitorPoints):
            competitor_points_serializer = CompetitorPointsSerializer(data=competitor_points)
            if not competitor_points_serializer.is_valid():
                raise serializers.ValidationError("Competitor points data is not valid")
            
            competitor_points = competitor_points_serializer.save()

        season_competitor_position_instance = SeasonCompetitorPosition.objects.create(
            competitor_points=competitor_points,
            **validated_data
        )

        season.competitors.add(season_competitor_position_instance)

        return season_competitor_position_instance



class RaceSerializer(serializers.ModelSerializer):
    competitors_positions = serializers.SerializerMethodField()
    class Meta:
        model = Race
        fields = ["id", "title", "track", "timestamp", "is_sprint", "finalized", "competitors_positions"]

    def get_competitors_positions(self, race):
        if race.finalized:
            competitors_positions = race.competitors_positions.order_by("position")
            competitors_positions = list(competitors_positions)

            for competitor_position in competitors_positions:
                if competitor_position.position == 0 and len(competitors_positions) > 1:
                    temp_competitor = competitors_positions[0]
                    competitors_positions.pop(0)
                    competitors_positions.append(temp_competitor)
        else:
            competitors_positions = race.competitors_positions.all()

        
        serializer = CompetitorPositionSerializer(competitors_positions, many=True)
        return serializer.data
    
    def validate_track(self, value):
        value = sanitize_html(value)
        return value
    
    def validate_title(self, value):
        value = sanitize_html(value)
        return value

class RaceParentCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    race = RaceSerializer()

    class Meta:
        model = RaceComment
        fields = ["id", "text", "user", "race", "date_created"]

class RaceCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    race = RaceSerializer()
    parent_comment = serializers.SerializerMethodField()

    class Meta:
        model = RaceComment
        fields = ["id", "text", "user", "race", "parent_comment", "date_created"]

    def get_parent_comment(self, parent_comment):
        if parent_comment == None:
            return None
        
        serializer = RaceParentCommentSerializer(parent_comment)
        return serializer.data

class NotificationSerializer(serializers.ModelSerializer):
    #user = UserSerializer()
    origin_user = UserSerializer()

    class Meta:
        model = Notification
        fields = ["id", 'origin_user', 'text', 'path', 'date_created', 'read']

class SeasonSerializer(serializers.ModelSerializer):
    competitors = serializers.SerializerMethodField(read_only=True)
    races = serializers.SerializerMethodField(read_only=True)
    current = serializers.SerializerMethodField(read_only=True)
    visible = serializers.BooleanField(read_only=True)
    top_independent = serializers.BooleanField()
    top_rookie = serializers.BooleanField()
    finalized = serializers.BooleanField(read_only=True)
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Season
        fields = ["id", "year", "competitors", "races", "visible", "current", "top_independent" , "top_rookie", "finalized"]

    def get_races(self, season):
        races = season.races.all()
        races = RaceSerializer(races, many=True)
        return races.data
    
    def get_competitors(self, season):
        competitors = season.competitors.all()
        competitors = SeasonCompetitorPositionSerializer(competitors, many=True)
        return competitors.data
    
    def get_current(self, season):
        if hasattr(season, 'current_season'):
            return True
        else:
            return False
        
class UserPicksSerializer(serializers.ModelSerializer):
    picks = CompetitorPositionSerializer(many=True, required=False)
    independent_pick = CompetitorPositionSerializer(required=False)
    rookie_pick = CompetitorPositionSerializer(required=False)
    user = UserSerializer(read_only=True)
    season = SeasonSerializer(read_only=True)
    class Meta:
        model = UserPicks
        fields = ["picks", "independent_pick", "rookie_pick", "points", "user", "season"]
