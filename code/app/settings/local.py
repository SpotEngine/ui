from .conf_settings import ENVIRONMENT


if not ENVIRONMENT == "local":
    raise Exception(f"Environment: {ENVIRONMENT} not set to local")


API_HOST = "http://127.0.0.1:8000"

SECRET_KEY = 'iecy_=rzx0g1am(+b-gh3-t^-z^6#2s$av*6=3%$882j864u9i'
DEBUG = True
ALLOWED_HOSTS = ['*']

