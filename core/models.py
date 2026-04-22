from django.db import models

class Service(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon_class = models.CharField(max_length=50, help_text="FontAwesome class, e.g., 'fas fa-heartbeat'")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class Benefit(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon_class = models.CharField(max_length=50, help_text="FontAwesome class, e.g., 'fas fa-brain'")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class Gallery(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='gallery/')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name_plural = "Galleries"

    def __str__(self):
        return self.title

class Metric(models.Model):
    title = models.CharField(max_length=100, help_text="e.g., 'Reduction in veterinary costs'")
    value = models.CharField(max_length=50, help_text="e.g., '25%'")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.value} {self.title}"

class ContactSubmission(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('REPLIED', 'Replied'),
    ]
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True, null=True)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email} ({self.status})"

class SiteSetting(models.Model):
    # Hero Section
    hero_title = models.CharField(max_length=200, default="Smart Ranch Management Revolution")
    hero_subtitle = models.TextField(default="AI-Powered Livestock Monitoring & Disease Detection for Modern Ranchers")
    hero_logo = models.ImageField(upload_to='site/', blank=True, null=True)
    
    # About Section
    about_title = models.CharField(max_length=200, default="About EasyRanch")
    about_text = models.TextField()
    about_image = models.ImageField(upload_to='site/', blank=True, null=True)
    
    # Contact Info
    address = models.TextField(default="Riff, 45, St George Terrace, Perth, WA 6000")
    phone = models.CharField(max_length=50, default="+61 493 182 200")
    email = models.EmailField(default="enquiry@innova8s.com")
    business_hours = models.TextField(default="Monday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM")
    
    # Social Media
    instagram_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    facebook_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)

    def __str__(self):
        return "Site Configuration"

class KnowledgeItem(models.Model):
    label = models.CharField(max_length=100)
    questions = models.JSONField(help_text="List of sample questions for this item")
    answer = models.TextField()
    keywords = models.TextField(help_text="Comma-separated keywords for retrieval", blank=True)

    def __str__(self):
        return f"[{self.label}] {self.answer[:50]}..."

    class Meta:
        verbose_name = "Knowledge Item"
        verbose_name_plural = "Knowledge Items"

class ChatSession(models.Model):
    session_id = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Session {self.session_id}"

class ChatMessage(models.Model):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('bot', 'Bot'),
    ]
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.role}: {self.content[:30]}..."

class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.email
