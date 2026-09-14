from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Personal
from .serializer import PersonalSerializer

@api_view(["POST"])
def Post_Info(request):

    req = request.data
    serializer = PersonalSerializer(data=req)

    if serializer.is_valid(raise_exception=True):
        serializer.save()

        return Response({
            "save": "success saving!"
        })

@api_view(["GET"])
def Get_Info(request):

    people = Personal.objects.all()
    serializer = PersonalSerializer(people, many=True)

    return Response(serializer.data)

@api_view(["GET"])
def del_info(request):
    get_index = request.data[""]
