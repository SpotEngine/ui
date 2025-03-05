from django.urls import path
from . import views


urlpatterns = [
   path('spot', views.SpotView.as_view(), name="spot"),
]