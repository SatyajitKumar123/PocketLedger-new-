from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Transaction, TransactionCategory

User = get_user_model()

@receiver(post_save, sender=Transaction)
def update_wallet_balance_on_add(sender, instance, created, **kwargs):
    """When a transaction is created, update the wallet balance."""
    if created:
        wallet = instance.wallet
        if instance.type == "INCOME":
            wallet.balance += instance.amount
        else:
            wallet.balance -= instance.amount
        wallet.save()

@receiver(post_save, sender=Transaction)
def update_wallet_balance_on_delete(sender, instance, **kwargs):
    """When a transaction is deleted, revert the wallet balance."""
    wallet = instance.wallet
    if instance.type == "INCOME":
        wallet.balance -= instance.amount
    else:
        wallet.balance += instance.amount
    wallet.save()

# --- NEW: Default Categories Logic ---
@receiver(post_save, sender=User)
def create_default_categories(sender, instance, created, **kwargs):
    """Create default categories for every new user."""
    if created:
        defaults = [
            "Food", "Rent", "Salary", "Shopping", 
            "Transport", "Entertainment", "Health", "Investment"
        ]
        for name in defaults:
            TransactionCategory.objects.create(
                user=instance, 
                name=name, 
                icon="default" # You can map icons later if you want
            )