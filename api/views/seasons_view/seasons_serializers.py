from rest_framework import serializers

from ...models import Season

class SeasonSimpleSerializer(serializers.ModelSerializer):
    year = serializers.IntegerField()
    id = serializers.IntegerField()
    top_independent = serializers.BooleanField()
    top_rookie = serializers.BooleanField()
    finalized = serializers.BooleanField()
    selection_open = serializers.BooleanField()

    class Meta:
        model = Season
        fields = ["year", "id", "top_independent", "top_rookie", "finalized", "selection_open"]

class SeasonSimpleYearSerializer(serializers.ModelSerializer):
    year = serializers.IntegerField()
    id = serializers.IntegerField()

    class Meta:
        model = Season
        fields = ["year", "id"]