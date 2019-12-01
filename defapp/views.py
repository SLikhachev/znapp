import json
from django.http import Http404
from django.shortcuts import render, redirect
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import views as auth_views
from defapp.models import MoStore

class ThisLoginView(auth_views.LoginView):
    template_name='login.html'
    
    def post(self, request, *args, **kwargs):
        #print(request.POST['password'])
        return super().post(request, *args, **kwargs)
    
def log_out(request):
    logout(request)
    return redirect('/login/?next=/')

def get_app(app_name, user):
    s = MoStore.objects.get(user=user)
    #u = User.objects.get(user=user)
    aps = {}
    for ap in s.apps.all():
        aps[ap.name] = dict(href=ap.href, name=ap.app_name)
    #jd = json.dumps(aps)
    #print(jd)
    #print(json.loads(jd))
    if aps.get(app_name, None) is None:
        return None
    return dict(
        #this_mo=u.name,
        app_name=app_name,
        mo_name=s.mo_name,
        pg_rest=s.pg_rest,
        task_rest=s.task_rest,
        apps = json.dumps(aps)
        #apps = aps
    )

@login_required()
def view_app(request, app_name=None):
    if app_name is None:
        app_name='sprav'
    apps = get_app( app_name, request.user.pk )
    if apps:
        return render(request, 'app.html', apps )
    raise Http404