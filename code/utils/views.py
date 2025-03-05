from bakery.views import BuildableTemplateView
from django.shortcuts import render

def base_view(request, app, template_name):
   return render(request, f'{app}/{template_name}')

class BaseTemplateClass(BuildableTemplateView):
   pass