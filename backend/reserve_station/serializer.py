from rest_framework import serializers
from .models import Personal, PersonalPicture,Users

class PersonalSerializer (serializers.ModelSerializer):

    class Meta:
        model = Personal
        fields = "__all__"

class PersonalSubmit_Serializer (serializers.ModelSerializer):

    class Meta:
        model = Personal
        fields = "__all__"

class PersonalPictureSerializer(serializers.ModelSerializer):

    class Meta:
        model = PersonalPicture
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = Users
        fields = ["username", "password"]
        extra_kwargs = {
            "password": {
                "write_only": True
            }
        }

    def create(self, validated_data):
        return Users.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"]
        )