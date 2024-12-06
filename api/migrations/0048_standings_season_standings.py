# Generated by Django 4.2.3 on 2024-07-13 21:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0047_alter_userpicks_season'),
    ]

    operations = [
        migrations.CreateModel(
            name='Standings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_picks', models.ManyToManyField(blank=True, related_name='standings', to='api.userpicks')),
            ],
        ),
        migrations.AddField(
            model_name='season',
            name='standings',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.standings'),
        ),
    ]
