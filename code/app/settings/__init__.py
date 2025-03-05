from .base_settings import *
from .conf_settings import *

if ENVIRONMENT == "local":
    from .local import *
elif ENVIRONMENT == "develop":
    from .dev import *
elif ENVIRONMENT == "production":
    from .prod import *
else:
    raise Exception(f'invalid ENVIRONMENT: {ENVIRONMENT}')
    