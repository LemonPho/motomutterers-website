# Generated by Django 5.0 on 2024-01-05 16:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0025_remove_race_competitors_positions_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='race',
            name='is_sprint',
            field=models.BooleanField(default=False),
        ),
    ]
