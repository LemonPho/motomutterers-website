# Generated by Django 5.0 on 2024-01-02 19:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0022_alter_raceresult_competitors_positions_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='season',
            name='races',
            field=models.ManyToManyField(blank=True, related_name='races', to='api.race'),
        ),
    ]
