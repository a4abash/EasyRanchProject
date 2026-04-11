/* ========== 10 Semantic Labels ========== */
const LABELS = [
    "Platform_Overview",
    "IoT_and_Technology",
    "Livestock_Health_and_Disease",
    "Feed_and_Nutrition_Management",
    "Monitoring_and_Tracking",
    "Cost_and_Business_Benefits",
    "Mobile_Access_and_Usability",
    "Data_Privacy_and_Security",
    "Support_Pilot_and_Training",
    "Contact_and_Administration"
];

const LABEL_DESCRIPTIONS = {
    Platform_Overview: "Mission, vision, how it works, general company info.",
    IoT_and_Technology: "Sensors, AI, integrations, satellite, hardware.",
    Livestock_Health_and_Disease: "Health monitoring, disease detection, emergency.",
    Feed_and_Nutrition_Management: "Feeding schedules, nutrition, waste reduction.",
    Monitoring_and_Tracking: "GPS tracking, geofencing, 24/7 monitoring.",
    Cost_and_Business_Benefits: "ROI, savings, pricing, subscriptions.",
    Mobile_Access_and_Usability: "App availability, offline mode, connectivity.",
    Data_Privacy_and_Security: "Data protection, privacy, ownership.",
    Support_Pilot_and_Training: "Pilot program, training, bugs, feedback.",
    Contact_and_Administration: "Location, contact info, business hours."
};

