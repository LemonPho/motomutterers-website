# Generated by Django 5.1.4 on 2024-12-14 18:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0072_alter_currentseason_season'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='userpicks',
            options={'ordering': ['-points']},
        ),
    ]
