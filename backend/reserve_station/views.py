from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Personal, SubmitPersonal, PersonalPicture, Users
from .serializer import PersonalSerializer, PersonalSubmit_Serializer, PersonalPictureSerializer, UserSerializer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models import Q
from rest_framework_simplejwt.views import TokenObtainPairView
from datetime import timedelta
from rest_framework.parsers import MultiPartParser, FormParser 
from rest_framework.decorators import api_view, parser_classes

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

    return Response({
        "message": "اطلاعات تثبیت شد"
    })

@api_view(["GET"])
def Get_Submit_Info(request):

    people = SubmitPersonal.objects.all()
    serializer = PersonalSubmit_Serializer(people, many=True)

    return Response(serializer.data)

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def Post_images(request, person_id):

    person = SubmitPersonal.objects.get(id=person_id)

    model = PersonalPicture.objects.create(
        person=person,
        img_before=request.FILES.get("img_before"),
        img_after=request.FILES.get("img_after"),
    )

    return Response({

        "person": model.person.id,

        "img_before": model.img_before.url
            if model.img_before else None,

        "img_after": model.img_after.url
            if model.img_after else None,
    })

@api_view(["GET"])
def Get_Photos(request, person_id):

    images = PersonalPicture.objects.filter(
        person_id=person_id
    )

    if not images.exists():
        return Response(
            {"message": "عکسی وجود ندارد"},
            status=404
        )

    return Response([
        {
            "person": image.person.id,

            "img_before": image.img_before.url
                if image.img_before else None,

            "img_after": image.img_after.url
                if image.img_after else None,
        }

        for image in images
    ])

@api_view(["PATCH"])
def Update_Photo(request, id, photo):

    try:
        image = PersonalPicture.objects.get(person=id)

    except PersonalPicture.DoesNotExist:
        return Response(
            {"error": "person not found"},
            status=404
        )

    new_file = request.FILES.get(f"img_{photo}")

    if not new_file:
        return Response(
            {"error": "image is required"},
            status=400
        )

    if photo == "before":

 
        if image.img_before:
            image.img_before.delete(save=False)


        image.img_before = new_file

    elif photo == "after":


        if image.img_after:
            image.img_after.delete(save=False)


        image.img_after = new_file

    else:
        return Response(
            {"error": "invalid photo type"},
            status=400
        )

    image.save()

    return Response({
        "person": image.person_id,
        "img_before": image.img_before.url if image.img_before else None,
        "img_after": image.img_after.url if image.img_after else None,
    })


@api_view(["DELETE"])
def del_photo(request, id, photo):

    if photo == "before":
        photos = PersonalPicture.objects.filter(
            person=id,
            img_before__isnull=False
        )

        print("BEFORE PHOTOS:", photos.count())

        for item in photos:
            print("DELETING:", item.id, item.img_before.name)

            item.img_before.delete(save=False)
            item.img_before = None
            item.save()

    elif photo == "after":
        photos = PersonalPicture.objects.filter(
            person=id,
            img_after__isnull=False
        )

        print("AFTER PHOTOS:", photos.count())

        for item in photos:
            print("DELETING:", item.id, item.img_after.name)

            item.img_after.delete(save=False)
            item.img_after = None
            item.save()

    else:
        return Response(
            {"error": "invalid photo"},
            status=400
        )

    return Response({
        "successfully_delete!": "successfully_delete!"
    })


class CreateTokenCookie(TokenObtainPairView):

    def post(self, request, *args, **kwargs):

        print("LOGIN DATA:", request.data)

        response = super().post(request, *args, **kwargs)

        access_token = response.data["access"]
        refresh_token = response.data["refresh"]

        response.set_cookie(
            key="access",
            value=access_token,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=86400,
        )

        response.set_cookie(
            key="refresh",
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=int(timedelta(days=60).total_seconds()),
        )

        print("LOGIN RESPONSE:", response.data)

        return response
