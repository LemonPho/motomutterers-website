# Generated by Django 5.0 on 2024-05-28 20:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0044_remove_userpicksentry_competitor_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userpicks',
            name='independant_pick',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='independant_pick', to='api.userpicksentry'),
        ),
    ]
