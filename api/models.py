from django.db import models
from authentication.models import CustomUsers
import uuid
import hashlib

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
        ("pending", "Pending"),
        ("requested", "Requested"),
        ("acknowledged", "Acknowledged"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    RECEIVED_STATUS_CHOICES = [
        ("inventoryReceived", "Inventory Received"),
        ("notReceivedYet", "Not Received yet"),
    ]

    warehouse = models.ForeignKey(
        CustomUsers,
        related_name="user_logistic_fba",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    user = models.ForeignKey(
        CustomUsers, related_name="user_fba", on_delete=models.CASCADE
    )
    totalSKU = models.PositiveIntegerField(default=0)
    totalBoxes = models.PositiveIntegerField(default=0)
    nameOnInventory = models.CharField(max_length=255)
    companyName = models.CharField(max_length=255)
    packageComingFrom = models.TextField(help_text="Amazon eBay Walmart")
    pdf = models.FileField(upload_to="orders/", null=True, blank=True)
    comments = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
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

    def save(self, *args, **kwargs):
        if self.pdf:
            # Generate a UUID, then hash it and take the first 12 characters
            uuid_str = str(uuid.uuid4())
            hash_str = hashlib.sha256(uuid_str.encode()).hexdigest()[:12]
            self.uniqueHash = hash_str
            self.pdf.name = f"{self.pdf.name.split('.')[0]}_fba_{self.uniqueHash}.{self.pdf.name.split('.')[-1]}"
        super(FBAInventoryRequest, self).save(*args, **kwargs)


class FBMInventoryRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("requested", "Requested"),
        ("acknowledged", "Acknowledged"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    RECEIVED_STATUS_CHOICES = [
        ("inventoryReceived", "Inventory Received"),
        ("notReceivedYet", "Not Received yet"),
    ]

    warehouse = models.ForeignKey(
        CustomUsers,
        related_name="user_logistic_fbm",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    user = models.ForeignKey(
        CustomUsers, related_name="user_fbm", on_delete=models.CASCADE
    )
    totalSKU = models.PositiveIntegerField(default=0)
    totalBoxes = models.PositiveIntegerField(default=0)
    nameOnInventory = models.CharField(max_length=255)
    companyName = models.CharField(max_length=255)
    packageComingFrom = models.TextField(help_text="Amazon eBay Walmart")
    comments = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
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
        ("pending", "Pending"),
        ("requested", "Requested"),
        ("acknowledged", "Acknowledged"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]
    user = models.ForeignKey(
        CustomUsers, on_delete=models.DO_NOTHING, blank=True, null=True
    )
    product = models.ForeignKey(FBMInventoryRequest, on_delete=models.CASCADE)
    labelType = models.CharField(
        max_length=15, choices=LABEL_TYPES, default="labelYourself"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    trackingNumber = models.TextField(blank=True)
    pdf = models.FileField(upload_to="orders/")
    prep = models.TextField(blank=True)
    expectedDeliveryDate = models.DateField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.pdf:
            # Generate a UUID, then hash it and take the first 12 characters
            uuid_str = str(uuid.uuid4())
            hash_str = hashlib.sha256(uuid_str.encode()).hexdigest()[:12]
            self.uniqueHash = hash_str
            self.pdf.name = f"{self.pdf.name.split('.')[0]}_order_{self.uniqueHash}.{self.pdf.name.split('.')[-1]}"
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

    warehouse = models.ForeignKey(
        CustomUsers,
        related_name="user_logistic",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    user = models.ForeignKey(
        CustomUsers, related_name="user_to_add", on_delete=models.CASCADE
    )
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
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(
        CustomUsers, related_name="user_invoices", on_delete=models.CASCADE
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="pending", null=True, blank=True
    )
    products = models.TextField(default="[]")
    pdf = models.FileField(upload_to="orders/", blank=True, null=True)
    total = models.PositiveBigIntegerField(default=0)
    comments = models.TextField(default="", blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.total)

    class Meta:
        verbose_name_plural = "Invoices"

    def save(self, *args, **kwargs):
        if self.pdf:
            # Generate a UUID, then hash it and take the first 12 characters
            uuid_str = str(uuid.uuid4())
            hash_str = hashlib.sha256(uuid_str.encode()).hexdigest()[:12]
            self.uniqueHash = hash_str
            self.pdf.name = f"{self.pdf.name.split('.')[0]}_invoice_{self.uniqueHash}.{self.pdf.name.split('.')[-1]}"
        super(Invoice, self).save(*args, **kwargs)
