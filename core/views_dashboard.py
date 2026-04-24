from django.shortcuts import get_object_or_404, redirect
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
from django.views.generic import CreateView, DeleteView, ListView, TemplateView, UpdateView
from django.urls import reverse_lazy
from core.models import Benefit, ContactSubmission, Gallery, KnowledgeItem, Metric, NewsletterSubscriber, Service, SiteSetting
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin


class DashboardHome(LoginRequiredMixin, TemplateView):
    login_url = '/portal/'
    template_name = 'dashboard/home.html'


class StaffRequiredMixin:
    @method_decorator(staff_member_required(login_url='admin:login'))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)


class DashboardFormFeedbackMixin:
    success_message = "Saved successfully."
    error_message = "Please correct the highlighted errors and try again."

    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, self.success_message)
        return response

    def form_invalid(self, form):
        messages.error(self.request, self.error_message)
        return super().form_invalid(form)


class DashboardDeleteFeedbackMixin:
    delete_success_message = "Deleted successfully."

    def delete(self, request, *args, **kwargs):
        messages.success(request, self.delete_success_message)
        return super().delete(request, *args, **kwargs)


class DashboardHome(StaffRequiredMixin, TemplateView):
    template_name = 'dashboard/home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['stats'] = {
            'subscribers_total': NewsletterSubscriber.objects.count(),
            'subscribers_active': NewsletterSubscriber.objects.filter(is_active=True).count(),
            'leads_total': ContactSubmission.objects.count(),
            'leads_unread': ContactSubmission.objects.filter(status='PENDING').count(),
            'knowledge_items': KnowledgeItem.objects.count(),
            'services': Service.objects.count(),
        }
        context['recent_leads'] = ContactSubmission.objects.order_by('-created_at')[:5]
        context['recent_subscribers'] = NewsletterSubscriber.objects.order_by('-created_at')[:5]
        return context


class DashboardSubscriberListView(StaffRequiredMixin, ListView):
    model = NewsletterSubscriber
    template_name = 'dashboard/subscribers.html'
    context_object_name = 'items'
    paginate_by = 20
    ordering = ['-created_at']


class DashboardLeadListView(StaffRequiredMixin, ListView):
    model = ContactSubmission
    template_name = 'dashboard/leads.html'
    context_object_name = 'items'
    paginate_by = 15
    ordering = ['-created_at']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['stats'] = {
            'leads_unread': ContactSubmission.objects.filter(status='PENDING').count(),
        }
        return context


@staff_member_required(login_url='admin:login')
def dashboard_subscriber_toggle(request, pk):
    subscriber = get_object_or_404(NewsletterSubscriber, pk=pk)
    subscriber.is_active = not subscriber.is_active
    subscriber.save(update_fields=['is_active'])
    messages.success(request, f"{subscriber.email} status updated.")
    return redirect('dashboard_subscribers')


@staff_member_required(login_url='admin:login')
def dashboard_subscriber_delete(request, pk):
    subscriber = get_object_or_404(NewsletterSubscriber, pk=pk)
    email = subscriber.email
    subscriber.delete()
    messages.success(request, f"{email} deleted.")
    return redirect('dashboard_subscribers')


@staff_member_required(login_url='admin:login')
def dashboard_lead_mark_replied(request, pk):
    lead = get_object_or_404(ContactSubmission, pk=pk)
    lead.status = 'REPLIED'
    lead.save(update_fields=['status'])
    messages.success(request, f"Lead from {lead.name} marked as replied.")
    return redirect('dashboard_leads')


@staff_member_required(login_url='admin:login')
def dashboard_lead_delete(request, pk):
    lead = get_object_or_404(ContactSubmission, pk=pk)
    name = lead.name
    lead.delete()
    messages.success(request, f"Lead from {name} deleted.")
    return redirect('dashboard_leads')


class DashboardKnowledgeListView(StaffRequiredMixin, ListView):
    model = KnowledgeItem
    template_name = 'dashboard/knowledge_base.html'
    context_object_name = 'items'
    paginate_by = 15


class DashboardKnowledgeCreateView(DashboardFormFeedbackMixin, StaffRequiredMixin, CreateView):
    model = KnowledgeItem
    template_name = 'dashboard/knowledge_form.html'
    fields = ['label', 'questions', 'answer', 'keywords']
    success_url = reverse_lazy('dashboard_knowledge')
    success_message = "Knowledge item added successfully."
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = "Add Knowledge"
        return context


class DashboardKnowledgeUpdateView(DashboardFormFeedbackMixin, StaffRequiredMixin, UpdateView):
    model = KnowledgeItem
    template_name = 'dashboard/knowledge_form.html'
    fields = ['label', 'questions', 'answer', 'keywords']
    success_url = reverse_lazy('dashboard_knowledge')
    success_message = "Knowledge item updated successfully."
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = "Edit Knowledge"
        return context


class DashboardKnowledgeDeleteView(DashboardDeleteFeedbackMixin, StaffRequiredMixin, DeleteView):
    model = KnowledgeItem
    success_url = reverse_lazy('dashboard_knowledge')
    delete_success_message = "Knowledge item deleted successfully."

    def get(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)


class DashboardServiceListView(StaffRequiredMixin, ListView):
    model = Service
    template_name = 'dashboard/services.html'
    context_object_name = 'items'
    ordering = ['order']
    paginate_by = 15

