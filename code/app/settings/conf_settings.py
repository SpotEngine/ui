from pathlib import Path
import os

USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

ENVIRONMENT = os.getenv('ENVIRONMENT', 'local')
SITE_NAME = "Be1000"

CORS_ALLOWED_ORIGINS = ['http://*', 'https://*']
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_HEADERS = [
    'content-type',
    'authorization',
    '*',
]


# for bakery to generate static html files
BASE_DIR = Path(__file__).resolve().parent.parent
BUILD_DIR = os.path.join(BASE_DIR.parent, 'build')
STATIC_ROOT = os.path.join(BASE_DIR.parent, 'staticRoot')
BAKERY_VIEWS = (
    'portal.views.IndexView',
    'portal.views.LoginView',
    'portal.views.RegisterView',
    'portal.views.ConnectView',
    'dashboard.views.SpotView',
)
# AWS_BUCKET_NAME = 'be1000demo'
# AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
# AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
