# Generated by Django 5.0 on 2024-03-28 22:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0038_alter_userpicks_picks'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='points',
        ),
        migrations.AddField(
            model_name='userpicks',
            name='points',
            field=models.IntegerField(default=0),
        ),
    ]
