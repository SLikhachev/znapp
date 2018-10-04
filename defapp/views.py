from django.shortcuts import render
from django.conf import settings

# Create your views here.

def home(request):
    return render(request, 'base.html', {'app_name': 'clinic'})

def sprav(request):
    return render(request, 'base.html', {'app_name': 'sprav', 'pg_rest': settings.PG_REST_URL})