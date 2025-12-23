from rest_framework import serializers
from .models import Wallet

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ["id", "name", "type", "currency", "balance", "is_default", "created_at"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        # Automatically assign the logged-in user to the wallet
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)