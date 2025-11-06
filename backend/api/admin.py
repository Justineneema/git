from django.contrib import admin
from .models import User, Disease, DetectionHistory

admin.site.register(User)
admin.site.register(Disease)
admin.site.register(DetectionHistory)
