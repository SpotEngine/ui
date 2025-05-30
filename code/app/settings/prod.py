from .conf_settings import ENVIRONMENT


if not ENVIRONMENT == "production":
    raise Exception(f"Environment: {ENVIRONMENT} not set to production")

API_HOST = "https://demo-api.be1000.com"

SECRET_KEY = 'iecy_=rzx0g1am(+b-gh3-t^-z^6#2s$av*6=3%$882j864u9i'
DEBUG = False
ALLOWED_HOSTS = ['*']

