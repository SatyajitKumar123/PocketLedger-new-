from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Transaction, TransactionCategory
from .serializers import TransactionSerializer, TransactionCategorySerializer

class TransactionCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TransactionCategory.objects.filter(user=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def reset(self, request):
        """
        Deletes ALL transactions for the logged-in user 
        and resets all their wallet balances to 0.
        """
        # 1. Delete all transactions belonging to this user
        self.get_queryset().delete()

        # 2. Reset all Wallets belonging to this user to 0
        # We access wallets via the user relationship
        request.user.wallets.update(balance=0)

        return Response(
            {"status": "All transactions deleted and balances reset."}, 
            status=status.HTTP_200_OK
        )