# Generated by Django 5.0 on 2023-12-26 18:19

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_season_visible'),
    ]

    operations = [
        migrations.CreateModel(
            name='Race',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('track', models.CharField(max_length=64)),
                ('timestamp', models.DateField()),
            ],
        ),
        migrations.RemoveField(
            model_name='raceresult',
            name='timestamp',
        ),
        migrations.RemoveField(
            model_name='raceresult',
            name='track',
        ),
        migrations.AddField(
            model_name='raceresult',
            name='race',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='race_results', to='api.race'),
        ),
    ]
