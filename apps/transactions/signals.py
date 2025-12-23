from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Transaction

@receiver(post_save, sender=Transaction)
def update_wallet_balance_on_add(sender, instance, created, **kwargs):
    """
    When a transaction is created, update the wallet balance.
    """
    if created:
        wallet = instance.wallet
        if instance.type == "INCOME":
            wallet.balance += instance.amount
        else:
            wallet.balance -= instance.amount
        wallet.save()

@receiver(post_delete, sender=Transaction)
def update_wallet_balance_on_delete(sender, instance, **kwargs):
    """
    When a transaction is deleted, revert the wallet balance.
    """
    wallet = instance.wallet
    if instance.type == "INCOME":
        wallet.balance -= instance.amount # Remove income
    else:
        wallet.balance += instance.amount # Refund expense
    wallet.save()