from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser, FormParser
from googletrans import Translator
from PIL import Image
import numpy as np
import random

from .models import Disease, DetectionHistory
from .serializers import DiseaseSerializer

translator = Translator()


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def ai_detect(request):
    img = request.FILES.get('image')
    if not img:
        return Response({"error": "Image is required"}, status=400)

    # --- Validate image ---
    try:
        image = Image.open(img).convert('RGB').resize((224, 224))
        arr = np.asarray(image).astype('float32')
        r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
        green_score = float(np.mean(g - ((r + b) / 2.0)))
        if green_score < 5.0:
            return Response({"error": "Please upload a valid crop image"}, status=400)
        img.seek(0)
    except Exception as e:
        return Response({"error": f"Invalid image format: {str(e)}"}, status=400)

    # --- Mock AI logic (load default diseases if empty) ---
    diseases = Disease.objects.all()
    if not diseases.exists():
        defaults = [
            {
                'name': 'Banana Bacterial Wilt',
                'species': 'Banana',
                'description': 'Bacterial disease causing wilting and yellowing.',
                'treatment': 'Rogue infected plants, sanitize tools, use clean planting material.',
                'care_tips': 'Maintain field hygiene; use resistant varieties; avoid tool sharing between fields.'
            },
            {
                'name': 'Maize Leaf Blight',
                'species': 'Maize',
                'description': 'Fungal leaf spots reducing photosynthesis.',
                'treatment': 'Rotate crops, remove residue, apply recommended fungicide if severe.',
                'care_tips': 'Ensure spacing for airflow; balanced fertilization; timely weeding.'
            },
            {
                'name': 'Potato Late Blight',
                'species': 'Potato',
                'description': 'Oomycete disease causing dark lesions on leaves and tubers.',
                'treatment': 'Use certified seed, ensure airflow, apply protective fungicide as advised.',
                'care_tips': 'Avoid overhead irrigation late in day; remove infected leaves; monitor weather alerts.'
            },
        ]
        for d in defaults:
            Disease.objects.get_or_create(
                name=d['name'], species=d['species'],
                defaults={
                    'description': d['description'],
                    'treatment': d['treatment'],
                    'care_tips': d['care_tips']
                }
            )
        diseases = Disease.objects.all()

    # --- Random selection and translation ---
    try:
        disease = random.choice(list(diseases))
        confidence = round(random.uniform(0.7, 0.99), 2)
        disease_data = DiseaseSerializer(disease).data

        #  Translate with fallback
        def safe_translate(text):
            try:
                return translator.translate(text, src='en', dest='rw').text
            except Exception:
                return text  # fallback to English

        translated = {
            'name_rw': safe_translate(disease.name),
            'description_rw': safe_translate(disease.description),
            'treatment_rw': safe_translate(disease.treatment),
            'care_tips_rw': safe_translate(disease.care_tips),
        }

        result = {
            'status': 'success',
            'predicted_disease': disease_data,
            'confidence': confidence,
            'recommendation': disease.treatment,
            'crop_name': disease.species,
            'care_tips': disease.care_tips,
            'translation': translated
        }

    except Exception as e:
        print("Detection error:", e)
        return Response({"error": "Detection failed. Please try again."}, status=500)

    # --- Save history ---
    detection = DetectionHistory.objects.create(
        user=request.user,
        image=img,
        predicted_disease=disease if diseases.exists() else None,
        confidence=result.get('confidence', 0)
    )
    result['id'] = detection.id

    # Remove any 'healthy_image_url' or similar field from predicted_disease
    if 'predicted_disease' in result:
        disease_data = result['predicted_disease']
        disease_data.pop('healthy_image_url', None)  # remove if exists
        result['predicted_disease'] = disease_data


    return Response(result)
