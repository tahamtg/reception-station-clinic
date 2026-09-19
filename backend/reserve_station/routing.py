from django.urls import re_path

from .consumer import ChatConsumer

websocket_urlpatterns = [

    re_path(
        r"ws/services/(?P<room_name>\w+)/$",
        ChatConsumer.as_asgi()
    )

]