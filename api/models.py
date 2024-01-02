from django.db import models
from authentication.models import CustomUsers
import uuid

# Create your models here.


class Warehouses(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(
        CustomUsers, null=True, blank=True, on_delete=models.CASCADE
    )
    isGlobal = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Warehouses"


class FBAInventoryRequest(models.Model):
    STATUS_CHOICES = [
        ("requested", "Requested"),
        ("accepted", "Accepted"),
        ("cancelled", "Cancelled"),
        ("declined", "Declined"),
        ("error", "Error"),
    ]

    RECEIVED_STATUS_CHOICES = [
        ("inventoryReceived", "Inventory Received"),
        ("notReceivedYet", "Not Received yet"),
    ]

    user = models.ForeignKey(CustomUsers, on_delete=models.CASCADE)
    warehouse = models.ForeignKey(Warehouses, on_delete=models.CASCADE)
    totalSKU = models.PositiveIntegerField(default=0)
    totalBoxes = models.PositiveIntegerField(default=0)
    nameOnInventory = models.CharField(max_length=255)
    companyName = models.CharField(max_length=255)
    packageComingFrom = models.TextField(help_text="Amazon eBay Walmart")
    comments = models.TextField(null=True, blank=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="requested"
    )
    trackingNumber = models.CharField(max_length=50, blank=True, null=True)
    receivedStatus = models.CharField(
        max_length=20, choices=RECEIVED_STATUS_CHOICES, default="notReceivedYet"
    )
    logisticsComments = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nameOnInventory} - {self.companyName}"

    class Meta:
        verbose_name_plural = "FBA Inventory Requests"


class FBMInventoryRequest(models.Model):
    STATUS_CHOICES = [
        ("requested", "Requested"),
        ("accepted", "Accepted"),
        ("cancelled", "Cancelled"),
        ("declined", "Declined"),
        ("error", "Error"),
    ]

    RECEIVED_STATUS_CHOICES = [
        ("inventoryReceived", "Inventory Received"),
        ("notReceivedYet", "Not Received yet"),
    ]

    user = models.ForeignKey(CustomUsers, on_delete=models.CASCADE)
    warehouse = models.ForeignKey(Warehouses, on_delete=models.CASCADE)
    totalSKU = models.PositiveIntegerField(default=0)
    totalBoxes = models.PositiveIntegerField(default=0)
    nameOnInventory = models.CharField(max_length=255)
    companyName = models.CharField(max_length=255)
    packageComingFrom = models.TextField(help_text="Amazon eBay Walmart")
    comments = models.TextField(null=True, blank=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="requested"
    )
    trackingNumber = models.CharField(max_length=50, blank=True, null=True)
    receivedStatus = models.CharField(
        max_length=20, choices=RECEIVED_STATUS_CHOICES, default="notReceivedYet"
    )
    logisticsComments = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nameOnInventory} - {self.companyName}"

    class Meta:
        verbose_name_plural = "FBM Inventory Requests"


class Order(models.Model):
    LABEL_TYPES = [
        ("labelYourself", "Label Yourself"),
        ("provideLabel", "Provide Label"),
    ]
    STATUS_CHOICES = [
        ("requested", "Requested"),
        ("acknowledged", "Acknowledged"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("error", "Error"),
    ]
    user = models.ForeignKey(
        CustomUsers, on_delete=models.DO_NOTHING, blank=True, null=True
    )
    product = models.ForeignKey(FBMInventoryRequest, on_delete=models.CASCADE)
    labelType = models.CharField(
        max_length=15, choices=LABEL_TYPES, default="labelYourself"
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="requested"
    )
    trackingNumber = models.TextField(blank=True)
    pdf = models.FileField(upload_to="orders/")
    prep = models.TextField(blank=True)
    expectedDeliveryDate = models.DateField()
    uniqueHash = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.pdf:
            self.pdf.name = f"{self.pdf.name.split('.')[0]}_{self.uniqueHash}.{self.pdf.name.split('.')[-1]}"
        super(Order, self).save(*args, **kwargs)

    class Meta:
        verbose_name_plural = "FBM Orders"


class LogisticsRegistration(models.Model):
    BRANCH_CHOICES = [("fba", "FBA"), ("fbm", "FBM")]
    TYPE_CHOICES = [("oa", "OA"), ("wholesale", "Wholesale")]
    STATUS_CHOICES = [("reject", "Reject"), ("approve", "Approve")]
    MINIMUM_INVENTORY_CHOICES = [
        ("0-30", "0-30"),
        ("50-100", "50-100"),
        ("100<", "100<"),
    ]

    user = models.ForeignKey(CustomUsers, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    businessName = models.CharField(max_length=255)
    businessAddress = models.CharField(max_length=500)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="", null=True, blank=True
    )
    branch = models.CharField(max_length=3, choices=BRANCH_CHOICES, default="fba")
    type = models.CharField(
        max_length=9, choices=TYPE_CHOICES, default="", null=True, blank=True
    )
    minimumInventory = models.CharField(
        max_length=8,
        choices=MINIMUM_INVENTORY_CHOICES,
        default="0-30",
        blank=True,
        null=True,
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Logistic Registrations"


class Invoice(models.Model):
    user = models.ForeignKey(
        CustomUsers, related_name="user_invoices", on_delete=models.CASCADE
    )
    # creator = models.ForeignKey(
    #     CustomUsers,
    #     related_name="created_invoices",
    #     on_delete=models.CASCADE,
    #     null=True,
    #     blank=True,
    # )
    products = models.TextField(default="[]")
    total = models.PositiveBigIntegerField(default=0)
    comments = models.TextField(default="", blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.total)

    class Meta:
        verbose_name_plural = "Invoices"
