from django.urls import path
from .views import AIGenerateView, AIHistoryView, AISaveAsItemView, FetchDataView, KnowledgeBaseListView, KnowledgeBaseStatsView

urlpatterns = [
    path('generate/', AIGenerateView.as_view(), name='ai-generate'),
    path('history/', AIHistoryView.as_view(), name='ai-history'),
    path('save/', AISaveAsItemView.as_view(), name='ai-save'),
    path('fetch-data/', FetchDataView.as_view(), name='ai-fetch-data'),
    path('knowledge/', KnowledgeBaseListView.as_view(), name='ai-knowledge'),
    path('knowledge/stats/', KnowledgeBaseStatsView.as_view(), name='ai-knowledge-stats'),
]
