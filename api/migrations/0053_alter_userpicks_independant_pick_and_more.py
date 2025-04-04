# Generated by Django 4.2.11 on 2024-07-18 23:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0052_remove_competitor_points_alter_season_competitors'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userpicks',
            name='independant_pick',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='independant_pick', to='api.competitorposition'),
        ),
        migrations.AlterField(
            model_name='userpicks',
            name='picks',
            field=models.ManyToManyField(blank=True, related_name='picks', to='api.competitorposition'),
        ),
        migrations.DeleteModel(
            name='UserPicksEntry',
        ),
    ]
