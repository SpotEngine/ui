from django.urls import path
from . import views


urlpatterns = [
   path('spot', views.SpotView.as_view(), name="spot"),
   path('perpetual', views.PerpetualView.as_view(), name="perpetual"),
   path('contract', views.PerpContractView.as_view(), name="contract"),
]