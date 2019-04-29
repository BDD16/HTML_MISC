from django.contrib import admin

from main.models import Task
from main.models import Login


class TaskAdmin(admin.ModelAdmin):
    list_display = ('title',
                    'isDone',
                    )


class LoginAdmin(admin.ModelAdmin):
    list_display = ('title',
                    'isDone',
                    )
admin.site.register(Login, LoginAdmin)
admin.site.register(Task, TaskAdmin)
