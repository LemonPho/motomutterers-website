# Generated by Django 5.0 on 2024-03-23 17:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0030_announcementcomment_notifications'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='race',
            options={'ordering': ['timestamp']},
        ),
    ]
