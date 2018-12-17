from django.contrib.auth.models import User
from django.db import models

"""
u = User.objects.get(username='250228')
pg_rest = u.mostore.pg_rest
task_rest = u.mostore.task_rest
"""
class MoApps(models.Model):
    name = models.CharField(max_length=100)
    href = models.CharField(max_length=100)
    app_name = models.CharField(max_length=100)
    order = models.SmallIntegerField(default=1)
    
    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.app_name

    
        
class MoStore(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    mo_name = models.CharField(max_length=100)
    pg_rest = models.CharField(max_length=100)
    task_rest = models.CharField(max_length=100)
    apps = models.ManyToManyField(MoApps)

    def __str__(self):
        return f'{self.mo_name} -- {self.user}'



