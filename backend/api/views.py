from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate

from .models import Disease, DetectionHistory
from .serializers import (
    UserSerializer, RegisterSerializer, DiseaseSerializer, DetectionHistorySerializer
)

# Registration
class RegisterView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

# Login (returns JWT token)
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
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
        return Response({"error": "Invalid Credentials"}, status=400)

# CRUD for Disease
class DiseaseViewSet(viewsets.ModelViewSet):
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer
    permission_classes = [permissions.IsAuthenticated]

# List/create DetectionHistory (user sees their own, admin/expert see all)
class DetectionHistoryViewSet(viewsets.ModelViewSet):
    queryset = DetectionHistory.objects.all()
    serializer_class = DetectionHistorySerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or getattr(user, 'is_expert', False):
            return DetectionHistory.objects.all()
        return DetectionHistory.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Image AI Detection endpoint (stubbed: replace with real model logic)
from rest_framework.decorators import api_view, permission_classes, parser_classes
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def ai_detect(request):
    img = request.FILES.get('image')
    if not img:
        return Response({"error": "Image is required"}, status=400)
    # Basic validity check: ensure likely crop image by simple green-dominance heuristic
    try:
        from PIL import Image
        import numpy as np
        image = Image.open(img).convert('RGB').resize((224, 224))
        arr = np.asarray(image).astype('float32')
        r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
        green_score = float(np.mean(g - ((r + b) / 2.0)))
        if green_score < 5.0:  # low green dominance => likely non-crop
            return Response({"error": "Please upload a valid crop image"}, status=400)
        # Reset file pointer for storage below
        img.seek(0)
    except Exception:
        pass
    # --- Begin mock AI logic; replace with real model later! ---
    import random
    # Seed canonical diseases if empty (ensures true info exists for demo)
    diseases = Disease.objects.all()
    if not diseases.exists():
        defaults = [
            {
                'name': 'Banana Bacterial Wilt',
                'species': 'Banana',
                'description': 'Bacterial disease causing wilting and yellowing.',
                'treatment': 'Rogue infected plants, sanitize tools, use clean planting material.',
                'healthy_image_url': 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1200&auto=format&fit=crop',
                'care_tips': 'Maintain field hygiene; use resistant varieties; avoid tool sharing between fields.'
            },
            {
                'name': 'Maize Leaf Blight',
                'species': 'Maize',
                'description': 'Fungal leaf spots reducing photosynthesis.',
                'treatment': 'Rotate crops, remove residue, apply recommended fungicide if severe.',
                'healthy_image_url': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop',
                'care_tips': 'Ensure spacing for airflow; balanced fertilization; timely weeding.'
            },
            {
                'name': 'Potato Late Blight',
                'species': 'Potato',
                'description': 'Oomycete disease causing dark lesions on leaves and tubers.',
                'treatment': 'Use certified seed, ensure airflow, apply protective fungicide as advised.',
                'healthy_image_url': 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop',
                'care_tips': 'Avoid overhead irrigation late in day; remove infected leaves; monitor weather alerts.'
            },
        ]
        for d in defaults:
            Disease.objects.get_or_create(name=d['name'], species=d['species'], defaults={
                'description': d['description'], 'treatment': d['treatment'],
                'healthy_image_url': d['healthy_image_url'], 'care_tips': d['care_tips']
            })
        diseases = Disease.objects.all()
    if diseases.exists():
        disease = random.choice(list(diseases))
        confidence = round(random.uniform(0.7, 0.99), 2)
        disease_data = DiseaseSerializer(disease).data
        result = {
            'predicted_disease': disease_data,
            'confidence': confidence,
            'recommendation': disease.treatment,
            'crop_name': disease.species,
            'healthy_example': disease.healthy_image_url,
            'care_tips': disease.care_tips,
        }
    else:
        result = {
            'predicted_disease': None,
            'confidence': 0,
            'recommendation': "No disease data in system."
        }
    # Save in history
    detection = DetectionHistory.objects.create(
        user=request.user,
        image=img,
        predicted_disease=disease if diseases.exists() else None,
        confidence=result['confidence']
    )
    result['id'] = detection.id
    return Response(result)
