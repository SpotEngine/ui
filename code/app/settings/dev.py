from .conf_settings import ENVIRONMENT

if not ENVIRONMENT == "develop":
    raise Exception(f"Environment: {ENVIRONMENT} not set to develop")

API_HOST = "https://be100demoloadbalancer-1257698492.eu-north-1.elb.amazonaws.com"
SECRET_KEY = 'k7v@wjji00&63f+95s&*y^l77nhq#2lyge7dp!+^+2r@mj_r=z'
DEBUG = True
ALLOWED_HOSTS = ['*']
