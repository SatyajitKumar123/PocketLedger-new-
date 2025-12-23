from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.core.models import TimeStampedUUIDModel

User = get_user_model()

class Wallet(TimeStampedUUIDModel):
    WALLET_TYPES = [
        ("BANK", "Bank Account"),
        ("CASH", "Cash"),
        ("MOBILE", "Mobile Money"),
        ("CRYPTO", "Crypto Wallet"),
        ("OTHER", "Other"),
    ]

    user = models.ForeignKey(User, related_name="wallets", on_delete=models.CASCADE)
    name = models.CharField(verbose_name=_("Wallet Name"), max_length=50)
    type = models.CharField(verbose_name=_("Wallet Type"), max_length=20, choices=WALLET_TYPES, default="BANK")
    currency = models.CharField(verbose_name=_("Currency"), max_length=3, default="INR")
    balance = models.DecimalField(verbose_name=_("Balance"), max_digits=12, decimal_places=2, default=0.00)
    is_default = models.BooleanField(default=False)

    class Meta:
        unique_together = ["user", "name"] # Prevent duplicate wallet names for same user
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.currency})"

    def save(self, *args, **kwargs):
        # Logic: If this is marked as default, unmark all other wallets for this user
        if self.is_default:
            Wallet.objects.filter(user=self.user, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)