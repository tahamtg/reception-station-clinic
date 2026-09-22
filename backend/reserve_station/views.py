from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Personal, SubmitPersonal, PersonalPicture
from .serializer import PersonalSerializer, PersonalSubmit_Serializer, PersonalPictureSerializer
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

@api_view(["PATCH"])
def Update_Submit(request, id):

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

@api_view(["POST"])
def Confirm_Info(request, id):

    person = Personal.objects.get(id=id)

    SubmitPersonal.objects.create(
        name=person.name,
        age=person.age,
        phone=person.phone,
        file=person.file,
        address=person.address,
        reserve_date=person.reserve_date,
        services=person.services,
        price=person.price,
    )

    person.delete()

    return Response({
        "message": "اطلاعات تثبیت شد"
    })

@api_view(["GET"])
def Get_Submit_Info(request):

    people = SubmitPersonal.objects.all()
    serializer = PersonalSubmit_Serializer(people, many=True)

    return Response(serializer.data)

@api_view(["POST"])
def Post_images(request, person_id):

    person = SubmitPersonal.objects.get(id=person_id)

    image, created = PersonalPicture.objects.get_or_create(
        person=person
    )

    serializer = PersonalPictureSerializer(
        image,
        data=request.data,
        partial=True
    )

    serializer.is_valid(raise_exception=True)

    image = serializer.save()

    return Response({
        "img_before": image.img_before.url
            if image.img_before else None,

        "img_after": image.img_after.url
            if image.img_after else None,
    })

@api_view(["GET"])
def Get_Photos(request, person_id):

    try:
        image = PersonalPicture.objects.get(
            person_id=person_id
        )
    except PersonalPicture.DoesNotExist:
        return Response(
            {"message": "عکسی وجود ندارد"},
            status=404
        )

    serializer = PersonalPictureSerializer(image)

    return Response(serializer.data)

@api_view(["PATCH"])
def Update_Photo(request, id, photo):

    try:
        req_param = PersonalPicture.objects.get(
            person=id
        )
    except PersonalPicture.DoesNotExist:
        return Response(
            {"error": "person not found"},
            status=404
        )

    if photo == "before":

        if req_param.img_before:
            req_param.img_before.delete(save=False)

        req_param.img_before = request.FILES.get("img_before")

    elif photo == "after":

        if req_param.img_after:
            req_param.img_after.delete(save=False)

        req_param.img_after = request.FILES.get("img_after")

    else:
        return Response(
            {"error": "invalid photo type"},
            status=400
        )

    req_param.save()

    serializer = PersonalPictureSerializer(req_param)

    return Response(serializer.data)

@api_view(["DELETE"])
def del_photo(request, id, photo):

    try:
        req_param = PersonalPicture.objects.get(person=id)

        if photo == "before":
            req_param.img_before.delete(save=True)
        elif photo == "after":
            req_param.img_after.delete(save=True)
        else:
            return Response(
                {"error": "invalid photo"},
                status=400
            )
    except PersonalPicture.DoesNotExist:
            return Response(
                {"error": "person not found"},
                status=404
            )
    return Response({
        "successfully_delete!": "successfully_delete!"
    })
