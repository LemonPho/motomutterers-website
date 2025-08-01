from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage

import os
import re

def generate_image_path(user, filename):
    ext = filename.split('.')[-1]
    unique_filename = f"{str(user.id)}_profile_picture.{ext}"
    return os.path.join("profile_pictures/", unique_filename)

def is_username_valid(username):
    # Regular expression pattern to check for unwanted characters
    pattern = r"^[a-zA-Z0-9_]+$"  # Allow only alphanumeric characters and underscores

    if re.match(pattern, username):
        return True
    else:
        return False
    
def is_email_valid(email):
    # Regular expression pattern for basic email validation
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

    if re.match(pattern, email):
        return True
    else:
        return False

#@ratelimit(key='ip', rate='10/h', block=True) 
def send_email(recipient, subject, body, content_subtype):
    email = EmailMessage(subject, body, to=[recipient])
    if content_subtype:
        email.content_subtype = content_subtype
    return email
    

def sanitize_text(text):
    sanitized_text = re.sub(r'\n\s*\n+', '\n\n', text.strip())
    return sanitized_text

def binary_search(arr, target, key):
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        mid_value = key(arr[mid]) 
        
        if mid_value == target:
            return arr[mid]
        elif mid_value < target:
            low = mid + 1
        else:
            high = mid - 1
            
    return None