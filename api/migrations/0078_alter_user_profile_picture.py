# Generated by Django 5.1 on 2025-01-12 00:07

import api.storage
import api.utils
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0077_rename_standingssimple_standingsrace'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profile_picture',
            field=models.ImageField(blank=True, default='profile_pictures/default.webp', null=True, storage=api.storage.OverwriteStorage, upload_to=api.utils.generate_image_path),
        ),
    ]
