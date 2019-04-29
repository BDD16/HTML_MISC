from django.contrib.auth.models import User
from django.contrib.auth import authenticate

user = authenticate(username='', password='')
if user is not None:
    # A backend authenticated the credentials
else:
    # No backend authenticated the credentials
