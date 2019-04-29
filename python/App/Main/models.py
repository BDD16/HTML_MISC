from django.db import models
from django.contrib.auth import authenticate

# models created with this base will inherit created_date and modified_date automatically
class DatesBaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Task(models.Model):
    title = models.CharField(max_length=60)
    isDone = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Tasks"
        verbose_name_plural = "Tasks"
        ordering = ["title"]

class Login(models.Model):
    title = models.CharField(max_length=60)
    isDone = models.BooleanField(default=False)
    userName = models.CharField(max_length=25)
    passWord = models.CharField(max_length=60)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Logins"
        verbose_name_plural = "Logins"
        ordering = ["title"]
