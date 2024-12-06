# Generated by Django 5.0 on 2024-01-02 18:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_alter_season_competitors'),
    ]

    operations = [
        migrations.AlterField(
            model_name='raceresult',
            name='competitors_positions',
            field=models.ManyToManyField(related_name='race_results', to='api.competitor'),
        ),
        migrations.AlterField(
            model_name='season',
            name='race_results',
            field=models.ManyToManyField(blank=True, related_name='season', to='api.raceresult'),
        ),
        migrations.AlterField(
            model_name='season',
            name='races',
            field=models.ManyToManyField(blank=True, related_name='season', to='api.race'),
        ),
        migrations.AlterField(
            model_name='user',
            name='selected_competitors',
            field=models.ManyToManyField(blank=True, related_name='user', to='api.competitor'),
        ),
    ]
