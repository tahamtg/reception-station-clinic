from django.urls import path
from . import views

urlpatterns = [
    path("post_info/", views.Post_Info, name="post info"),
    path("get_info/", views.Get_Info, name="get info"),
    path("delete_info/<int:id>/", views.Delete_Info, name="delete info"),
    path("update_info/<int:id>/", views.Update_Info, name="update info"),
    path("search_info/", views.Search_Info, name="search info"),
    path("update_service/<int:id>/", views.Service_add_Info, name="add service"),
]