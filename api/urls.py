# your_app/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('warehouses', views.warehouse, name='warehouse-list'),
    path('warehouses/<int:user_id>', views.warehouse, name='warehouse-list'),
    path('fba-inventory-requests', views.fba_inventory, name='fba-inventory-request-list'),
    path('fba-inventory-requests/<int:user_id>', views.fba_inventory, name='fba-inventory-request-list'),
    path('logistics-registration', views.logistics_registration, name='logistics_registration'),
    path('logistics-registration/<int:user_id>', views.logistics_registration, name='logistics_registration_user'),
]
