from utils.views import BaseTemplateClass


APP_NAME = 'dashboard'



class PerpetualView(BaseTemplateClass):
    build_path = 'app/perpetual/index.html'
    template_name = f"{APP_NAME}/perp/perpetual.html"

class PerpContractView(BaseTemplateClass):
    build_path = 'app/perpetual/index.html'
    template_name = f"{APP_NAME}/perp/contract.html"
