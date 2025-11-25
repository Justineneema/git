"""
URL configuration for cropdetector project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.db import connection
from django.views.generic.base import RedirectView


def health_check(request):
    """
    Health check endpoint for Render.
    Returns 200 OK if the service is healthy.
    """
    health_status = {
        "status": "healthy",
        "service": "cropdetector-backend",
        "debug": settings.DEBUG,
    }
    
    # Check database connectivity
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
            "health": "/health/",
            "auth": "/api/auth/",
            "detection": "/api/detect/",
        },
        "documentation": "Use /api/ endpoints for application functionality"
    })


urlpatterns = [
    # Root endpoint
    path('', root_view, name='root'),
    
    # Health check endpoint (for Render)
    path('health/', health_check, name='health_check'),
    
    # Admin interface
    path('admin/', admin.site.urls),
    
    # API routes
    path('api/', include('api.urls')),
]

# Enable media file serving in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
