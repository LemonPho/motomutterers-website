# Generated by Django 5.1.4 on 2025-02-04 23:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0086_seleniumstatus_session_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='seleniumstatus',
            name='port',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
