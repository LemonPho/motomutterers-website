# Generated by Django 5.1.4 on 2025-03-19 16:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0099_remove_race_timestamp_alter_race_track'),
    ]

    operations = [
        migrations.AddField(
            model_name='race',
            name='notifications',
            field=models.ManyToManyField(related_name='race', to='api.notification'),
        ),
    ]
