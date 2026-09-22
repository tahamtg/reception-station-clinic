from rest_framework import serializers
from .models import Personal, PersonalPicture

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