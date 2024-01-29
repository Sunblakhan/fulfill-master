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

from collections import Counter
from django.db.models.functions import TruncMonth
from django.db.models import Count


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


@api_view(["GET", "POST", "PUT", "DELETE"])
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
            print("Inside")
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        try:
            # Assuming you're using user_id to find the FBAInventoryRequest
            fba_inventory_request = models.FBAInventoryRequest.objects.get(
                id=int(user_id)
            )
            fba_inventory_request.delete()
            return JsonResponse(
                {"message": "Inventory request deleted successfully."},
                status=status.HTTP_204_NO_CONTENT,
            )
        except models.FBAInventoryRequest.DoesNotExist:
            return JsonResponse(
                {"message": "Object not found."}, status=status.HTTP_404_NOT_FOUND
            )


@api_view(["GET", "POST", "PUT"])
@permission_classes([])
@authentication_classes([])
def fbm_inventory(request, user_id=None):
    if request.method == "GET":
        fbm_inventory_requests = models.FBMInventoryRequest.objects.all().order_by(
            "-timestamp"
        )
        if user_id is not None:
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
                id=request.data.get("id")
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

        serializer = serializers.FBMOrdersSerializer(
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

        serializer = serializers.LogisticsRegistrationSerializer(
            order_request, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST", "PUT"])
@permission_classes([])
@authentication_classes([])
def oneinvoice(request, user_id=None):
    if request.method == "GET":
        if user_id is None:
            return JsonResponse({}, safe=False)
        else:
            warehouses = models.Invoice.objects.get(id=int(user_id))
        serializer = serializers.ViewInvoiceSerializer(warehouses)
        return JsonResponse(serializer.data)


@api_view(["GET", "POST", "PUT"])
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

    elif request.method == "PUT":
        try:
            order_request = models.Invoice.objects.get(id=int(request.data.get("id")))
        except models.Invoice.DoesNotExist:
            return JsonResponse(
                {"message": "Object not found or not a real owner."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if user_id is None:
            print("Logistic update")
        data = request.data
        print(data)

        serializer = serializers.InvoiceSerializer(
            order_request, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def chart_data_view(request, user_id):
    # Ensure user_id is an integer
    user_id = int(user_id)

    # Orders Pie Chart Data
    orders = (
        models.Order.objects.filter(user__id=user_id)
        .values("status")
        .annotate(total=Count("status"))
    )
    pie_labels = [order["status"] for order in orders]
    pie_data = [order["total"] for order in orders]

    # FBM Bar Chart Data
    fbm_data = (
        models.FBMInventoryRequest.objects.filter(user__id=user_id)
        .annotate(month=TruncMonth("timestamp"))
        .values("month", "status")
        .annotate(total=Count("status"))
        .order_by("month")
    )

    # Initialize bar_data dictionary
    bar_labels = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]
    bar_data = {
        choice[0]: [0] * 12 for choice in models.FBMInventoryRequest.STATUS_CHOICES
    }

    for item in fbm_data:
        month_index = item["month"].month - 1
        status = item["status"]
        if status in bar_data:
            bar_data[status][month_index] = item["total"]

    # Structure Final JSON response
    response = {
        "pieChart": {
            "labels": pie_labels,
            "data": pie_data,
        },
        "barChart": {
            "labels": bar_labels,
            "datasets": [
                {
                    "label": status,
                    "data": counts,
                }
                for status, counts in bar_data.items()
            ],
        },
    }

    return JsonResponse(response)
