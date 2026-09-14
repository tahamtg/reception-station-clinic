from django.urls import re_path
from .consumer import chatConsumer

websocket_urlpatterns =[
    re_path(r"ws/chat/(?P<room_name>\w+)/$",
            chatConsumer.as_asgi)
]