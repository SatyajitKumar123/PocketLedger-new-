from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _ 
from apps.core.models import TimeStampedUUIDModel


User = get_user_model()

class Profile(TimeStampedUUIDModel):
    user = models.OneToOneField(User, related_name="profile", on_delete=models.CASCADE)
    bio = models.TextField(verbose_name=_("Bio"), blank=True, default="")
    gender = models.CharField(
        verbose_name=_("Gender"),
        max_length=20,
        choices=[("MALE", "Male"), ("FEMALE", "Female"), ("OTHER", "Other")],
        default="OTHER"
    )
    country = models.CharField(verbose_name=_("Country"), max_length=100, default="India", blank=True)

    def __str__(self):
        return f"{self.user.first_name}'s Profile"