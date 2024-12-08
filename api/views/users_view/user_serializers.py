from rest_framework import serializers
from pillow_heif import register_heif_opener, from_bytes
from io import BytesIO
from PIL import Image

ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "ico", "svg", "heic", "heif"]

class ProfilePictureSerializer(serializers.Serializer):
    profile_picture = serializers.ImageField()

    def validate_profile_picture(self, value):
        profile_picture = value
        profile_picture_name = value.name

        if not profile_picture_name.lower().endswith(tuple(ALLOWED_EXTENSIONS)):
            raise serializers.ValidationError("File extension is not supported")

        if profile_picture_name.lower().endswith(("heic", "heif")):
            # Read the HEIC/HEIF image into a Pillow image
            heif_image = from_bytes(value.read())
            image = Image.frombytes(
                heif_image.mode, heif_image.size, heif_image.data, "raw"
            )

            # Convert to JPG
            jpg_io = BytesIO()
            image.save(jpg_io, format="JPEG")
            jpg_io.seek(0)

            # Create a new file-like object with the converted JPG
            profile_picture = serializers.ImageField().to_internal_value({
                'name': profile_picture_name.rsplit('.', 1)[0] + ".jpg",
                'content': jpg_io,
            })

        return profile_picture

class UsernameSerializer(serializers.Serializer):
    pass

class EmailSerializer(serializers.Serializer):
    pass

class PasswordSerializer(serializers.Serializer):
    pass

