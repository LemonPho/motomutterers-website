# Generated by Django 5.0 on 2024-03-23 19:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0032_user_points'),
    ]

    operations = [
        migrations.AddField(
            model_name='season',
            name='current',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='season',
            name='selection_open',
            field=models.BooleanField(default=False),
        ),
    ]
