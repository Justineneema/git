from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    is_expert = models.BooleanField(default=False)
    # If you want extra fields, add them here

class Disease(models.Model):
    name = models.CharField(max_length=100)
    species = models.CharField(max_length=100)
    description = models.TextField()
    treatment = models.TextField()
    healthy_image_url = models.URLField(blank=True, default='')
    care_tips = models.TextField(blank=True, default='')

    def __str__(self):
        return f"{self.name} ({self.species})"

class DetectionHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='detections')
    image = models.ImageField(upload_to='detection_images/')
    predicted_disease = models.ForeignKey(Disease, on_delete=models.SET_NULL, null=True)
    confidence = models.FloatField()
    detected_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.predicted_disease} - {self.detected_at}"
