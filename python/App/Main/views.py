from django.shortcuts import render
from django.shortcuts import render, get_object_or_404
from .models import Task
from django.http import JsonResponse
from django.contrib.auth import authenticate
import json

def home(request):
    return render(request, 'View/View0/view0.html', context=None)

def knockout_tasks(request):
    return render(request, 'View/View0/view0.html', context=None)

def ajax_knockout_logins(request):
    data = []
    if request.method == 'POST':
        tasks = json.loads(request.body.decode('utf-8')) # retrieve the tasks from the ajax request
        user = authenticate(username='', password='')
        if user is not None:
            # A backend authenticated the credentials
        else:
            # No backend authenticated the credentials


def ajax_knockout_tasks(request):
    data = [] # initialize the array for the data to be processed / sent to the client
    if request.method == 'POST':
        tasks = json.loads(request.body.decode('utf-8')) # retrieve the tasks from the ajax request
        for task in tasks:
            if 'pk' in task: # task exists
                model_task = get_object_or_404(Task, pk=task['pk'])
                if '_destroy' in task: # task is to be deleted
                    model_task.delete()
                else: # task is to be updated
                    model_task.title = task['title']
                    model_task.isDone = task['isDone']
                    model_task.save()
            else: # create new task
                model_task = Task(title=task['title'],isDone=task['isDone'])
                model_task.save()
        data = 'success' # let the client know that things went OK on the server side
        return JsonResponse(data, safe=False) # safe=False is required to avoid security exploits
    else:
        tasks = Task.objects.all()  # retrieve all tasks
        for task in tasks:
            # build the JSON object (our tasks)
            # not the most efficient way of doing it (more on that later)
            data.append({"title":task.title,"isDone":task.isDone, "pk":task.pk})
        return JsonResponse(data, safe=False) # send tasks to the client
