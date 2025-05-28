from utils.views import BaseTemplateClass

APP_NAME = 'portal'


class IndexView(BaseTemplateClass):
    build_path = 'index.html'
    template_name = f"{APP_NAME}/index.html"

class LoginView(BaseTemplateClass):
    build_path = 'login/index.html'
    template_name = f"{APP_NAME}/login.html"

class RegisterView(BaseTemplateClass):
    build_path = f'register/index.html'
    template_name = f"{APP_NAME}/register.html"

class ConnectView(BaseTemplateClass):
    build_path = f'connect/index.html'
    template_name = f"{APP_NAME}/connect.html"
