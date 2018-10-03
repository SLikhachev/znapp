
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'blog',
        'USER': 'postgres',
        'PASSWORD': 'boruh',
    }
}


ROOT_URLCONF = 'vladzdrav.webapp.urls'
WSGI_APPLICATION = 'vladzdrav.webapp.wsgi.application'