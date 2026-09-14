from django.urls import path
from . import views

urlpatterns = [
    path("post_info/", views.Post_Info, name="post info"),
    path("get_info/", views.Get_Info, name="get info"),
]