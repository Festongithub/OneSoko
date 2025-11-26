from django.http import HttpResponse

# Create your views here.
def welcomeUser(request):
    return HttpResponse("Welcome to the OneSoko platform share your hustles")
