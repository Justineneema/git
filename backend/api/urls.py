from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'diseases', views.DiseaseViewSet, basename='disease')
router.register(r'history', views.DetectionHistoryViewSet, basename='history')

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    
    # AI Detection endpoint
    path('detect/', views.ai_detect, name='ai_detect'),
    
    # Include router URLs
    path('', include(router.urls)),
]