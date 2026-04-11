from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils import timezone
from django.conf import settings
from thefuzz import fuzz
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Service, Benefit, Gallery, Metric, ContactSubmission, SiteSetting, KnowledgeItem, ChatSession, ChatMessage

def homepage(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message_text = request.POST.get('message')
        
        if name and email:
            # Save to Database
            submission = ContactSubmission.objects.create(
                name=name,
                email=email,
                message=message_text or ""
            )
            
            # Send Professional Email Notification
            subject = f'🚀 New Demo Request from {name}'
            admin_url = f"{request.build_absolute_uri('/admin/core/contactsubmission/')}{submission.id}/change/"
            
            context = {
                'name': name,
                'email': email,
                'message': message_text or "No specific message provided.",
                'timestamp': timezone.now(),
                'admin_url': admin_url,
            }
            
            html_content = render_to_string('emails/demo_notification.html', context)
            text_content = strip_tags(html_content)
            
            try:
                email_obj = EmailMultiAlternatives(
                    subject,
                    text_content,
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.NOTIFICATION_EMAIL],
                )
                email_obj.attach_alternative(html_content, "text/html")
                email_obj.send()
            except Exception as e:
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

@csrf_exempt
def chat(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        user_message = data.get('message', '').strip()
        session_id = data.get('session_id')
        
        if not user_message or not session_id:
            return JsonResponse({'error': 'Message and session_id required'}, status=400)
        
        # 1. Get or Create Session
        session, _ = ChatSession.objects.get_or_create(session_id=session_id)
        
        # 2. Save User Message
        ChatMessage.objects.create(session=session, role='user', content=user_message)
        
        # 3. Hybrid Retrieval (RAG Optimized)
        context_items = KnowledgeItem.objects.all()
        scored_context = []
        
        for item in context_items:
            # Rank 1: Exact keyword match (Bonus score)
            keywords = [k.strip().lower() for k in item.keywords.split(',')]
            keyword_match = any(k in user_message.lower() for k in keywords)
            
            # Rank 2: Fuzzy match on sample questions
            max_fuzzy_score = 0
            for question in item.questions:
                score = fuzz.token_set_ratio(user_message.lower(), question.lower())
                if score > max_fuzzy_score:
                    max_fuzzy_score = score
            
            # Combine scores (Keyword match gets a massive boost)
            final_score = max_fuzzy_score
            if keyword_match:
                final_score += 40  # Boost for exact keyword presence
            
            if final_score > 60:  # User requested more than 60%
                scored_context.append((final_score, item))
        
        # Sort by score and take top 3
        scored_context.sort(key=lambda x: x[0], reverse=True)
        relevant_context = ""
        for score, item in scored_context[:3]:
            relevant_context += f"Topic: {item.label}\nAnswer: {item.answer}\n\n"
        
        # 4. Fetch History (Last 5 exchanges)
        history = ChatMessage.objects.filter(session=session).order_by('-timestamp')[:10]
        history_text = ""
        for msg in reversed(history):
            history_text += f"{msg.role.capitalize()}: {msg.content}\n"
        
        # 5. Construct Strict System Prompt
        system_instruction = (
            "You are the official EasyRanch Information Assistant. Your goal is to provide accurate information based ONLY on the EasyRanch Knowledge Base provided below.\n\n"
            "STRICT RULES:\n"
            "1. If the 'Context' section below contains the answer, use it and be concise.\n"
            "2. If the 'Context' does NOT have the answer, politely say: 'I don't have that specific information in my current records. You can contact our team at enquiry@innova8s.com for detailed assistance.'\n"
            "3. Do NOT make up facts or services that are not mentioned in the context.\n"
            "4. Always remain professional, helpful, and ranching-focused.\n\n"
            f"--- CONTEXT ---\n{relevant_context or 'No direct context found. Use generic greeting if just saying hi.'}\n\n"
            f"--- CONVERSATION HISTORY ---\n{history_text}\n"
            f"User: {user_message}"
        )
        
        # 6. Call Gemini API
        payload = {
            "contents": [{"parts": [{"text": system_instruction}]}],
            "generationConfig": {
                "temperature": 0.3, # Lower temperature for better accuracy
                "maxOutputTokens": 400,
            }
        }
        
        response = requests.post(settings.GEMINI_API_URL, json=payload)
        response_data = response.json()
        
        bot_response = "I am having trouble connecting to my service. Please try again in a moment."
        if 'candidates' in response_data:
            bot_response = response_data['candidates'][0]['content']['parts'][0]['text']
        
        # 7. Save Bot Message
        ChatMessage.objects.create(session=session, role='bot', content=bot_response)
        
        return JsonResponse({'response': bot_response})
        
    except Exception as e:
        print(f"Chat Error: {e}")
        return JsonResponse({'error': 'Server error processing chat'}, status=500)