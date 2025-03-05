from utils.views import BaseTemplateClass


APP_NAME = 'dashboard'


class SpotView(BaseTemplateClass):
    build_path = 'app/spot/index.html'
    template_name = f"{APP_NAME}/spot/spot.html"
