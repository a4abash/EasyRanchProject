"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from core import views, views_dashboard

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.homepage, name='homepage'),
    path('chat/', views.chat, name='chat'),
    path('subscribe-newsletter/', views.subscribe_newsletter, name='subscribe_newsletter'),
    path('unsubscribe/', views.unsubscribe_newsletter, name='unsubscribe_newsletter'),

    # Custom Dashboard
    path('dashboard/', views_dashboard.DashboardHome.as_view(), name='dashboard_home'),
    path('dashboard/subscribers/', views_dashboard.DashboardSubscriberListView.as_view(), name='dashboard_subscribers'),
    path('dashboard/leads/', views_dashboard.DashboardLeadListView.as_view(), name='dashboard_leads'),
    path('dashboard/knowledge/', views_dashboard.DashboardKnowledgeListView.as_view(), name='dashboard_knowledge'),
    path('dashboard/knowledge/add/', views_dashboard.DashboardKnowledgeCreateView.as_view(), name='dashboard_knowledge_add'),
    path('dashboard/knowledge/<int:pk>/edit/', views_dashboard.DashboardKnowledgeUpdateView.as_view(), name='dashboard_knowledge_edit'),
    path('dashboard/knowledge/<int:pk>/delete/', views_dashboard.DashboardKnowledgeDeleteView.as_view(), name='dashboard_knowledge_delete'),
    path('dashboard/services/', views_dashboard.DashboardServiceListView.as_view(), name='dashboard_services'),
    path('dashboard/services/add/', views_dashboard.DashboardServiceCreateView.as_view(), name='dashboard_services_add'),
    path('dashboard/services/<int:pk>/edit/', views_dashboard.DashboardServiceUpdateView.as_view(), name='dashboard_services_edit'),
    path('dashboard/services/<int:pk>/delete/', views_dashboard.DashboardServiceDeleteView.as_view(), name='dashboard_services_delete'),
    path('dashboard/benefits/', views_dashboard.DashboardBenefitListView.as_view(), name='dashboard_benefits'),
    path('dashboard/benefits/add/', views_dashboard.DashboardBenefitCreateView.as_view(), name='dashboard_benefits_add'),
    path('dashboard/benefits/<int:pk>/edit/', views_dashboard.DashboardBenefitUpdateView.as_view(), name='dashboard_benefits_edit'),
    path('dashboard/benefits/<int:pk>/delete/', views_dashboard.DashboardBenefitDeleteView.as_view(), name='dashboard_benefits_delete'),
    path('dashboard/metrics/', views_dashboard.DashboardMetricListView.as_view(), name='dashboard_metrics'),
    path('dashboard/metrics/add/', views_dashboard.DashboardMetricCreateView.as_view(), name='dashboard_metrics_add'),
    path('dashboard/metrics/<int:pk>/edit/', views_dashboard.DashboardMetricUpdateView.as_view(), name='dashboard_metrics_edit'),
    path('dashboard/metrics/<int:pk>/delete/', views_dashboard.DashboardMetricDeleteView.as_view(), name='dashboard_metrics_delete'),
    path('dashboard/gallery/', views_dashboard.DashboardGalleryListView.as_view(), name='dashboard_gallery'),
    path('dashboard/gallery/add/', views_dashboard.DashboardGalleryCreateView.as_view(), name='dashboard_gallery_add'),
    path('dashboard/gallery/<int:pk>/edit/', views_dashboard.DashboardGalleryUpdateView.as_view(), name='dashboard_gallery_edit'),
    path('dashboard/gallery/<int:pk>/delete/', views_dashboard.DashboardGalleryDeleteView.as_view(), name='dashboard_gallery_delete'),
    path('dashboard/settings/', views_dashboard.DashboardSettingUpdateView.as_view(), name='dashboard_settings'),
    path('dashboard/subscribers/<int:pk>/toggle/', views_dashboard.dashboard_subscriber_toggle, name='dashboard_subscriber_toggle'),
    path('dashboard/subscribers/<int:pk>/delete/', views_dashboard.dashboard_subscriber_delete, name='dashboard_subscriber_delete'),
    path('dashboard/leads/<int:pk>/replied/', views_dashboard.dashboard_lead_mark_replied, name='dashboard_lead_mark_replied'),
    path('dashboard/leads/<int:pk>/delete/', views_dashboard.dashboard_lead_delete, name='dashboard_lead_delete'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