class DashboardServiceCreateView(DashboardFormFeedbackMixin, StaffRequiredMixin, CreateView):
    model = Service
    template_name = 'dashboard/service_form.html'
    fields = ['title', 'description', 'icon_class', 'order']
    success_url = reverse_lazy('dashboard_services')
    success_message = "Service added successfully."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = "Add Service"
        return context


class DashboardServiceUpdateView(DashboardFormFeedbackMixin, StaffRequiredMixin, UpdateView):
    model = Service
    template_name = 'dashboard/service_form.html'
    fields = ['title', 'description', 'icon_class', 'order']
    success_url = reverse_lazy('dashboard_services')
    success_message = "Service updated successfully."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = "Edit Service"
        return context


class DashboardServiceDeleteView(DashboardDeleteFeedbackMixin, StaffRequiredMixin, DeleteView):
    model = Service
    success_url = reverse_lazy('dashboard_services')
    delete_success_message = "Service deleted successfully."

    def get(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)


class DashboardBenefitListView(StaffRequiredMixin, ListView):
    model = Benefit
    template_name = 'dashboard/benefits.html'
    context_object_name = 'items'
    paginate_by = 15


class DashboardBenefitCreateView(DashboardFormFeedbackMixin, StaffRequiredMixin, CreateView):
    model = Benefit
    template_name = 'dashboard/benefit_form.html'
    fields = ['title', 'description', 'icon_class', 'order']
    success_url = reverse_lazy('dashboard_benefits')
    success_message = "Benefit added successfully."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = "Add Benefit"
        return context


class DashboardBenefitUpdateView(DashboardFormFeedbackMixin, StaffRequiredMixin, UpdateView):
    model = Benefit
    template_name = 'dashboard/benefit_form.html'
    fields = ['title', 'description', 'icon_class', 'order']
    success_url = reverse_lazy('dashboard_benefits')
    success_message = "Benefit updated successfully."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = "Edit Benefit"
        return context


class DashboardBenefitDeleteView(DashboardDeleteFeedbackMixin, StaffRequiredMixin, DeleteView):
    model = Benefit
    success_url = reverse_lazy('dashboard_benefits')
    delete_success_message = "Benefit deleted successfully."

    def get(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)


class DashboardMetricListView(StaffRequiredMixin, ListView):
    model = Metric
    template_name = 'dashboard/metrics.html'
    context_object_name = 'items'
    paginate_by = 15


class DashboardMetricCreateView(DashboardFormFeedbackMixin, StaffRequiredMixin, CreateView):
    model = Metric
    template_name = 'dashboard/metric_form.html'
    fields = ['title', 'value', 'order']
    success_url = reverse_lazy('dashboard_metrics')
    success_message = "Metric added successfully."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = "Add Metric"
        return context


class DashboardMetricUpdateView(DashboardFormFeedbackMixin, StaffRequiredMixin, UpdateView):
    model = Metric
    template_name = 'dashboard/metric_form.html'
    fields = ['title', 'value', 'order']
    success_url = reverse_lazy('dashboard_metrics')
    success_message = "Metric updated successfully."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = "Edit Metric"
        return context


class DashboardMetricDeleteView(DashboardDeleteFeedbackMixin, StaffRequiredMixin, DeleteView):
    model = Metric
    success_url = reverse_lazy('dashboard_metrics')
    delete_success_message = "Metric deleted successfully."

    def get(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)


class DashboardGalleryListView(StaffRequiredMixin, ListView):
    model = Gallery
    template_name = 'dashboard/gallery.html'
    context_object_name = 'items'
    paginate_by = 15


class DashboardGalleryCreateView(DashboardFormFeedbackMixin, StaffRequiredMixin, CreateView):
    model = Gallery
    template_name = 'dashboard/gallery_form.html'
    fields = ['title', 'description', 'image', 'order']
    success_url = reverse_lazy('dashboard_gallery')
    success_message = "Gallery item added successfully."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = "Add Gallery Item"
        return context


class DashboardGalleryUpdateView(DashboardFormFeedbackMixin, StaffRequiredMixin, UpdateView):
    model = Gallery
    template_name = 'dashboard/gallery_form.html'
    fields = ['title', 'description', 'image', 'order']
    success_url = reverse_lazy('dashboard_gallery')
    success_message = "Gallery item updated successfully."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = "Edit Gallery Item"
        return context


class DashboardGalleryDeleteView(DashboardDeleteFeedbackMixin, StaffRequiredMixin, DeleteView):
    model = Gallery
    success_url = reverse_lazy('dashboard_gallery')
    delete_success_message = "Gallery item deleted successfully."

    def get(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)


class DashboardSettingUpdateView(DashboardFormFeedbackMixin, StaffRequiredMixin, UpdateView):
    model = SiteSetting
    template_name = 'dashboard/settings.html'
    fields = [
        'hero_title', 'hero_subtitle', 'hero_logo',
        'about_title', 'about_text', 'about_image',
        'address', 'phone', 'email', 'business_hours',
        'instagram_url', 'twitter_url', 'facebook_url', 'linkedin_url',
    ]
    success_url = reverse_lazy('dashboard_home')
    success_message = "Site settings updated successfully."

    def get_object(self, queryset=None):
        obj = SiteSetting.objects.first()
        if obj is None:
            obj = SiteSetting.objects.create(
                about_text="EasyRanch combines AI and IoT to simplify ranch operations."
            )
        return obj

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = "Site Settings"
        return context
