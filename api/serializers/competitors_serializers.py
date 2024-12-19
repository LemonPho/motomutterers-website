from rest_framework import serializers

from ..models import CompetitorPosition, Competitor, CompetitorPoints
from .serializers_util import sanitize_html

class CompetitorPositionSimpleSerializer(serializers.ModelSerializer):
    first = serializers.SerializerMethodField()
    last = serializers.SerializerMethodField()
    number = serializers.SerializerMethodField()
    points = serializers.SerializerMethodField()
    competitor_id = serializers.SerializerMethodField()
    position = serializers.IntegerField()

    class Meta:
        model = CompetitorPosition
        fields = ["first", "last", "number", "points", "competitor_id", "position"]

    def get_first(self, competitor_position):
        return competitor_position.competitor_points.competitor.first
    
    def get_last(self, competitor_position):
        return competitor_position.competitor_points.competitor.last
    
    def get_number(self, competitor_position):
        return competitor_position.competitor_points.competitor.number
    
    def get_points(self, competitor_position):
        return competitor_position.competitor_points.points
    
    def get_competitor_id(self, competitor_position):
        return competitor_position.competitor_points.competitor.id
    
class CompetitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competitor
        fields = ["id", "first", "last", "number"]
    
class CompetitorPointsSerializer(serializers.ModelSerializer):
    competitor = CompetitorSerializer()
    class Meta:
        model = CompetitorPoints
        fields = ["id", "points", "competitor"]
    
class CompetitorPositionSerializer(serializers.ModelSerializer):
    competitor_points = CompetitorPointsSerializer()
    class Meta:
        model = CompetitorPosition
        fields = ["id", "position", "competitor_points"]
    
class CompetitorWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competitor
        fields = ["first", "last", "number"]

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
    
class CompetitorPointsWriteSerializer(serializers.ModelSerializer):
    competitor = serializers.JSONField()

    class Meta:
        model = CompetitorPoints
        fields = ["competitor", "points"]

    #read if competitor is an id of a competitor instance or if its data to create a new competitor
    def validate_competitor(self, competitor):
        #competitor is a competitor instance id
        if isinstance(competitor, int):
            try:
                instance = Competitor.objects.get(pk=competitor)
            except Competitor.DoesNotExist:
                raise serializers.ValidationError("Competitor not found")
            
            return instance
        #competitor is a dictionary, to then create the competitor
        elif isinstance(competitor, dict):
            serializer = CompetitorWriteSerializer(data=competitor)

            if not serializer.is_valid():
                raise serializers.ValidationError("Competitor data was not valid")
            
            instance = serializer.save()
            return instance
        
        raise serializers.ValidationError("Competitor was not an identifier or competitor dictionary")

    def update(self, instance, validated_data):
        competitor = validated_data.get("competitor", False)

        if not competitor:
            raise serializers.ValidationError("Could not find data for competitor")
        
        #validate_competitor() should have taken care of the data and created or retrieved the Competitor instance
        if not isinstance(competitor, Competitor):
            raise serializers.ValidationError("competitor was not a Competitor instance")

        instance.competitor = competitor
        instance.points = validated_data.get("points", instance.points)
        instance.save()
        return instance
    
    def create(self, validated_data):
        competitor = validated_data.pop("competitor")

        if not isinstance(competitor, Competitor):
            raise serializers.ValidationError("competitor was not a Competitor instances")

        competitor_points_instance = CompetitorPoints.objects.create(competitor=competitor, **validated_data)
        competitor_points_instance.save()

        return competitor_points_instance

class CompetitorPositionWriteSerializer(serializers.ModelSerializer):
    competitor_points = serializers.JSONField()
    position = serializers.IntegerField()
    
    class Meta:
        model = CompetitorPosition
        fields = ["competitor_points", "position"]

    def validate_position(self, position):
        if position < 0:
            raise serializers.ValidationError("position is less than 0")
        return position

    def validate_competitor_points(self, competitor_points):
        print(competitor_points)
        if isinstance(competitor_points, int):
            try:
                instance = CompetitorPoints.objects.get(pk=competitor_points)
            except CompetitorPoints.DoesNotExist:
                raise serializers.ValidationError("competitor points instance does not exist")
            
            return instance
        
        elif isinstance(competitor_points, dict):
            serializer = CompetitorPointsWriteSerializer(data=competitor_points)

            if not serializer.is_valid():
                raise serializers.ValidationError("competitor points data was not valid for creation")
            
            instance = serializer.save()
            return instance
        
        raise serializers.ValidationError("competitor points was not a valid type (dict or identifier)")

    def update(self, instance, validated_data):
        competitor_points = validated_data.pop("competitor_points", False)

        if not competitor_points:
            raise serializers.ValidationError("No competitor points instance found")

        if not isinstance(competitor_points, CompetitorPoints):
            raise serializers.ValidationError("competitor points should be a CompetitorPoints instance in update and create")
        
        instance.competitor_points = competitor_points
        instance.position = validated_data.get("position")
        instance.save()
        return instance
    
    def create(self, validated_data):
        competitor_points = validated_data.pop("competitor_points")

        if not isinstance(competitor_points, CompetitorPoints):
            raise serializers.ValidationError("competitor points should be a CompetitorPoints instance")

        competitor_position_instance = CompetitorPosition.objects.create(competitor_points=competitor_points, **validated_data)
        competitor_position_instance.save()

        return competitor_position_instance