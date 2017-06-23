"""
WSGI config for apt_ioc_web project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/howto/deployment/wsgi/
"""

# import os
# import sys
#
# from django.core.wsgi import get_wsgi_application
#
# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
#
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "apt_ioc_web.settings")
#
# application = get_wsgi_application()
import os
PROJECT_DIR = os.path.dirname(os.path.dirname(__file__))
import sys # 4
sys.path.insert(0,PROJECT_DIR) # 5
os.environ["DJANGO_SETTINGS_MODULE"] = "apt_ioc_web.settings"
os.environ.setdefault("PYTHON_EGG_CACHE", "/tmp/.python-eggs")
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()