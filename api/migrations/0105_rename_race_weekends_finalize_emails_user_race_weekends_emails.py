# Generated by Django 5.1.7 on 2025-03-23 05:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0104_user_race_weekends_finalize_emails'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='race_weekends_finalize_emails',
            new_name='race_weekends_emails',
        ),
    ]
