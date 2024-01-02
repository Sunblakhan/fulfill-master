from django.contrib import admin
from . import models

# Register your models here.

admin.site.register(models.Warehouses)
admin.site.register(models.FBAInventoryRequest)
admin.site.register(models.Order)
admin.site.register(models.LogisticsRegistration)
admin.site.register(models.Invoice)