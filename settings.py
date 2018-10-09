# coding=UTF-8
# settings.py

import os
import socket

ALLOWED_HOSTS = ['192.168.10.21', 'vladzdrav.alwaysdata.net']
AHOST =  socket.gethostbyname ( socket.gethostname() )
#print (AHOST)
DEVEL = AHOST.startswith(ALLOWED_HOSTS[0])

#DEVEL=False
#DEVEL=True
DEBUG = False
if DEVEL:
    DEBUG = True
DEBUG = True
TEMPLATE_DEBUG = DEBUG

SITE_DIR = os.path.dirname(__file__)
BASE_DIR = os.path.split(SITE_DIR)[0]

import sys

sys.path.append(BASE_DIR)
sys.path.append(SITE_DIR)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'gnepisnrh)kscnpig*3v6vtgozi1iz&+tnra=wv#0r(8wetkj^'

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'defapp',    
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LOGIN_URL = '/login/'

# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/

LANGUAGE_CODE = 'ru-RU'

TIME_ZONE = 'UTC'

USE_I18N = False

USE_L10N = False

USE_TZ = False


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/

MEDIA_URL = '/media/'
#Absolute filesystem path to the directory that will hold user-uploaded files.
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

STATICFILES_DIRS = (
    os.path.join(SITE_DIR, "static"),
)
if DEVEL:
    from conf.settings_dev import *
else:
    from conf.settings_prod import *