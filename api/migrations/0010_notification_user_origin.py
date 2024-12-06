# Generated by Django 4.2.3 on 2023-09-03 19:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_remove_notification_announcement_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='user_origin',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
