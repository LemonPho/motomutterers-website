# Generated by Django 5.1.4 on 2024-12-08 04:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0064_season_top_independent_season_top_rookie_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='seasoncompetitorposition',
            name='rookie',
            field=models.BooleanField(default=False),
        ),
    ]
