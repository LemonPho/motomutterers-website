from typing import Optional
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django_ratelimit.decorators import ratelimit
import six


class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
    #@ratelimit(key='ip', rate='5/h', block=True)
    def _make_hash_value(self, user, timestamp):
        return six.text_type(user.pk) + six.text_type(timestamp) + six.text_type(user.is_active)

account_activation_token = AccountActivationTokenGenerator()