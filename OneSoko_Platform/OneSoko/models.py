import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.

class Shop(models.Model):
    """class shop
    shopname
    shopowner
    list of products
    location
    created_date
    uuid 
    """
    uuid = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
        db_index=True,
        verbose_name="Unique ID"
    )
    shopname = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Location"
        )
    
    shopowner = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='shops',
        verbose_name='Shop Owner'
    )

    location = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name= 'Location'
    )
    created_date = models.DateTimeField(
        default=timezone.now,
        verbose_name='date created'
        )
    update_date = models.DateTimeField(

    )

