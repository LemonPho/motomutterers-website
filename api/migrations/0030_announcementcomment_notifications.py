# Generated by Django 5.0 on 2024-01-07 19:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0029_announcement_notifications'),
    ]

    operations = [
        migrations.AddField(
            model_name='announcementcomment',
            name='notifications',
            field=models.ManyToManyField(blank=True, related_name='announcements_comments', to='api.notification'),
        ),
    ]
