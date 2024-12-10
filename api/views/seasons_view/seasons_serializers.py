from rest_framework import serializers

from ...models import Season

class SeasonSimpleYear():
    def __init__(self, year=None, id=None):
        self.year = year    
        self.id = id    

class SeasonSimple():
    def __init__(self, year=None, id=None, top_independent=None, top_rookie=None):
        self.year = year
        self.id = id
        self.top_independent = top_independent
        self.top_rookie = top_rookie

class SeasonSimpleSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    id = serializers.IntegerField()
    top_independent = serializers.BooleanField()
    top_rookie = serializers.BooleanField()

    class Meta:
        fields = ["year", "id", "top_independent", "top_rookie"]