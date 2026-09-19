from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Personal
from .serializer import PersonalSerializer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models import Q

@api_view(["POST"])
def Post_Info(request):

    serializer = PersonalSerializer(data=request.data)

    serializer.is_valid(raise_exception=True)

    person = serializer.save()

    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        "services_getdata",
        {
            "type": "new_person",
            "id": person.id,
        }
    )

    return Response(serializer.data)


@api_view(["GET"])
def Search_Info(request):
    search = request.GET.get("search", "")

    queryset = Personal.objects.all()

    if search:
        queryset = queryset.filter(
            Q(name__icontains=search) |
            Q(phone__icontains=search) |
            Q(file__icontains=search)
        )

    serializer = PersonalSerializer(queryset, many=True)

    return Response(serializer.data)


@api_view(["POST"])
def Service_add_Info(request, id):

    try:
        person = Personal.objects.get(id=id)
    except Personal.DoesNotExist:
        return Response(
            {"error": "person not found"},
            status=404
        )

    new_service = request.data.get("service")

    if not new_service:
        return Response(
            {"error": "service is required"},
            status=400
        )

    if person.services:
        person.services += f", {new_service}"
    else:
        person.services = new_service

    person.save()

    channel_layer = get_channel_layer()

    async_to_sync(
        channel_layer.group_send)(
            "services_getdata",
            {
                "type": "for_Assistant",
                "id": person.id
            }
        )
    

    return Response({
        "id": person.id,
        "service": person.services
    })


@api_view(["GET"])
def Get_Info(request):

    people = Personal.objects.all()
    serializer = PersonalSerializer(people, many=True)

    return Response(serializer.data)


@api_view(["DELETE"])
def Delete_Info(request, id):

    try:
        req_param = Personal.objects.get(id=id)
    except Personal.DoesNotExist:
        return Response(
            {"error": "person not found"},
            status=404
        )

    req_param.delete()

    return Response({
        "message": "deleted successfully"
    })


@api_view(["PATCH"])
def Update_Info(request, id):

    try:
        req_param = Personal.objects.get(id=id)
    except Personal.DoesNotExist:
        return Response(
            {"error": "person not found"},
            status=404
        )

    serializer = PersonalSerializer(
        req_param,
        data=request.data,
        partial=True
    )

    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(serializer.data)

