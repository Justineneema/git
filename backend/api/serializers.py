from rest_framework import serializers
from .models import User, Disease, DetectionHistory
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'is_expert')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=4)
    is_expert = serializers.BooleanField(required=False, default=False)
    
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'password', 'is_expert')

    def validate_username(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        return value

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
    image = serializers.SerializerMethodField()

    class Meta:
        model = DetectionHistory
        fields = '__all__'
    
    def get_image(self, obj):
        """Return full image URL"""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            # Fallback if no request context
            return f"/media/{obj.image.name}"
        return None
