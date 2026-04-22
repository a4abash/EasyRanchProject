import os
import django
import json
from django.test import RequestFactory
from unittest.mock import patch
import sys

# Set up Django environment
sys.path.append('/var/www/python/EasyRanchProject')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.views import subscribe_newsletter

def test_newsletter_emails():
    factory = RequestFactory()
    import time
    data = {'email': f'verify_test_{int(time.time())}@example.com'}
    request = factory.post('/subscribe-newsletter/', 
                          data=json.dumps(data), 
                          content_type='application/json',
                          HTTP_HOST='easyranch.ai')
    
    with patch('django.core.mail.EmailMultiAlternatives.send') as mock_send:
        response = subscribe_newsletter(request)
        print(f"Status Code: {response.status_code}")
        print(f"Response Content: {response.content.decode()}")
        print(f"Email send calls: {mock_send.call_count}")
        
        if mock_send.call_count == 2:
            print("SUCCESS: Both subscriber and admin emails were triggered.")
        else:
            print(f"FAILURE: Expected 2 email calls, got {mock_send.call_count}")

if __name__ == "__main__":
    test_newsletter_emails()
