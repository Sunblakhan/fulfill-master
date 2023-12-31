# views.py
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status
from . import models
from . import serializers
from authentication.models import CustomUsers
from django.db.models import Q


@api_view(["GET", "POST"])
@permission_classes([])
@authentication_classes([])
def warehouse(request, user_id = None):
    if request.method == "GET":
        warehouses = models.Warehouses.objects.filter(Q(isGlobal=True) | Q(user__id=int(user_id)))
        serializer = serializers.ViewWarehousesSerializer(warehouses, many=True)
        return JsonResponse(serializer.data, safe=False)
    
    elif request.method == "POST":
        data = request.data
        data["user"] = int(user_id)
        serializer = serializers.WarehousesSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET", "POST"])
@permission_classes([])
@authentication_classes([])
def fba_inventory(request, user_id = None):
    if request.method == "GET":
        fba_inventory_requests = models.FBAInventoryRequest.objects.filter(user__id=int(user_id))
        serializer = serializers.ViewFBAInventoryRequestSerializer(fba_inventory_requests, many=True)
        return JsonResponse(serializer.data, safe=False)
    
    elif request.method == "POST":
        data = request.data
        data["user"] = int(user_id)
        serializer = serializers.FBAInventoryRequestSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def logistics_registration(request, user_id=None):
    if request.method == 'GET':
        if user_id:
            # Retrieve logistics registrations for a specific user
            registrations = models.LogisticsRegistration.objects.filter(user_id=user_id)
            serializer = serializers.LogisticsRegistrationSerializer(registrations, many=True)
            return JsonResponse(serializer.data, safe=False)
        else:
            # If user_id is not provided, return all registrations
            registrations = models.LogisticsRegistration.objects.all()
            serializer = serializers.LogisticsRegistrationSerializer(registrations, many=True)
            return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = request.data
        data["user"] = int(user_id)
        serializer = serializers.LogisticsRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)