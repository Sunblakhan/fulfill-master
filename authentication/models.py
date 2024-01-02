from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The email field must be set")
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class CustomUsers(AbstractUser):
    username = models.CharField(max_length=256, null=True, blank=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=2048)
    name = models.CharField(max_length=256)
    address = models.CharField(max_length=500)
    companyName = models.CharField(max_length=256)
    phone = models.CharField(max_length=50)
    mode_choices = [("seller", "Seller"), ("logistic", "Logistic")]
    mode = models.CharField(max_length=8, choices=mode_choices, default="seller")
    timestamp = models.DateTimeField(auto_now_add=True)

    # Set USERNAME_FIELD to 'email'
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # List other required fields here

    def __str__(self):
        return self.email

    # Optionally, remove the username field if not used elsewhere
    # username = None
