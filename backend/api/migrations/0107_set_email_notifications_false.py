from django.db import migrations

def set_false(apps, schema_editor):
    User = apps.get_model("api", "User")
    User.objects.all().update(race_weekends_emails=False)

class Migration(migrations.Migration):
    dependencies = [
        ("api", "0106_alter_user_race_weekends_emails"),
    ]

    operations = [
        migrations.RunPython(set_false)
    ]