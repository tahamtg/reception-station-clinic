from django.urls import path
from . import views

urlpatterns = [
    path("post_info/", views.Post_Info, name="post info"),
    path("get_info/", views.Get_Info, name="get info"),
    path("delete_info/<int:id>/", views.Delete_Info, name="delete info"),
    path("update_info/<int:id>/", views.Update_Info, name="update info"),
    path("search_info/", views.Search_Info, name="search info"),
    path("get_submit_info/", views.Get_Submit_Info, name="get submit info"),
    path("get_Photos/<int:person_id>/", views.Get_Photos, name="get photos"),
    path("post_image/<int:person_id>/", views.Post_images, name="post image"),
    path("confirm_info/<int:id>/", views.Confirm_Info, name="confirm info"),
    path("update_service/<int:id>/", views.Service_add_Info, name="add service"),
    path("delete_photo/<int:id>/<str:photo>/", views.del_photo, name="add service"),
    path("patch_photo/<int:id>/<str:photo>/", views.Update_Photo, name="add service"),
]