from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.core.models import TimeStampedUUIDModel
from apps.wallets.models import Wallet

User = get_user_model()

class TransactionCategory(TimeStampedUUIDModel):
    user = models.ForeignKey(User, related_name="categories", on_delete=models.CASCADE)
    name = models.CharField(verbose_name=_("Category Name"), max_length=50)
    icon = models.CharField(max_length=20, default="default-icon") # Just a string for now (e.g. "fa-home")
    
    class Meta:
        verbose_name_plural = "Transaction Categories"
        unique_together = ["user", "name"]

    def __str__(self):
        return self.name

class Transaction(TimeStampedUUIDModel):
    TRANSACTION_TYPES = [
        ("INCOME", "Income"),
        ("EXPENSE", "Expense"),
    ]

    user = models.ForeignKey(User, related_name="transactions", on_delete=models.CASCADE)
    wallet = models.ForeignKey(Wallet, related_name="transactions", on_delete=models.CASCADE)
    category = models.ForeignKey(TransactionCategory, related_name="transactions", on_delete=models.SET_NULL, null=True)
    
    amount = models.DecimalField(verbose_name=_("Amount"), max_digits=12, decimal_places=2)
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPES, default="EXPENSE")
    description = models.CharField(max_length=255, blank=True)
    date = models.DateField()

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.type} - {self.amount} ({self.description})"