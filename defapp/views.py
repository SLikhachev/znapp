from django.shortcuts import render
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
    
def logout(request):
    logout(request)
    return redirect('/login/')

def get_app(app_name, user):
    s = MoStore.objects.get(user=user)
    return dict(
        app_name=app_name,
        mo_name=s.mo_name,
        pg_rest=s.pg_rest,
        task_rest=s.task_rest,
    )

@login_required
def clinic(request):
    return render(request, 'app.html', get_app( 'clinic', request.user.pk ) )

@login_required
def sprav(request):
    return render(request, 'app.html', get_app( 'sprav', request.user.pk ))
