from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, TransactionCategoryViewSet

router = DefaultRouter()
router.register(r'categories', TransactionCategoryViewSet, basename='categories')
router.register(r'', TransactionViewSet, basename='transactions')

urlpatterns = router.urls