from django.shortcuts import render


def inicio(request):
    return render(request, 'jardin/inicio.html')

def flores(request):
    return render(request, 'jardin/flor.html')