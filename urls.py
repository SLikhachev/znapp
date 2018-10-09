from django.contrib import admin
from django.urls import path
from django.contrib.auth import views as auth_views
from defapp import views


urlpatterns = [
    #path('', views.home, name='home'),
    path('', views.sprav, name='sprav'),
    path('login/', views.ThisLoginView.as_view(), name='login'),
    path('logout/', views.logout, name='logout'),
    path('sprav/', views.sprav, name='sprav'),
    path('admin/', admin.site.urls),
]
