from django.contrib import admin
from django.urls import path, re_path
from django.contrib.auth import views as auth_views
from defapp import views


urlpatterns = [
    #path('', views.home, name='home'),
    path('', views.view_app, {'app_name': 'sprav'}),
    path('login/', views.ThisLoginView.as_view(), name='login'),
    path('logout/', views.log_out, name='logout'),
    path('admin/', admin.site.urls),
    re_path(r'^(?P<app_name>[\w-]+)/$', views.view_app),
   
]
