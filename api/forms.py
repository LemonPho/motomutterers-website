from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError

from api.views.picks_view.picks_validators import check_picks_conflict

from .models import Announcement, AnnouncementComment, Notification, CurrentSeason, Season, Competitor, Race, CompetitorPosition, UserPicks

import re

ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "ico", "svg", "heic", "heif"]

class UserRegistrationForm(UserCreationForm):
    email = forms.EmailField(max_length=200, help_text='Required')
    class Meta:
        model = get_user_model()
        fields = ["username", "email", "password1", "password2"]

class ProfilePictureForm(forms.Form):

    profile_picture = forms.ImageField()

    def clean_profile_picture(self):
        profile_picture = self.cleaned_data.get("profile_picture", False)
        if not profile_picture:
            raise forms.ValidationError("No image found")
        file_extension = profile_picture.name.split('.')[-1].lower()
        if file_extension not in ALLOWED_EXTENSIONS:
            raise forms.ValidationError("Extension not supported")
        
        return profile_picture