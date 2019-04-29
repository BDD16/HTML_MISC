from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^ajax/knockout-tasks/$', views.ajax_knockout_tasks, name='ajax_knockout_tasks'),
    url(r'^ajax/knockout-logins/$', views.ajax_knockout_logins, name='ajax_knockout_logins'),

]
