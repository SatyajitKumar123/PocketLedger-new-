from rest_framework import viewsets, permissions
from rest_framework.exceptions import NotFound
from .models import Wallet
from .serializers import WalletSerializer

class WalletViewSet(viewsets.ModelViewSet):
    serializer_class = WalletSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "id"

    def get_queryset(self):
        # 1. Standard list for the main page
        return Wallet.objects.filter(user=self.request.user)

    def get_object(self):
        """
        Custom 'Finder' to fix the 404 Not Found error.
        We manually grab the ID and search the database directly.
        """
        # 1. Grab the ID from the URL (e.g., 'f1f6...')
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        pk = self.kwargs.get(lookup_url_kwarg)

        # 2. Search for the wallet belonging to this user
        # We use .filter().first() because it is safer than .get()
        obj = Wallet.objects.filter(id=pk, user=self.request.user).first()

        # 3. If not found, raise the 404 error manually
        if obj is None:
            raise NotFound(f"Wallet with ID {pk} not found for this user.")

        # 4. Check permissions (standard DRF check)
        self.check_object_permissions(self.request, obj)

        return obj