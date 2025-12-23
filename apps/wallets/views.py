from rest_framework import viewsets, permissions
from .models import Wallet
from .serializers import WalletSerializer

class WalletViewSet(viewsets.ModelViewSet):
    serializer_class = WalletSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show the logged-in user's wallets
        return Wallet.objects.filter(user=self.request.user)