from rest_framework import serializers

from ...models import Season

class SeasonSimpleYear():
    def __init__(self, year=None, id=None):
        self.year = year    
        self.id = id    

class SeasonSimple():
    def __init__(self, year=None, id=None, top_independent=None, top_rookie=None, finalized=None, selection_open=None):
        self.year = year
        self.id = id
        self.top_independent = top_independent
        self.top_rookie = top_rookie
        self.finalized = finalized
        self.selection_open = selection_open

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