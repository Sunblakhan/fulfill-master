# views.py
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status
from . import models
from . import serializers
from authentication.models import CustomUsers
from django.db.models import Q


def initialize_backend():
    try:
        # Check if admin exists
        admin_exists = CustomUsers.objects.filter(email="admin@admin.com").exists()
        if not admin_exists:
            # Add admin user
            CustomUsers.objects.create_user(
                password="admin",
                email="admin@admin.com",
                username="admin",
                is_staff=True,
                is_superuser=True,
            )
            print("[INITIALIZATION][SUCCESS]: Admin user added")
        else:
            print("[INITIALIZATION][EXISTS]: Admin user already exists")
    except Exception as e:
        print("[INITIALIZATION][ERROR]:", str(e))


# Call the function to initialize the backend
initialize_backend()


@api_view(["GET", "POST"])
@permission_classes([])
@authentication_classes([])
def warehouse(request, user_id=None):
    if request.method == "GET":
        warehouses = models.Warehouses.objects.filter(
            Q(isGlobal=True) | Q(user__id=int(user_id))
        )
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


@api_view(["GET", "POST", "PUT"])
@permission_classes([])
@authentication_classes([])
def fba_inventory(request, user_id=None):
    if request.method == "GET":
        fba_inventory_requests = models.FBAInventoryRequest.objects.all().order_by(
            "-timestamp"
        )
        if user_id is not None:
            fba_inventory_requests = models.FBAInventoryRequest.objects.filter(
                user__id=int(user_id)
            ).order_by("-timestamp")
        serializer = serializers.ViewFBAInventoryRequestSerializer(
            fba_inventory_requests, many=True
        )
        return JsonResponse(serializer.data, safe=False)

    elif request.method == "POST":
        data = request.data
        data["user"] = int(user_id)
        serializer = serializers.FBAInventoryRequestSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "PUT":
        try:
            fba_inventory_request = models.FBAInventoryRequest.objects.get(
                id=request.data.get("id")
            )
        except models.FBAInventoryRequest.DoesNotExist:
            return JsonResponse(
                {"message": "Object not found or not a real owner."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = serializers.FBAInventoryRequestSerializer(
            fba_inventory_request, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST", "PUT"])
@permission_classes([])
@authentication_classes([])
def fbm_inventory(request, user_id=None):
    if request.method == "GET":
        fbm_inventory_requests = models.FBMInventoryRequest.objects.filter(
            user__id=int(user_id)
        ).order_by("-timestamp")
        serializer = serializers.ViewFBMInventoryRequestSerializer(
            fbm_inventory_requests, many=True
        )
        return JsonResponse(serializer.data, safe=False)

    elif request.method == "POST":
        data = request.data
        data["user"] = int(user_id)
        serializer = serializers.FBMInventoryRequestSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "PUT":
        try:
            fbm_inventory_request = models.FBMInventoryRequest.objects.get(
                user__id=int(user_id), id=request.data.get("id")
            )
        except models.FBMInventoryRequest.DoesNotExist:
            return JsonResponse(
                {"message": "Object not found or not a real owner."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = serializers.FBMInventoryRequestSerializer(
            fbm_inventory_request, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST", "PUT"])
@permission_classes([])
@authentication_classes([])
def fbm_orders(request, user_id=None):
    if request.method == "GET":
        orders = models.Order.objects.all().order_by("-timestamp")
        if user_id is not None:
            orders = models.Order.objects.filter(user__id=int(user_id)).order_by(
                "-timestamp"
            )
        serializer = serializers.ViewFBMOrdersSerializer(orders, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == "POST":
        data = request.data
        data["user"] = int(user_id)
        serializer = serializers.FBMOrdersSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "PUT":
        try:
            order_request = models.Order.objects.get(id=request.data.get("id"))
        except models.Order.DoesNotExist:
            return JsonResponse(
                {"message": "Object not found or not a real owner."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if user_id is None:
            print("Logistic update")
        data = request.data
        print(data)

        serializer = serializers.ViewFBMOrdersSerializer(
            order_request, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST", "PUT"])
def logistics_registration(request, user_id=None):
    if request.method == "GET":
        if user_id:
            # Retrieve logistics registrations for a specific user
            registrations = models.LogisticsRegistration.objects.filter(
                user_id=user_id
            ).order_by("-timestamp")
            serializer = serializers.ViewLogisticsRegistrationSerializer(
                registrations, many=True
            )
            return JsonResponse(serializer.data, safe=False)
        else:
            # If user_id is not provided, return all registrations
            registrations = models.LogisticsRegistration.objects.all().order_by(
                "-timestamp"
            )
            serializer = serializers.ViewLogisticsRegistrationSerializer(
                registrations, many=True
            )
            return JsonResponse(serializer.data, safe=False)

    elif request.method == "POST":
        data = request.data
        data["user"] = int(user_id)
        serializer = serializers.LogisticsRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "PUT":
        try:
            order_request = models.LogisticsRegistration.objects.get(
                id=request.data.get("id")
            )
        except models.LogisticsRegistration.DoesNotExist:
            return JsonResponse(
                {"message": "Object not found or not a real owner."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if user_id is None:
            print("Logistic update")
        data = request.data
        print(data)

        serializer = serializers.ViewLogisticsRegistrationSerializer(
            order_request, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST"])
@permission_classes([])
@authentication_classes([])
def invoice(request, user_id=None):
    if request.method == "GET":
        if user_id is None:
            warehouses = models.Invoice.objects.all().order_by("-timestamp")
        else:
            warehouses = models.Invoice.objects.filter(user__id=int(user_id)).order_by(
                "-timestamp"
            )
        serializer = serializers.ViewInvoiceSerializer(warehouses, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == "POST":
        data = request.data
        serializer = serializers.InvoiceSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
