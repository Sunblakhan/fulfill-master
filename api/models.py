from django.db import models
from authentication.models import CustomUsers

# Create your models here.

class Warehouses(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(CustomUsers, null=True, blank=True, on_delete=models.CASCADE)
    isGlobal = models.BooleanField(default=False)

class FBAInventoryRequest(models.Model):
    STATUS_CHOICES = [
        ('requested', 'Requested'),
        ('accepted', 'Accepted'),
        ('cancelled', 'Cancelled'),
        ('declined', 'Declined'),
        ('error', 'Error'),
    ]

    RECEIVED_STATUS_CHOICES = [
        ('inventoryReceived', 'Inventory Received'),
        ('notReceivedYet', 'Not Received yet'),
    ]

    user = models.ForeignKey(CustomUsers, on_delete=models.CASCADE)
    warehouse = models.ForeignKey(Warehouses, on_delete=models.CASCADE)
    totalSKU = models.PositiveIntegerField(default=0)
    totalBoxes = models.PositiveIntegerField(default=0)
    nameOnInventory = models.CharField(max_length=255)
    companyName = models.CharField(max_length=255)
    packageComingFrom = models.TextField(help_text="Amazon eBay Walmart")
    comments = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='requested')
    trackingNumber = models.CharField(max_length=50, blank=True, null=True)
    receivedStatus = models.CharField(max_length=20, choices=RECEIVED_STATUS_CHOICES, default='notReceivedYet')
    logisticsComments = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.nameOnInventory} - {self.companyName}"


class LogisticsRegistration(models.Model):
    BRANCH_CHOICES = [("fba", "FBA"), ("fbm", "FBM")]
    TYPE_CHOICES = [("oa", "OA"), ("wholesale", "Wholesale")]
    MINIMUM_INVENTORY_CHOICES = [("0-30", "0-30"), ("50-100", "50-100"), ("100<", "100<")]

    user = models.ForeignKey(CustomUsers, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    businessName = models.CharField(max_length=255)
    businessAddress = models.CharField(max_length=500)
    branch = models.CharField(max_length=3, choices=BRANCH_CHOICES, default="fba")
    type = models.CharField(max_length=9, choices=TYPE_CHOICES, default="oa")
    minimumInventory = models.CharField(max_length=8, choices=MINIMUM_INVENTORY_CHOICES, default="0-30")

    def __str__(self):
        return self.name