from django.shortcuts import render

# Create your views here.

def home(request):
    return render(request, 'base.html', {'app_name': 'clinic'})

def sprav(request):
    return render(request, 'base.html', {'app_name': 'sprav'})