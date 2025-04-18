# Generated by Django 5.0 on 2024-03-26 18:12

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0035_currentseason_delete_selectedseason'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='selected_competitors',
        ),
        migrations.AlterField(
            model_name='announcement',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='anouncements', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='UserPicks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('picks', models.ManyToManyField(blank=True, related_name='picks', to='api.competitor')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='picks', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
