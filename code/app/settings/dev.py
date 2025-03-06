from .conf_settings import ENVIRONMENT

if not ENVIRONMENT == "develop":
    raise Exception(f"Environment: {ENVIRONMENT} not set to develop")

# API_HOST = "https://be100demoloadbalancer-1257698492.eu-north-1.elb.amazonaws.com"
API_HOST = "http://ec2-16-171-226-124.eu-north-1.compute.amazonaws.com"
SECRET_KEY = 'k7v@wjji00&63f+95s&*y^l77nhq#2lyge7dp!+^+2r@mj_r=z'
DEBUG = True
ALLOWED_HOSTS = ['*']
