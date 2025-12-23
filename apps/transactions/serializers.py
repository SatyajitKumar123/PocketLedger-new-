from rest_framework import serializers
from .models import Transaction, TransactionCategory
from apps.wallets.models import Wallet

class TransactionCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionCategory
        fields = ["id", "name", "icon"]
        read_only_fields = ["id"]

    def validate(self, data):
        # Check uniqueness manually because 'user' is injected hiddenly
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            name = data.get("name")
            if TransactionCategory.objects.filter(user=request.user, name=name).exists():
                raise serializers.ValidationError({"name": "You already have a category with this name."})
        return data

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)

class TransactionSerializer(serializers.ModelSerializer):
    # Fix: Tell DRF to accept UUIDs ('id') instead of internal Integers ('pkid')
    category = serializers.SlugRelatedField(
        slug_field='id', 
        queryset=TransactionCategory.objects.all()
    )
    wallet = serializers.SlugRelatedField(
        slug_field='id', 
        queryset=Wallet.objects.all()
    )

    # Read-only fields for display
    category_name = serializers.CharField(source="category.name", read_only=True)
    wallet_name = serializers.CharField(source="wallet.name", read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "id", "amount", "type", "description", 
            "date", "category", "category_name", 
            "wallet", "wallet_name", "created_at"
        ]

    def validate(self, data):
        # Security Check: Ensure the wallet belongs to the user
        if data.get("wallet") and data["wallet"].user != self.context["request"].user:
            raise serializers.ValidationError("You cannot use a wallet that doesn't belong to you.")
        return data

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)