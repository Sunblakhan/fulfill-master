# serializers.py
from rest_framework import serializers
from . import models
from authentication.serializers import CustomUserSerializer


class WarehousesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Warehouses
        fields = "__all__"


class ViewWarehousesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Warehouses
        fields = ["id", "name"]


class FBAInventoryRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.FBAInventoryRequest
        fields = "__all__"


class ViewFBAInventoryRequestSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    warehouse = ViewWarehousesSerializer()

    class Meta:
        model = models.FBAInventoryRequest
        fields = "__all__"


class FBMInventoryRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.FBMInventoryRequest
        fields = "__all__"


class ViewFBMInventoryRequestSerializer(serializers.ModelSerializer):
    warehouse = ViewWarehousesSerializer()

    class Meta:
        model = models.FBMInventoryRequest
        fields = "__all__"


class FBMOrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Order
        fields = "__all__"


class ViewFBMOrdersSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    product = FBMInventoryRequestSerializer()

    class Meta:
        model = models.Order
        fields = "__all__"


class LogisticsRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.LogisticsRegistration
        fields = "__all__"


class ViewLogisticsRegistrationSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()

    class Meta:
        model = models.LogisticsRegistration
        fields = "__all__"
