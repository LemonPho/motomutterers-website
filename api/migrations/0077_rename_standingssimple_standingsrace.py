# Generated by Django 5.1 on 2025-01-11 21:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0076_standingssimple_remove_race_new_standings_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='StandingsSimple',
            new_name='StandingsRace',
        ),
    ]
