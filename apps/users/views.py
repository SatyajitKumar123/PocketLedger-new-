from django.contrib.auth import get_user_model
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserCreateSerializer

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny] # Anyone can register
    serializer_class = UserCreateSerializer     # Used for Swagger docs
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)