from rest_framework import serializers
from .models import User, Disease, DetectionHistory
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'is_expert')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'password', 'is_expert')

    def create(self, validated_data):
        user = get_user_model().objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            is_expert=validated_data.get('is_expert', False)
        )
        return user

class DiseaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disease
        fields = '__all__'

class DetectionHistorySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    predicted_disease = DiseaseSerializer(read_only=True)

    class Meta:
        model = DetectionHistory
        fields = '__all__'
