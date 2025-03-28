# Generated by Django 5.1.4 on 2025-02-02 06:07

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0084_alter_comment_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='SeleniumStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.CharField(max_length=1024)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('pid', models.IntegerField()),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='selenium_working', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
