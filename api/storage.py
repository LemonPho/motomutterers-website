from typing import Optional
from django.core.files.storage import FileSystemStorage

ACCEPTED_EXTENSIONS = ["jpg", "jpeg", "png", "ico", "svg"]

class OverwriteStorage(FileSystemStorage):
    def get_available_name(self, name, max_length=None):
        name_no_extension = name.split('.')[-2]
        for accepted_extension in ACCEPTED_EXTENSIONS:
            if self.exists(f"{name_no_extension}.{accepted_extension}"):
                self.delete(f"{name_no_extension}.{accepted_extension}")
        if self.exists(name):
            self.delete(name)
        return name
    
    