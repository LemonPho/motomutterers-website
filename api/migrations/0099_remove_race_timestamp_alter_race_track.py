# Generated by Django 5.1.4 on 2025-03-19 16:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0098_rename_qualifying_positions_raceweekend_grid'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='race',
            name='timestamp',
        ),
        migrations.AlterField(
            model_name='race',
            name='track',
            field=models.CharField(max_length=64, null=True),
        ),
    ]
