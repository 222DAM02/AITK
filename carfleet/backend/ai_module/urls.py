from django.urls import path
from .views import AIGenerateView, AIHistoryView, AISaveAsItemView, FetchDataView, KnowledgeBaseListView, KnowledgeBaseStatsView
urlpatterns = [
    path('generate/', AIGenerateView.as_view()),
    path('history/', AIHistoryView.as_view()),
    path('save/', AISaveAsItemView.as_view()),
    path('fetch-data/', FetchDataView.as_view()),
    path('knowledge/', KnowledgeBaseListView.as_view()),
    path('knowledge/stats/', KnowledgeBaseStatsView.as_view()),
]
