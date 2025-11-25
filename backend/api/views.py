from django.shortcuts import render
from django.contrib.auth import get_user_model, authenticate
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny

from .models import Disease, DetectionHistory
from .serializers import (
    UserSerializer, RegisterSerializer, DiseaseSerializer, DetectionHistorySerializer
)
from .translator import translate_to_kinyarwanda

from PIL import Image
import numpy as np
import random


# Get User Model
User = get_user_model()


# Registration View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        username = request.data.get("username")
        email = request.data.get("email", "")

        # Check for duplicates
        if not username:
            return Response(
                {"error": "Username is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists. Please log in instead."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if email and User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already registered. Try logging in instead."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Proceed with creation
        response = super().create(request, *args, **kwargs)

        # Auto-login after registration
        user = User.objects.get(username=username)
        refresh = RefreshToken.for_user(user)
        response.data.update({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data
        })
        return response


# Login View
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": UserSerializer(user).data
            })

        return Response(
            {"error": "Invalid credentials. Please try again."}, 
            status=status.HTTP_400_BAD_REQUEST
        )


# Disease CRUD ViewSet
class DiseaseViewSet(viewsets.ModelViewSet):
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


# Detection History ViewSet
class DetectionHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = DetectionHistorySerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or getattr(user, 'is_expert', False):
            return DetectionHistory.objects.all().order_by('-detected_at')
        return DetectionHistory.objects.filter(user=user).order_by('-detected_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# AI Detection Endpoint
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def ai_detect(request):
    img = request.FILES.get('image')
    if not img:
        return Response({"error": "Image is required"}, status=400)

    # Validate image
    try:
        image = Image.open(img).convert('RGB')
        # Basic image validation
        if image.size[0] < 50 or image.size[1] < 50:
            return Response({"error": "Image too small"}, status=400)
        img.seek(0)  # Reset file pointer
    except Exception as e:
        return Response({"error": f"Invalid image format: {str(e)}"}, status=400)

    # Seed default diseases if empty
    diseases = Disease.objects.all()
    if not diseases.exists():
        defaults = [
            {
                'name': 'Banana Bacterial Wilt',
                'species': 'Banana',
                'description': 'Bacterial disease causing wilting and yellowing.',
                'treatment': 'Rogue infected plants, sanitize tools, use clean planting material.',
                'care_tips': 'Maintain field hygiene; use resistant varieties; avoid tool sharing between fields, or contact one of our expert'
            },
            {
                'name': 'Maize Leaf Blight',
                'species': 'Maize',
                'description': 'Fungal leaf spots reducing photosynthesis.',
                'treatment': 'Rotate crops, remove residue, apply recommended fungicide if severe.',
                'care_tips': 'Ensure spacing for airflow; balanced fertilization; timely weeding, or contact one of our expert'
            },
            {
                'name': 'Potato Late Blight',
                'species': 'Potato',
                'description': 'Oomycete disease causing dark lesions on leaves and tubers.',
                'treatment': 'Use certified seed, ensure airflow, apply protective fungicide as advised.',
                'care_tips': 'Avoid overhead irrigation late in day; remove infected leaves; monitor weather alerts, or contact one of our expert'
            },
        ]
        for d in defaults:
            Disease.objects.get_or_create(
                name=d['name'], 
                species=d['species'],
                defaults={
                    'description': d['description'],
                    'treatment': d['treatment'],
                    'care_tips': d['care_tips']
                }
            )
        diseases = Disease.objects.all()

    # Mock AI detection with random disease
    try:
        disease = random.choice(list(diseases))
        confidence = round(random.uniform(0.7, 0.99), 2)
        disease_data = DiseaseSerializer(disease).data

        # Translation to Kinyarwanda
        translated = {
            'name_rw': translate_to_kinyarwanda(disease.name),
            'description_rw': translate_to_kinyarwanda(disease.description),
            'treatment_rw': translate_to_kinyarwanda(disease.treatment),
            'care_tips_rw': translate_to_kinyarwanda(disease.care_tips),
        }

        result = {
            'status': 'success',
            'predicted_disease': disease_data,
            'confidence': confidence,
            'recommendation': disease.treatment,
            'crop_name': disease.species,
            'care_tips': disease.care_tips,
            'translation': translated,
        }

    except Exception as e:
        print(f"Detection error: {e}")
        result = {
            'status': 'error',
            'message': 'Detection failed. Please try again.'
        }
        return Response(result, status=500)

    # Save detection history
    try:
        detection = DetectionHistory.objects.create(
            user=request.user,
            image=img,
            predicted_disease=disease,
            confidence=confidence
        )
        result['detection_id'] = detection.id
        result['detected_at'] = detection.detected_at

    except Exception as e:
        print(f"History save error: {e}")
        # Continue even if history save fails

    return Response(result)