# Generated by Django 4.2.3 on 2023-09-03 19:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_alter_user_selected_competitors'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='announcement',
        ),
        migrations.RemoveField(
            model_name='notification',
            name='announcement_comment',
        ),
        migrations.RemoveField(
            model_name='notification',
            name='raceresult',
        ),
        migrations.RemoveField(
            model_name='notification',
            name='raceresult_comment',
        ),
        migrations.AddField(
            model_name='notification',
            name='link',
            field=models.CharField(default=None, max_length=256),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='notification',
            name='text',
            field=models.CharField(default=None, max_length=4096),
            preserve_default=False,
        ),
    ]
