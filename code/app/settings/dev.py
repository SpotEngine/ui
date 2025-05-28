from .conf_settings import ENVIRONMENT

if not ENVIRONMENT == "develop":
    raise Exception(f"Environment: {ENVIRONMENT} not set to develop")

API_HOST = "https://be1000-api.netlify.app"

SECRET_KEY = 'k7v@wjji00&63f+95s&*y^l77nhq#2lyge7dp!+^+2r@mj_r=z'
DEBUG = True
ALLOWED_HOSTS = ['*']
