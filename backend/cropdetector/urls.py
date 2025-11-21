"""
URL configuration for cropdetector project.
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.db import connection
from django.core.exceptions import ImproperlyConfigured


def health_check(request):
    """
    Health check endpoint for Render.
    Returns 200 OK if the service is healthy.
    """
    health_status = {
        "status": "healthy",
        "service": "cropdetector-backend",
    }
    
    # Optional: Check database connectivity
    try:
        connection.ensure_connection()
        health_status["database"] = "connected"
    except Exception as e:
        health_status["database"] = "disconnected"
        health_status["database_error"] = str(e)
        return JsonResponse(health_status, status=503)
    
    return JsonResponse(health_status, status=200)


def root_view(request):
    """
    Root endpoint - provides basic API information.
    """
    return JsonResponse({
        "message": "Welcome to CropDetector API",
        "version": "1.0.0",
        "endpoints": {
            "admin": "/admin/",
            "api": "/api/",
            "health": "/api/health/",
        }
    })


urlpatterns = [
    # Root endpoint
    path('', root_view, name='root'),
    
    # Health check endpoint (for Render)
    path('api/health/', health_check, name='health_check'),
    
    # Admin interface
    path('admin/', admin.site.urls),
    
    # API routes
    path('api/', include('api.urls')),
]

# Enable media file serving in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)