const knowledgeBase = [
  // ===================== Platform Overview =====================
  {
    label: "Platform_Overview",
    keywords: ["easyranch", "company", "about", "brand", "introduction"],
    questions: [
      "What is EasyRanch?",
      "Tell me about your company",
      "Who are you?",
      "What do you do?",
      "Explain EasyRanch"
    ],
    answer:
      "EasyRanch is an online livestock management platform that helps farmers monitor their animals’ health, feeding, and overall farm performance. It provides simple tools, guides, and advisory features to support better decision-making and early disease detection."
  },
  {
    label: "Platform_Overview",
    keywords: ["mission", "goal", "vision", "aim", "purpose"],
    questions: [
      "What is your mission?",
      "What is the goal of this company?",
      "What is your vision for the future?",
      "Why does EasyRanch exist?"
    ],
    answer:
      "Our mission is to help ranchers make better decisions, reduce losses, and improve animal welfare using simple, practical technology tools."
  },
  {
    label: "Platform_Overview",
    keywords: ["revolution", "future", "modern", "smart ranch", "innovation"],
    questions: [
      "How are you changing agriculture?",
      "What is the smart ranch management revolution?",
      "Is this modern farming?"
    ],
    answer:
      "EasyRanch supports modern, data-driven ranch management by turning observations and records into useful insights and guidance for day-to-day farm operations."
  },

  // ===================== How It Works =====================
  {
    label: "Platform_Overview",
    keywords: ["work", "mechanism", "process", "flow", "step", "function", "operate"],
    questions: [
      "How does EasyRanch work?",
      "What is the workflow?",
      "Explain the mechanism",
      "How does the system work step by step?"
    ],
    answer:
      "EasyRanch follows a simple flow: collect farm or livestock information → analyze patterns → show insights and alerts → help farmers take action and track outcomes."
  },

  // ===================== IoT & Technology =====================
  {
    label: "IoT_and_Technology",
    keywords: ["ai", "analytics", "artificial intelligence", "machine learning", "algorithm", "data"],
    questions: [
      "Do you use AI?",
      "How does the analytics work?",
      "What kind of algorithms do you use?",
      "Is there machine learning involved?"
    ],
    answer:
      "In the demo version, EasyRanch answers using a curated FAQ. In later versions, AI/NLP can help match questions by meaning and provide smarter recommendations based on farm data."
  },
  {
    label: "IoT_and_Technology",
    keywords: ["iot", "integration", "device", "connect", "hardware", "farm equipment", "sensor"],
    questions: [
      "Does it work with my existing equipment?",
      "What is IoT integration?",
      "Can I connect other devices?",
      "Is it compatible with my hardware?",
      "Will it integrate with sensors?",
      "Do you support IoT devices?"
    ],
    answer:
      "IoT integration means connecting devices like sensors to collect farm/livestock data automatically. EasyRanch aims to support sensor integration in future versions to improve monitoring and insights."
  },
  {
    label: "IoT_and_Technology",
    keywords: ["satellite", "imagery", "weather", "visual", "map view", "pasture"],
    questions: [
      "Do you use satellite imagery?",
      "Can I see a map view?",
      "Is there weather data?"
    ],
    answer:
      "A future feature is an interactive map view that could include visuals like location/pasture context and weather overlays, depending on data availability and integrations."
  },
  {
    label: "IoT_and_Technology",
    keywords: ["staging", "test", "version", "environment", "beta"],
    questions: [
      "What is the staging environment?",
      "Why is there a test version?",
      "How does staging benefit me?"
    ],
    answer:
      "A staging environment is a test version where new features are checked before releasing to the live site. This helps keep the live platform stable and reduces unexpected bugs."
  },

  // ===================== Livestock Health & Disease =====================
  {
    label: "Livestock_Health_and_Disease",
    keywords: ["disease", "detect", "illness", "sick", "health", "early", "warning"],
    questions: [
      "Can you detect sick animals?",
      "How do I know if a cow is ill?",
      "Does it spot diseases early?",
      "What about animal health monitoring?",
      "My cow is sick"
    ],
    answer:
      "EasyRanch provides general health guidelines, signs to watch for, and advisory information to help farmers identify possible issues early. Future updates will include health monitoring tools and automated alerts."
  },
  {
    label: "Livestock_Health_and_Disease",
    keywords: ["emergency", "health", "issue", "sudden", "vet"],
    questions: [
      "How do you handle emergencies?",
      "What if there is a sudden health issue?",
      "Do you alert the vet?"
    ],
    answer:
      "For emergencies, EasyRanch recommends contacting a veterinarian immediately. Future versions may include automated alerts and structured action checklists for common issues."
  },
  {
    label: "Livestock_Health_and_Disease",
    keywords: ["parameter", "track", "weight", "feeding", "movement", "behaviour"],
    questions: [
      "What health parameters can I track?",
      "Can I track weight?",
      "Do you track movement?"
    ],
    answer:
      "EasyRanch aims to support tracking of feeding patterns, movement behaviour, weight changes, and general health observations. The exact parameters depend on the features and integrations available."
  },
  {
    label: "Livestock_Health_and_Disease",
    keywords: ["livestock", "type", "animal", "sheep", "dairy", "cattle"],
    questions: [
      "Which types of livestock do you support?",
      "Do you support sheep?",
      "Is it for dairy cattle?",
      "What animals can I manage?"
    ],
    answer:
      "EasyRanch currently focuses on sheep and dairy cattle as key use cases, with an expansion path to other livestock types depending on farmer needs and project scope."
  },
  {
    label: "Livestock_Health_and_Disease",
    keywords: ["cow", "cattle", "sheep", "animal", "herd"],
    questions: [
      "Does it work for cows?",
      "What about sheep?",
      "Is it for cattle?",
      "Can I monitor my herd?"
    ],
    answer:
      "Yes — EasyRanch is designed around livestock monitoring concepts and management workflows, especially for cattle and sheep use cases."
  },

  // ===================== Feed & Nutrition =====================
  {
    label: "Feed_and_Nutrition_Management",
    keywords: ["feed", "nutrition", "eat", "food", "waste", "growth", "schedule"],
    questions: [
      "Feeding schedule for cows",
      "How often should I feed my cattle?",
      "Can it help with nutrition?",
      "Do you optimize feed consumption?",
      "What about food waste?"
    ],
    answer:
      "EasyRanch supports feed and nutrition planning concepts by helping farmers record feeding patterns and understand best-practice guidance. Future versions may provide smarter optimisation using analytics."
  },
  {
    label: "Feed_and_Nutrition_Management",
    keywords: ["remind", "task", "schedule", "alert", "notification"],
    questions: [
      "Will it remind me of tasks?",
      "Do you have task reminders?",
      "Can I set alerts for feeding?"
    ],
    answer:
      "Yes. EasyRanch plans to include reminders for feeding, vaccination dates, health checks, and other important activities to support better farm organisation."
  },

  // ===================== Monitoring & Tracking =====================
  {
    label: "Monitoring_and_Tracking",
    keywords: ["monitor", "surveillance", "watch", "24/7", "sensor", "wearable"],
    questions: [
      "How do you monitor the animals?",
      "Is the monitoring 24/7?",
      "Do you use wearable sensors?",
      "What kind of surveillance is it?"
    ],
    answer:
      "EasyRanch aims to support continuous monitoring concepts. With sensors, farms can observe patterns 24/7 and identify unusual behaviour earlier than manual checks."
  },
  {
    label: "Monitoring_and_Tracking",
    keywords: ["track", "gps", "location", "geofence", "movement", "position", "map"],
    questions: [
      "Can I track my cattle?",
      "Does it have GPS?",
      "Can I see where my cows are?",
      "Do you offer geofencing?"
    ],
    answer:
      "Tracking features can include GPS location tracking and geofencing alerts, which help farmers understand livestock movement and reduce the risk of animals going missing."
  },
  {
    label: "Monitoring_and_Tracking",
    keywords: ["insight", "predict", "model", "future", "forecast"],
    questions: [
      "Can you predict future trends?",
      "What are AI powered insights?",
      "Do you offer forecasting?"
    ],
    answer:
      "Future capabilities may include predictive insights, helping farmers spot trends early and plan farm operations more effectively."
  },
  {
    label: "Monitoring_and_Tracking",
    keywords: ["compare", "performance", "monitor", "graph", "trend"],
    questions: [
      "Can I compare performance?",
      "How do I monitor over time?",
      "Are there graphs or trends?"
    ],
    answer:
      "EasyRanch aims to provide dashboards, graphs, and summaries to help farmers compare performance across seasons, herds, or batches."
  },

  // ===================== Cost & Business Benefits =====================
  {
    label: "Cost_and_Business_Benefits",
    keywords: ["cost", "optimization", "profit", "money", "save", "waste", "financial"],
    questions: [
      "How can I save money?",
      "Will this increase my profits?",
      "How do I reduce waste?",
      "Is it cost effective?"
    ],
    answer:
      "EasyRanch supports decision-making that can reduce waste and improve productivity. When issues are detected early and operations are organised, farmers can reduce losses and improve profitability."
  },
  {
    label: "Cost_and_Business_Benefits",
    keywords: ["stats", "numbers", "percent", "result", "proven", "benefit", "why"],
    questions: [
      "What are the results?",
      "Do you have any statistics?",
      "What benefits can I expect?",
      "Why should I choose you?"
    ],
    answer:
      "In a demo setting, we can present expected benefits such as reduced losses, improved monitoring speed, and better farm organisation. Exact statistics depend on field testing and real deployment results."
  },
  {
    label: "Cost_and_Business_Benefits",
    keywords: ["price", "cost", "subscription", "plan"],
    questions: [
      "How much does it cost?",
      "What is the price?",
      "Do you have a subscription plan?",
      "Is it expensive?"
    ],
    answer:
      "EasyRanch is currently in development and pilot testing, so there is no fee for users participating in the early access program. Future pricing, if any, will be communicated clearly."
  },

  // ===================== Mobile Access & Usability =====================
  {
    label: "Mobile_Access_and_Usability",
    keywords: ["mobile", "app", "phone", "responsive", "anywhere", "access", "ios", "android"],
    questions: [
      "Do you have a mobile app?",
      "Can I use it on my phone?",
      "Is there an Android or iOS app?",
      "Can I access data remotely?"
    ],
    answer:
      "EasyRanch is designed with a mobile-first mindset so farmers can access key information quickly. A responsive dashboard helps view updates from anywhere."
  },
  {
    label: "Mobile_Access_and_Usability",
    keywords: ["mobile", "friendly", "offline", "phone", "internet"],
    questions: [
      "Is the website mobile friendly?",
      "Does it work offline?",
      "Can I use it without internet?"
    ],
    answer:
      "Yes, the website is designed to be mobile-friendly. Some features may require internet for live updates, while limited viewing of previously loaded data could be possible."
  },
  {
    label: "Mobile_Access_and_Usability",
    keywords: ["internet", "offline", "connection", "wifi", "access"],
    questions: [
      "What if I lose internet?",
      "Does it work without wifi?",
      "Can I access it offline?"
    ],
    answer:
      "If the internet is lost, live data may not update. Some basic functions like viewing previously loaded information may still work, and syncing can happen when connectivity returns."
  },

  // ===================== Data Privacy & Security =====================
  {
    label: "Data_Privacy_and_Security",
    keywords: ["safe", "privacy", "secure", "protect", "share", "data"],
    questions: [
      "Is my data safe?",
      "How is my privacy protected?",
      "Do you share my data?",
      "What kind of data does EasyRanch collect about my livestock?"
    ],
    answer:
      "All information is stored securely, and only authorized users can access it. Data is never shared with third parties without your permission."
  },

    {
    label: "Data_Privacy_and_Security",
    keywords: ["delete", "unsubscribe", "terminate", "remove", "share", "data"],
    questions: [
      "How do I unsubscribe my account if I no longer use EasyRanch?",
      "How to delete my account?",
      "How to remove my account"
    ],
    answer:
      "You can request account deletion through the settings page (when available) or by contacting the EasyRanch support team.."
  },

  {
    label: "Data_Privacy_and_Security",
    keywords: ["data", "collect", "record", "age", "feeding", "details"],
    questions: [
      "What data do you collect?",
      "What information does it store?",
      "Do you track feeding records?"
    ],
    answer:
      "EasyRanch may store basic details such as livestock type, age, feeding records, movement observations, and health notes. This supports better organisation and future recommendations."
  },

  // ===================== Support, Pilot & Training =====================
  {
    label: "Support_Pilot_and_Training",
    keywords: ["pilot", "program", "western australia", "wa", "join"],
    questions: [
      "Can I join the pilot program?",
      "Is the pilot available in Western Australia?",
      "How do I participate in the pilot?",
      "Can I use EasyRanch if I’m out of Australia?"
    ],
    answer:
      "Yes. EasyRanch can be used by Farmers from anywhere, you can express interest in joining the pilot program via the contact form or email."
  },
  {
    label: "Support_Pilot_and_Training",
    keywords: ["requirement", "criteria", "join", "pilot", "eligible"],
    questions: [
      "What are the requirements to join?",
      "Am I eligible for the pilot?",
      "What do I need to participate?",
      "What requirements do I need to join the EasyRanch pilot program?"
    ],
    answer:
      "You must be an active livestock farmer, willing to share basic farm information, and able to provide feedback on your experience using the platform."
  },
  {
    label: "Support_Pilot_and_Training",
    keywords: ["training", "video", "tutorial", "guide", "learn"],
    questions: [
      "Is there training material?",
      "Do you have video tutorials?",
      "How do I learn to use it?"
    ],
    answer:
      "Yes. EasyRanch can provide onboarding guides, tutorials, and simple step-by-step instructions to support farmers using the platform."
  },
  {
    label: "Support_Pilot_and_Training",
    keywords: ["feedback", "bug", "report", "suggest"],
    questions: [
      "How do I report a bug?",
      "Where can I give feedback?",
      "I found an issue"
    ],
    answer:
      "You can report issues through a feedback form (if available) or email the support team. Farmer feedback helps improve future releases."
  },
  {
    label: "Support_Pilot_and_Training",
    keywords: ["chatbot", "answer", "question", "help", "support"],
    questions: [
      "What if the chatbot can't answer?",
      "The bot didn't help me",
      "I have more questions",
      "What support is available if I need help using EasyRanch?"
    ],
    answer:
      "If the chatbot cannot answer, Support is available through email, More support channels will be added in future updates. enquiry@innova8s.com."
  },
  {
    label: "Support_Pilot_and_Training",
    keywords: ["update", "info", "dashboard", "change", "edit"],
    questions: [
      "How do I update my farm info?",
      "Can I change my livestock details?",
      "How do I edit information?"
    ],
    answer:
      "In future versions, users can update information through a dashboard. During pilot stages, updates may be coordinated manually with the EasyRanch team."
  },
  {
    label: "Support_Pilot_and_Training",
    keywords: ["multiple", "farm", "group", "manage"],
    questions: [
      "Can I manage multiple farms?",
      "Do you support multiple livestock groups?",
      "Can I have more than one farm?"
    ],
    answer:
      "Yes. EasyRanch aims to support multiple farms and livestock groups under one account to simplify management."
  },
  {
    label: "Support_Pilot_and_Training",
    keywords: ["signup", "register", "join", "newsletter"],
    questions: [
      "How do I sign up?",
      "How do I sign up for the EasyRanch platform?",
      "Where can I register?",
      "How do I join the newsletter?"
    ],
    answer:
      "You can sign up directly through the website once registration is available. For now, you can join our newsletter or contact us for updates about the pilot program.."
  },
  {
    label: "Support_Pilot_and_Training",
    keywords: ["newsletter", "update", "benefit", "tip"],
    questions: [
      "Why should I join the newsletter?",
      "What is in the newsletter?",
      "How does the newsletter help?",
      "How will the newsletter subscription help me as a farmer?"
    ],
    answer:
      "The newsletter can provide farming tips, updates on features, and pilot announcements, helping farmers stay informed without checking the website daily."
  },

  // ===================== Contact & Administration =====================
  {
    label: "Contact_and_Administration",
    keywords: ["address", "location", "where", "office", "hq", "city", "perth", "wa","located"],
    questions: [
      "Where are you located?",
      "What is your address?",
      "Where is your office?",
      "Are you in Perth?",
      "location"
    ],
    answer:
      "EasyRanch is located in Perth, WA. For the latest details or visits, please contact the team directly."
  },
  {
    label: "Contact_and_Administration",
    keywords: ["phone", "call", "number", "tel", "contact", "mobile number"],
    questions: [
      "What is your phone number?",
      "How can I call you?",
      "Can I contact you by phone?",
      "Give me your number"
    ],
    answer:
      "For phone contact, please request a demo or use the official contact page. You can also email enquiry@innova8s.com for support."
  },
  {
    label: "Contact_and_Administration",
    keywords: ["email", "mail", "write", "enquiry", "support"],
    questions: [
      "What is your email address?",
      "How can I email you?",
      "Do you have a support email?"
    ],
    answer:
      "You can email the team at enquiry@innova8s.com."
  },
  {
    label: "Contact_and_Administration",
    keywords: ["hours", "open", "time", "day", "business hours", "weekend"],
    questions: [
      "What are your business hours?",
      "When are you open?",
      "Are you open on weekends?"
    ],
    answer:
      "Business hours may vary. For the latest support availability, please contact enquiry@innova8s.com."
  },
  {
    label: "Contact_and_Administration",
    keywords: ["demo", "request", "start", "try", "signup", "sign up"],
    questions: [
      "How do I get started?",
      "Can I request a demo?",
      "I want to sign up",
      "How do I try it?"
    ],
    answer:
      "To get started, request a demo or contact the EasyRanch team via the website contact form or enquiry@innova8s.com."
  },
  {
    label: "Contact_and_Administration",
    keywords: ["service", "product", "offer"],
    questions: [
      "What services do you offer?",
      "What are your products?",
      "Show me your services"
    ],
    answer:
      "EasyRanch focuses on livestock monitoring, tracking concepts, feed planning support, and future-ready analytics features. The exact modules can expand as the platform grows."
  },

  // ===================== Small talk / greetings =====================
  {
    label: "Platform_Overview",
    keywords: ["hi", "hello", "hey", "good morning", "good evening"],
    questions: ["Hi", "Hello", "Good morning", "Good evening", "Hey there"],
    answer:
      "Hello! 👋 I’m the EasyRanch Assistant. Ask me about monitoring, tracking, feeding, pricing, or how the platform works."
  },
  {
    label: "Platform_Overview",
    keywords: ["what are you", "importance", "what do you do"],
    questions: [
      "What are you?",
      "What is your importance?",
      "What do you do?"
    ],
    answer:
      "I’m an AI assistant designed to help users quickly find answers from the EasyRanch FAQ and guide them to support when needed."
  },
  
  {
    label: "Platform_Overview",
    keywords: ["thank", "thanks", "cool", "good","okay"],
    questions: ["Thank you", "Thanks a lot", "That is cool", "Good job"],
    answer:
      "You’re welcome! If you need more help, ask another question or contact enquiry@innova8s.com."
  },
  {
    label: "Platform_Overview",
    keywords: ["bye", "goodbye", "exit"],
    questions: ["Bye", "Goodbye", "See you later", "Exit chat"],
    answer:
      "Goodbye! If you have more questions later, you can always contact enquiry@innova8s.com."
  },
  {
    label: "Platform_Overview",
    keywords: ["how are you","what is your name"],
    questions: ["how are you","what is your name"],
    answer:
      "I am Easyranch, I'm good. Ask me queries related to services."
  }
];
