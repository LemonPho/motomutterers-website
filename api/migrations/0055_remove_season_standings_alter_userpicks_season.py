# Generated by Django 4.2.11 on 2024-07-23 16:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0054_remove_competitor_independant_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='season',
            name='standings',
        ),
        migrations.AlterField(
            model_name='userpicks',
            name='season',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='standings', to='api.season'),
        ),
    ]
