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
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email}"

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

    class Meta:
        verbose_name = "Site Setting"
        verbose_name_plural = "Site Settings"
