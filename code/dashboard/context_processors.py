from django.conf import settings 

def global_params(request):
    return {
        'SITE_NAME': settings.SITE_NAME,
        'VERSION': settings.VERSION,
        'API_HOST': settings.API_HOST,
    }