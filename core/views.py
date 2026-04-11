from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from .models import Service, Benefit, Gallery, Metric, ContactSubmission, SiteSetting

def homepage(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message_text = request.POST.get('message')
        
        if name and email:
            # Save to Database
            ContactSubmission.objects.create(
                name=name,
                email=email,
                message=message_text or ""
            )
            
            # Send Email Notification
            subject = f'New Demo Request from {name}'
            email_message = f'Name: {name}\nEmail: {email}\n\nMessage:\n{message_text}'
            try:
                send_mail(
                    subject,
                    email_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.NOTIFICATION_EMAIL],
                    fail_silently=False,
                )
            except Exception as e:
                # Log error or handle silently for now
                print(f"Error sending email: {e}")

            messages.success(request, 'Your request for a demo has been sent successfully!')
            return redirect('homepage')

    # Get Site Settings (create default if missing)
    site_config, created = SiteSetting.objects.get_or_create(id=1)
    if created:
        site_config.about_text = "EasyRanch combines cutting-edge artificial intelligence, IoT sensors, and mobile technology to create the most comprehensive ranch management platform available today."
        site_config.save()

    context = {
        'services': Service.objects.all(),
        'benefits': Benefit.objects.all(),
        'galleries': Gallery.objects.all(),
        'metrics': Metric.objects.all(),
        'config': site_config,
    }
    return render(request, 'homepage.html', context)