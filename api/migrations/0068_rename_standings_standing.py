# Generated by Django 5.1.4 on 2024-12-14 00:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0067_alter_userpicks_options_alter_userpicks_season_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Standings',
            new_name='Standing',
        ),
    ]
