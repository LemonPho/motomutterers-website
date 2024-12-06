# Generated by Django 5.0 on 2024-01-05 19:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0026_race_is_sprint'),
    ]

    operations = [
        migrations.AlterField(
            model_name='competitor',
            name='number',
            field=models.PositiveIntegerField(),
        ),
        migrations.AlterField(
            model_name='competitor',
            name='points',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='competitorposition',
            name='position',
            field=models.PositiveIntegerField(),
        ),
        migrations.AlterField(
            model_name='race',
            name='is_sprint',
            field=models.BooleanField(),
        ),
    ]
