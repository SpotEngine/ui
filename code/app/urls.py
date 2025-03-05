from django.conf import settings
from django.urls import path, include
from django.conf.urls.static import static


urlpatterns = [
   path('app/', include('dashboard.urls')),
   path('', include('portal.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

