from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from defapp.models import MoStore

class MoStoreInline(admin.StackedInline):
    model = MoStore
    can_delete = False
    verbose_name_plural = ''

# Define a new User admin
class UserAdmin(BaseUserAdmin):
    inlines = (MoStoreInline,)

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
