# serializers.py
from rest_framework import serializers
from . import models

class WarehousesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Warehouses
        fields = '__all__'

class ViewWarehousesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Warehouses
        fields = ['id', 'name']

class FBAInventoryRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.FBAInventoryRequest
        fields = '__all__'

class ViewFBAInventoryRequestSerializer(serializers.ModelSerializer):
    warehouse = ViewWarehousesSerializer()
    class Meta:
        model = models.FBAInventoryRequest
        fields = '__all__'

class LogisticsRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.LogisticsRegistration
        fields = '__all__'