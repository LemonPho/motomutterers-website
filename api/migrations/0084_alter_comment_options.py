# Generated by Django 5.1.4 on 2025-02-01 22:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0083_rename_new_comments_announcement_comments_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='comment',
            options={'ordering': ['-date_created']},
        ),
    ]
