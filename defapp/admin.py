from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from defapp.models import MoStore, MoApps

class MoAppsAdmin(admin.ModelAdmin):
   pass

class MoAppsInline(admin.StackedInline):
    model = MoStore.apps.through

class MoStoreAdmin(admin.ModelAdmin):
    inlines = (MoAppsInline,)
    exclude = ('apps',)


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
admin.site.register(MoApps, MoAppsAdmin)
admin.site.register(MoStore, MoStoreAdmin)