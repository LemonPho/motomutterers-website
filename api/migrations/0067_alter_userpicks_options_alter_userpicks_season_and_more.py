# Generated by Django 5.1.4 on 2024-12-14 00:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0066_userpicks_position_change'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='userpicks',
            options={'ordering': ['position']},
        ),
        migrations.AlterField(
            model_name='userpicks',
            name='season',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='picks', to='api.season'),
        ),
        migrations.CreateModel(
            name='Standings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('race', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='standings', to='api.race')),
                ('season', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='standings', to='api.season')),
                ('users_picks', models.ManyToManyField(to='api.userpicks')),
            ],
        ),
    ]
