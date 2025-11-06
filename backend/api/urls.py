from django.urls import path, include
from rest_framework import routers
from .views import RegisterView, LoginView, DiseaseViewSet, DetectionHistoryViewSet, ai_detect

router = routers.DefaultRouter()
router.register("diseases", DiseaseViewSet)
router.register("detections", DetectionHistoryViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name="register"),
    path('login/', LoginView.as_view(), name="login"),
    path('ai-detect/', ai_detect, name='ai_detect'),
    path('', include(router.urls)),
]
