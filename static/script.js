// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Fade in animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el);
  });
});

// Form submission using Google Apps Script
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      // Validate required fields
      if (!name || !email) {
        alert("Please fill in all required fields (Name and Email).");
        return;
      }

      // Prepare data for Google Apps Script
      const formData = {
        timestamp: new Date().toISOString(),
        source: "EasyRanch",
        name: name,
        email: email,
        message: message || "No additional message",
      };

      // Show loading state
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = "Sending...";
      submitButton.disabled = true;

      // Google Apps Script Web App URL (replace with your deployed URL)
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbyLv1TKeo-paZE_zwjxmB5daPScK3ibFmlGOe3IyKrZt3-wVNA3YKJBThUHGF0aBgog/exec";

      // Send data to Google Apps Script
      fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          // Since we're using no-cors, we can't read the response
          // But we can assume success if no error is thrown
          console.log("Form submitted successfully");

          // Show success message
          alert(
            "Thank you for your interest! We have received your demo request and will contact you soon. Please check your email for a confirmation message.",
          );

          // Reset form
          form.reset();
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          alert(
            "There was an error submitting your request. Please try again or contact us directly.",
          );
        })
        .finally(() => {
          // Reset button state
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        });
    });
  }
});

// ============================================
// CHATBOT FUNCTIONALITY
// ============================================

// API Keys
const WEATHER_API_KEY = "d04cb1b27eeb0b5fd7319c4440863b45";
const GOOGLE_VISION_API_KEY = "AIzaSyB8Dny4Nub2UuYVZ_Wt1-rZ54JwLD8oof8";
const GOOGLE_VISION_API_URL =
  "https://vision.googleapis.com/v1/images:annotate";

// Chatbot State
let currentService = null;
let chatbotMode = "selection"; // 'selection', 'gemini', 'classic'
let currentLanguage = "english";
let uploadedFile = null;

/* ========== Gemini API Config ========== */
const API_KEY = "AIzaSyDe953ba4ewsRCs7Nlv_fKmJjOALhENBOs";
const MODEL = "gemini-2.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

/* ========== 10 Semantic Labels ========== */
// LABELS, LABEL_DESCRIPTIONS, and knowledgeBase are now in dataset.js


// Initialize Chatbot
document.addEventListener("DOMContentLoaded", function () {
  initializeChatbot();
});

function initializeChatbot() {
  const chatbotToggle = document.getElementById("chatbotToggle");
  const chatbotContainer = document.getElementById("chatbotContainer");
  const chatbotClose = document.getElementById("chatbotClose");
  const chatbotSend = document.getElementById("chatbotSend");
  const chatbotInput = document.getElementById("chatbotInput");
  const chatbotAttach = document.getElementById("chatbotAttach");
  const fileUpload = document.getElementById("fileUpload");

  if (!chatbotToggle || !chatbotContainer) return;

  // Toggle chatbot
  chatbotToggle.addEventListener("click", () => {
    chatbotContainer.classList.toggle("active");
    if (chatbotContainer.classList.contains("active")) {
      chatbotInput.focus();
      if (document.getElementById("chatbotMessages").children.length === 0) {
        showWelcomeMessage();
      }
    }
  });

  // Close chatbot
  chatbotClose.addEventListener("click", () => {
    chatbotContainer.classList.remove("active");
  });

  // Send message on Enter
  chatbotInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Send button
  chatbotSend.addEventListener("click", sendMessage);

  // File upload
  chatbotAttach.addEventListener("click", () => {
    fileUpload.click();
  });

  fileUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadedFile = file;
      showFilePreview(file);

      // Auto-process if service is active
      if (file.type.startsWith("image/")) {
        if (currentService === "diagnosis" || diagnosisCategory) {
          diagnosePlant(file, diagnosisCategory);
        } else if (currentService === "identifier" || identificationCategory) {
          identifyPlant(file, identificationCategory);
        } else {
          addBotMessage(
            "Please select a service first (Diagnosis or Identification) and choose a category before uploading an image.",
          );
        }
      } else if (file.type === "application/pdf") {
        if (currentService === "pdf") {
          processPDF(file);
        } else {
          addBotMessage(
            "Please select PDF service (service 7) before uploading a PDF file.",
          );
        }
      } else {
        addBotMessage(
          "❌ Unsupported file type. Please upload an image (JPG, PNG) or PDF file.",
        );
      }
    }
  });

  // Request notification permission
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function showWelcomeMessage() {
  const welcomeMessage = `
        <div style="font-size:1.05em; line-height:1.4;">
            <strong>Hi there!🌟</strong><br><br>
            I'm your EasyRanch AI Assistant. How can I help you today?<br><br>
            Please select an option:<br><br>
            <div class="service-buttons">
                <button class="service-btn" onclick="window.setChatbotMode('gemini')">1. Ask me anything 🤖</button>
                <button class="service-btn" onclick="window.setChatbotMode('classic')">2. Explore more 🔍</button>
            </div>
        </div>
    `;
  addBotMessage(welcomeMessage);
}

// Global function for buttons
window.setChatbotMode = function (mode) {
  console.log("Setting mode:", mode);
  chatbotMode = mode;
  if (mode === "gemini") {
    addUserMessage("Ask me anything");
    addBotMessage(
      "I'm ready! Ask me any question about farming, livestock, or general ranching advice.",
    );
  } else {
    addUserMessage("Explore more");
    showServices();
  }
};

function addBotMessage(message) {
  const messagesContainer = document.getElementById("chatbotMessages");
  if (!messagesContainer) return;

  const messageDiv = document.createElement("div");
  messageDiv.className = "message bot";
  messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">${message}</div>
    `;
  messagesContainer.appendChild(messageDiv);
  scrollToBottom();
}

function addUserMessage(message) {
  const messagesContainer = document.getElementById("chatbotMessages");
  if (!messagesContainer) return;

  const messageDiv = document.createElement("div");
  messageDiv.className = "message user";
  messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="message-content">${message}</div>
    `;
  messagesContainer.appendChild(messageDiv);
  scrollToBottom();
}

/* ===================== HELPER FUNCTIONS ===================== */
function safeText(s) {
  return String(s ?? "").trim();
}

function getItemLabel(item) {
  return (
    item?.label ||
    item?.semanticLabel ||
    item?.semantic_label ||
    item?.category ||
    item?.topic ||
    ""
  );
}

function normalizeLabel(lab) {
  const x = safeText(lab);
  if (LABELS.includes(x)) return x;
  const hit = LABELS.find((L) => L.toLowerCase() === x.toLowerCase());
  return hit || "Platform_Overview";
}

/* Index FAQs by label */
function buildLabelIndex() {
  const index = new Map();
  if (typeof knowledgeBase === "undefined" || !Array.isArray(knowledgeBase))
    return index;

  for (const item of knowledgeBase) {
    const lab = normalizeLabel(getItemLabel(item));
    if (!index.has(lab)) index.set(lab, []);
    index.get(lab).push(item);
  }
  return index;
}

const LABEL_INDEX = buildLabelIndex();


let conversationHistory = [];
const MAX_HISTORY = 10; // Keep last 10 turns

/* ===================== RAG-LITE CONTEXT RETRIEVAL ===================== */
function retrieveRelevantFAQs(query) {
  if (typeof knowledgeBase === "undefined" || !Array.isArray(knowledgeBase)) return "";

  const queryLower = query.toLowerCase();

  // Score each item based on relevance
  const scoredItems = knowledgeBase.map(item => {
    let score = 0;
    const keywords = Array.isArray(item.keywords) ? item.keywords : [];
    const questions = Array.isArray(item.questions) ? item.questions : [];

    // Keyword matches (high value)
    keywords.forEach(k => {
      if (k && queryLower.includes(k.toLowerCase())) score += 3;
    });

    // Question matches (very high value)
    questions.forEach(q => {
      const qLower = q.toLowerCase();
      if (qLower === queryLower) score += 10;
      else if (qLower.includes(queryLower) || queryLower.includes(qLower)) score += 5;
    });

    // Label match (context boost)
    if (item.label && queryLower.includes(item.label.toLowerCase().replace(/_/g, ' '))) score += 2;

    return { item, score };
  });

  // Sort by score and take top 8
  scoredItems.sort((a, b) => b.score - a.score);
  const topItems = scoredItems.filter(x => x.score > 0).slice(0, 8);

  // Also include a few random items from different labels for variety/discovery if query is vague
  if (topItems.length < 3) {
    // Logic could be added here, but for now we'll stick to strict relevance to reduce hallucinations
  }

  // Format context
  let context = "Relevant FAQ Information:\n";
  topItems.forEach((entry, i) => {
    const { item } = entry;
    const qs = Array.isArray(item.questions) ? item.questions.slice(0, 3).join(" / ") : item.questions;
    context += `${i + 1}) Q: ${qs}\n   A: ${item.answer}\n   Category: ${item.label}\n\n`;
  });

  return context;
}


/* ===================== GEMINI LOGIC ===================== */
async function geminiAnswer(userMessage, mode = "gemini") {

  // 1. Build System Instruction & Context
  let systemInstruction = "";
  let contextData = "";

  if (mode === "gemini") {
    // "Ask me anything" mode - General Farm Persona + strict FAQ data
    contextData = retrieveRelevantFAQs(userMessage);
    systemInstruction =
      "You are EasyRanch Assistant, an AI expert in farming, livestock, and the EasyRanch platform.\n" +
      "Role & Behavior:\n" +
      "- helpful, friendly, and concise (1-3 paragraphs).\n" +
      "- Answer based on the provided FAQ Information if relevant.\n" +
      "- If the FAQ info effectively answers the user, prioritze it.\n" +
      "- If the user asks general farming questions (e.g. 'how to feed a cow'), use your general knowledge but keep it practical for a rancher.\n" +
      "- If you don't know, suggest contacting support at enquiry@innova8s.com.\n" +
      "- NEVER mention 'internal context', 'labels', or 'FAQ data' to the user. Just answer naturally.\n\n" +
      contextData;

  } else {
    // "Explore more" (FAQ) mode - Stricter adherence to data
    contextData = retrieveRelevantFAQs(userMessage); // Use dynamic retrieval here too!
    systemInstruction =
      "You are EasyRanch Assistant. Answer ONLY using the provided FAQ Information below.\n" +
      "If the answer is not in the context, say 'I'm not sure about that specific detail. Please contact enquiry@innova8s.com'.\n\n" +
      contextData;
  }

  // 2. Manage History
  // Add user message to history
  conversationHistory.push({ role: "user", parts: [{ text: userMessage }] });

  // Prepare payload with history (trimmed)
  const historyToSend = conversationHistory.slice(-MAX_HISTORY);

  // Insert system instruction as the VERY FIRST part of the prompt structure for Gemini 1.5/flash
  // Note: Gemini API effectively treats the first 'user' message as context or uses specific system_instruction field.
  // For v1beta/models/gemini-pro, system instructions are often best placed in the first content part or separate field.
  // Here we will prepend it to the latest user message or use the system_instruction field if supported by the endpoint variant.
  // We'll stick to prepending to the first message of the session or just sending as a 'user' message first if we want to be safe,
  // BUT effectively we want the context to be fresh. 

  // Strategy: Send System Instruction + History
  // We will construct the `contents` array.

  // To ensure the context is effective, we prepend the system instruction to the LAST user message (the current one),
  // because the model pays most attention to the latest prompt. 
  // OR we can send it as a separate ephemeral turn. 

  // Let's go with: History (previous) + [System+CurrentQuery]

  const contents = [];

  // a) Add previous history (excluding current simplified 'user' push which we just did—wait, we pushed it. Let's pop it for the payload construction or clean it up)
  // Actually, let's keep `conversationHistory` as just the raw conversation.
  // We will construct the API payload specifically.

  // Add previous turns
  const previousTurns = conversationHistory.slice(0, conversationHistory.length - 1).slice(-(MAX_HISTORY - 1));
  contents.push(...previousTurns);

  // b) Add current turn with system instruction injected
  const currentTurn = {
    role: "user",
    parts: [{ text: systemInstruction + "\n\nUser Question: " + userMessage }]
  };
  contents.push(currentTurn);


  const payload = {
    contents: contents,
    generationConfig: {
      temperature: 0.4, // Balance between creative and strict
      maxOutputTokens: 500,
    }
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      if (res.status === 429) return { ok: false, reason: "RATE_LIMIT" };
      return { ok: false, reason: `API_ERROR_${res.status}` };
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";

    // 3. Update History with Model Response
    if (text) {
      conversationHistory.push({ role: "model", parts: [{ text: text }] });
    }

    return {
      ok: true,
      text: safeText(text) || "Sorry, I couldn’t generate a response.",
    };
  } catch (e) {
    return { ok: false, reason: "NETWORK_ERROR" };
  }
}

function localFallback(userMessage) {
  if (typeof knowledgeBase === "undefined" || !Array.isArray(knowledgeBase)) {
    return "I’m not sure about your Query. Please contact support at enquiry@innova8s.com.";
  }

  const msg = userMessage.toLowerCase();
  let best = null;
  let bestScore = 0;

  for (const item of knowledgeBase) {
    const keywords = Array.isArray(item.keywords) ? item.keywords : [];
    const qs = Array.isArray(item.questions) ? item.questions : [];
    const haystack = (keywords.join(" ") + " " + qs.join(" ")).toLowerCase();

    // score: count overlaps
    let score = 0;
    for (const k of keywords) {
      const kk = String(k).toLowerCase();
      if (kk && msg.includes(kk)) score += 3;
    }
    if (haystack.includes(msg)) score += 5;

    // small boost if any question phrase matches partially
    for (const q of qs) {
      const qq = String(q).toLowerCase();
      if (qq && msg.length > 3 && qq.includes(msg)) score += 2;
    }

    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  if (best && bestScore >= 3) return best.answer;
  return "I’m not sure about your Query. Please contact support at enquiry@innova8s.com.";
}

function sendMessage() {
  const input = document.getElementById("chatbotInput");
  const message = input.value.trim();

  if (!message) return;

  addUserMessage(message);
  input.value = "";

  // Show loading
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "message bot";
  loadingDiv.id = "loadingMessage";
  loadingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="loading">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
  document.getElementById("chatbotMessages").appendChild(loadingDiv);
  scrollToBottom();

  // Process message
  setTimeout(() => {
    handleServiceRequest(message);
    const loadingMsg = document.getElementById("loadingMessage");
    if (loadingMsg) loadingMsg.remove();
  }, 500);
}

function handleServiceRequest(message) {
  const lowerMessage = message.toLowerCase().trim();

  // Reset/Home command
  if (
    lowerMessage === "exit" ||
    lowerMessage === "menu" ||
    lowerMessage === "home" ||
    lowerMessage === "start"
  ) {
    chatbotMode = "selection";
    showWelcomeMessage();
    return;
  }

  // MODE: SELECTION
  if (chatbotMode === "selection") {
    if (
      lowerMessage === "1" ||
      lowerMessage.includes("ask") ||
      lowerMessage.includes("gemini")
    ) {
      window.setChatbotMode("gemini");
    } else if (
      lowerMessage === "2" ||
      lowerMessage.includes("explore") ||
      lowerMessage.includes("services")
    ) {
      window.setChatbotMode("classic");
    } else {
      addBotMessage(
        "Please select an option:<br>1. Ask me anything<br>2. Explore more",
      );
    }
    return;
  }

  // MODE: GEMINI (Ask me anything)
  if (chatbotMode === "gemini") {
    // We'll call the async geminiAnswer, but since this function is usually sync, we'll handle promise here.
    // The 'thinking' animation is handled in sendMessage for 500ms, but API takes longer.
    // We really should add a persistent loading indicator.

    // Let's re-add a loading indicator since the previous one from sendMessage might be gone
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "message bot";
    loadingDiv.id = "geminiLoading";
    loadingDiv.innerHTML = `
            <div class="message-avatar"><i class="fas fa-robot"></i></div>
            <div class="message-content"><div class="loading"><span></span><span></span><span></span></div></div>
        `;
    const messagesContainer = document.getElementById("chatbotMessages");
    if (messagesContainer) {
      messagesContainer.appendChild(loadingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    geminiAnswer(message, "gemini")
      .then((res) => {
        const l = document.getElementById("geminiLoading");
        if (l) l.remove();

        if (res.ok) {
          addBotMessage(res.text);
        } else {
          addBotMessage(localFallback(message));
        }
        addBotMessage(
          "<br><small>Type <strong>'exit'</strong> to return to main menu.</small>",
        );
      })
      .catch((err) => {
        const l = document.getElementById("geminiLoading");
        if (l) l.remove();
        addBotMessage(localFallback(message));
        addBotMessage(
          "<br><small>Type <strong>'exit'</strong> to return to main menu.</small>",
        );
      });
    return;
  }

  // MODE: CLASSIC (Explore more)

  // If user greets the bot, show all services in a single message
  if (
    lowerMessage === "hi" ||
    lowerMessage === "hello" ||
    lowerMessage === "hey"
  ) {
    showServices();
    return;
  }

  // Language selection
  if (lowerMessage.includes("tamil") || lowerMessage.includes("தமிழ்")) {
    currentLanguage = "tamil";
    addBotMessage("Language changed to Tamil / மொழி தமிழாக மாற்றப்பட்டது");
    return;
  }
  if (lowerMessage.includes("english") || lowerMessage.includes("help")) {
    currentLanguage = "english";
    showServices();
    return;
  }

  // Service routing
  if (
    lowerMessage === "1" ||
    (lowerMessage.includes("weather") && !lowerMessage.includes("forecast"))
  ) {
    currentService = "weather";
    addBotMessage(
      '🌤️ <strong>Live Weather Updates</strong><br>Please provide your location (city name) or type "my location" to use GPS.',
    );
    return;
  }

  if (lowerMessage === "2" || lowerMessage.includes("forecast")) {
    currentService = "forecast";
    addBotMessage(
      '📅 <strong>5-Day Weather Forecast</strong><br>Please provide your location (city name) or type "my location" to use GPS.',
    );
    return;
  }

  if (
    lowerMessage === "3" ||
    lowerMessage.includes("care") ||
    lowerMessage.includes("tips")
  ) {
    currentService = "care";
    addBotMessage(
      '💡 <strong>Care Tips</strong><br>Select a category:<br><div class="service-buttons"><button class="service-btn" onclick="window.sendCareTips(\'crops\')">Crops</button><button class="service-btn" onclick="window.sendCareTips(\'livestock\')">Livestock</button><button class="service-btn" onclick="window.sendCareTips(\'poultry\')">Poultry</button></div>',
    );
    return;
  }

  if (
    lowerMessage === "4" ||
    lowerMessage.includes("weight") ||
    lowerMessage.includes("cattle")
  ) {
    currentService = "weight";
    addBotMessage(
      "⚖️ <strong>Cattle Weight Estimation</strong><br>Please provide measurements in this format:<br><code>girth: 180, length: 150, type: dairy cow</code><br><br>Available types: dairy cow, beef cattle, calf, bull, heifer",
    );
    return;
  }

  if (
    lowerMessage === "5" ||
    lowerMessage.includes("nearby") ||
    lowerMessage.includes("services")
  ) {
    currentService = "nearby";
    addBotMessage(
      '📍 <strong>Nearby Services Finder</strong><br>What service are you looking for?<br><div class="service-buttons"><button class="service-btn" onclick="window.findService(\'vet\')">Vet Clinic</button><button class="service-btn" onclick="window.findService(\'feed\')">Feed Store</button><button class="service-btn" onclick="window.findService(\'market\')">Market</button></div>',
    );
    return;
  }

  if (
    lowerMessage === "6" ||
    lowerMessage.includes("price") ||
    lowerMessage.includes("commodity")
  ) {
    currentService = "prices";
    addBotMessage(
      "💰 <strong>Commodity Prices</strong><br>Which commodity price would you like to check?<br>Examples: tomato, rice, wheat, milk, eggs, chicken",
    );
    return;
  }

  if (
    lowerMessage === "7" ||
    lowerMessage.includes("pdf") ||
    lowerMessage.includes("document")
  ) {
    currentService = "pdf";
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      processPDF(uploadedFile);
    } else {
      addBotMessage(
        "📄 <strong>PDF Document Summary</strong><br>Please upload a PDF file using the 📎 button.",
      );
    }
    return;
  }

  if (
    lowerMessage === "8" ||
    lowerMessage.includes("diagnosis") ||
    lowerMessage.includes("disease")
  ) {
    currentService = "diagnosis";
    addBotMessage(
      '🔬 <strong>Disease Diagnosis</strong><br>Select category and upload an image:<br><div class="service-buttons"><button class="service-btn" onclick="window.startDiagnosis(\'livestock\')">Livestock</button><button class="service-btn" onclick="window.startDiagnosis(\'poultry\')">Poultry</button><button class="service-btn" onclick="window.startDiagnosis(\'crops\')">Crops</button></div><br>Then click the 📎 button to upload an image.',
    );
    return;
  }

  if (
    lowerMessage === "9" ||
    lowerMessage.includes("identify") ||
    lowerMessage.includes("species")
  ) {
    currentService = "identifier";
    addBotMessage(
      '🌿 <strong>Species Identification</strong><br>Select category and upload an image:<br><div class="service-buttons"><button class="service-btn" onclick="window.startIdentification(\'livestock\')">Livestock</button><button class="service-btn" onclick="window.startIdentification(\'poultry\')">Poultry</button><button class="service-btn" onclick="window.startIdentification(\'crops\')">Crops</button></div><br>Then click the 📎 button to upload an image.',
    );
    return;
  }

  // Handle service-specific inputs
  if (currentService === "weather") {
    getLiveWeather(message);
    return;
  }

  if (currentService === "forecast") {
    get5DayForecast(message);
    return;
  }

  if (currentService === "weight") {
    calculateCattleWeight(message);
    return;
  }

  if (currentService === "prices") {
    getCommodityPrices(message);
    return;
  }

  // Default response for Classic Mode
  showCorrection(
    "general",
    "Unrecognized input.",
    'Type a service number (1-9) or try: "1" for weather, "8" for diagnosis, or "help" to see services.<br>Type <strong>"exit"</strong> to main menu.',
  );
}

function showServices() {
  const services = `
        I'm here to support your farm operations with the following services:<br><br>
        <ol style="margin: 0; padding-left: 20px; line-height: 1.8;">
            <li><strong style="color: var(--chatbot-dark-green);">Live Weather Updates</strong> – Get real-time weather information for your location</li>
            <li><strong style="color: var(--chatbot-dark-green);">5-Day Weather Forecast</strong> – Extended weather predictions for planning</li>
            <li><strong style="color: var(--chatbot-dark-green);">Care Tips</strong> – Farming advice for Crops, Livestock, and Poultry</li>
            <li><strong style="color: var(--chatbot-dark-green);">Cattle Weight Estimation</strong> – Calculate weight from measurements</li>
            <li><strong style="color: var(--chatbot-dark-green);">Nearby Services Finder</strong> – Find vet clinics, feed stores, and markets</li>
            <li><strong style="color: var(--chatbot-dark-green);">Commodity Prices</strong> – Check current market prices</li>
            <li><strong style="color: var(--chatbot-dark-green);">PDF Document Summary</strong> – Summarize PDF documents</li>
            <li><strong style="color: var(--chatbot-dark-green);">Disease Diagnosis</strong> – AI-powered detection for Livestock, Poultry, and Crops</li>
            <li><strong style="color: var(--chatbot-dark-green);">Species Identification</strong> – Identify species from images (Livestock, Poultry, and Crops)</li>
        </ol>
        <br>
        Type the service number or name to get started!<br>
        Type <strong>"exit"</strong> to return to main menu.
    `;
  addBotMessage(services);
}

// Service 1: Live Weather
async function getLiveWeather(locationInput) {
  try {
    let lat, lon, locationName;

    if (
      locationInput.toLowerCase().includes("my location") ||
      locationInput.toLowerCase().includes("gps")
    ) {
      const position = await getCurrentPosition();
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      locationName = "Your Location";
    } else {
      // Geocode location
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(locationInput)}&limit=1&appid=${WEATHER_API_KEY}`,
      );
      const geoData = await geoResponse.json();
      if (!geoData || geoData.length === 0) {
        showCorrection(
          "weather",
          "Location not found.",
          'Try: "London", "Nairobi", or type "my location" to use GPS.',
        );
        return;
      }
      lat = geoData[0].lat;
      lon = geoData[0].lon;
      locationName = geoData[0].name;
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`,
    );
    const data = await response.json();

    if (data.cod !== 200) {
      addBotMessage(
        "❌ Error fetching weather data. Please check your API key.",
      );
      return;
    }

    const weatherIcon = getWeatherIcon(data.weather[0].main);
    const message = `
            ${weatherIcon} <strong>Weather for ${locationName}</strong><br>
            <div class="weather-info">
                <p><strong>Temperature:</strong> ${data.main.temp}°C (Feels like ${data.main.feels_like}°C)</p>
                <p><strong>Condition:</strong> ${data.weather[0].description}</p>
                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
                <p><strong>Pressure:</strong> ${data.main.pressure} hPa</p>
                <p><strong>Visibility:</strong> ${(data.visibility / 1000).toFixed(1)} km</p>
            </div>
        `;
    addBotMessage(message);
    currentService = null;
  } catch (error) {
    console.error("Weather error:", error);
    addBotMessage(
      "❌ Error fetching weather. Please try again or check your location.",
    );
  }
}

// Service 2: 5-Day Forecast
async function get5DayForecast(locationInput) {
  try {
    let lat, lon, locationName;

    if (
      locationInput.toLowerCase().includes("my location") ||
      locationInput.toLowerCase().includes("gps")
    ) {
      const position = await getCurrentPosition();
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      locationName = "Your Location";
    } else {
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(locationInput)}&limit=1&appid=${WEATHER_API_KEY}`,
      );
      const geoData = await geoResponse.json();
      if (!geoData || geoData.length === 0) {
        showCorrection(
          "weather",
          "Location not found.",
          'Try: "London", "Nairobi", or type "my location" to use GPS.',
        );
        return;
      }
      lat = geoData[0].lat;
      lon = geoData[0].lon;
      locationName = geoData[0].name;
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`,
    );
    const data = await response.json();

    if (data.cod !== "200") {
      addBotMessage("❌ Error fetching forecast. Please check your API key.");
      return;
    }

    // Group forecasts by day
    const forecastsByDay = {};
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      if (!forecastsByDay[dayKey]) {
        forecastsByDay[dayKey] = [];
      }
      forecastsByDay[dayKey].push(item);
    });

    let message = `📅 <strong>5-Day Forecast for ${locationName}</strong><br><br>`;
    let dayCount = 0;
    for (const day in forecastsByDay) {
      if (dayCount >= 5) break;
      const forecasts = forecastsByDay[day];
      const temps = forecasts.map((f) => f.main.temp);
      const minTemp = Math.min(...temps);
      const maxTemp = Math.max(...temps);
      const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
      const mainCondition =
        forecasts[Math.floor(forecasts.length / 2)].weather[0].main;
      const date = new Date(day);

      message += `
                <div class="forecast-day">
                    <strong>${date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</strong><br>
                    ${getWeatherIcon(mainCondition)} ${mainCondition}<br>
                    Temp: ${minTemp.toFixed(1)}°C - ${maxTemp.toFixed(1)}C (Avg: ${avgTemp.toFixed(1)}°C)
                </div>
            `;
      dayCount++;
    }

    addBotMessage(message);
    currentService = null;
  } catch (error) {
    console.error("Forecast error:", error);
    addBotMessage("❌ Error fetching forecast. Please try again.");
  }
}

// Service 3: Care Tips
window.sendCareTips = async function (type) {
  currentService = "care";
  addUserMessage(`Get care tips for ${type}`);

  try {
    const position = await getCurrentPosition();
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`,
    );
    const data = await response.json();

    if (data.cod !== 200) {
      addBotMessage("❌ Error fetching weather data for care tips.");
      return;
    }

    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const condition = data.weather[0].main.toLowerCase();
    const windSpeed = data.wind.speed;

    let tips = `💡 <strong>Care Tips for ${type.charAt(0).toUpperCase() + type.slice(1)}</strong><br><br>`;
    tips += `<strong>Current Conditions:</strong> ${temp}°C, ${humidity}% humidity, ${condition}<br><br>`;

    if (type === "crops") {
      if (temp > 35) {
        tips +=
          "🌡️ <strong>Heat Alert:</strong> Provide shade, increase irrigation frequency<br>";
      }
      if (temp < 10) {
        tips +=
          "❄️ <strong>Cold Alert:</strong> Protect with covers, reduce watering<br>";
      }
      if (humidity > 80) {
        tips +=
          "💧 <strong>High Humidity:</strong> Watch for fungal diseases, improve ventilation<br>";
      }
      if (condition.includes("rain")) {
        tips +=
          "🌧️ <strong>Rain Expected:</strong> Ensure proper drainage, delay fertilizer application<br>";
      }
      if (windSpeed > 5) {
        tips +=
          "💨 <strong>Windy Conditions:</strong> Secure structures, protect young plants<br>";
      }
      tips +=
        "<br>💡 <strong>General Tips:</strong> Monitor soil moisture, check for pests regularly, maintain proper spacing";
    } else if (type === "livestock") {
      if (temp > 30) {
        tips +=
          "🌡️ <strong>Heat Stress:</strong> Provide shade, ensure water availability, reduce activity<br>";
      }
      if (temp < 5) {
        tips +=
          "❄️ <strong>Cold Stress:</strong> Provide shelter, increase feed, check for drafts<br>";
      }
      if (humidity > 75) {
        tips +=
          "💧 <strong>High Humidity:</strong> Improve ventilation, watch for respiratory issues<br>";
      }
      if (condition.includes("rain")) {
        tips +=
          "🌧️ <strong>Wet Conditions:</strong> Keep animals dry, prevent mud buildup<br>";
      }
      tips +=
        "<br>💡 <strong>General Tips:</strong> Regular health checks, proper nutrition, clean water, adequate space";
    } else if (type === "poultry") {
      if (temp > 28) {
        tips +=
          "🌡️ <strong>Heat Stress:</strong> Increase ventilation, provide cool water, reduce density<br>";
      }
      if (temp < 15) {
        tips +=
          "❄️ <strong>Cold Stress:</strong> Provide heating, reduce drafts, increase feed<br>";
      }
      if (humidity > 70) {
        tips +=
          "💧 <strong>High Humidity:</strong> Improve ventilation, keep litter dry<br>";
      }
      if (condition.includes("rain")) {
        tips +=
          "🌧️ <strong>Wet Conditions:</strong> Keep coops dry, prevent flooding<br>";
      }
      tips +=
        "<br>💡 <strong>General Tips:</strong> Clean coops regularly, proper lighting, balanced feed, disease prevention";
    }

    addBotMessage(tips);
    currentService = null;
  } catch (error) {
    console.error("Care tips error:", error);
    addBotMessage("❌ Error getting care tips. Please allow location access.");
  }
};

// Service 4: Weight Estimation
function calculateCattleWeight(message) {
  const girthMatch = message.match(/girth[:\s]+(\d+)/i);
  const lengthMatch = message.match(/length[:\s]+(\d+)/i);
  const typeMatch = message.match(/type[:\s]+([a-z\s]+)/i);

  if (!girthMatch || !lengthMatch) {
    showCorrection(
      "weight",
      "Missing measurements.",
      "Format example: <code>girth: 180, length: 150, type: dairy cow</code>",
    );
    return;
  }

  const girth = parseFloat(girthMatch[1]);
  const length = parseFloat(lengthMatch[1]);
  const type = typeMatch ? typeMatch[1].trim().toLowerCase() : "dairy cow";

  const kValues = {
    "dairy cow": 10840,
    "beef cattle": 10600,
    calf: 11000,
    bull: 10500,
    heifer: 10800,
  };

  const k = kValues[type] || kValues["dairy cow"];
  const weight = (girth * girth * length) / k;

  const messageText = `
        ⚖️ <strong>Weight Estimation</strong><br><br>
        <strong>Measurements:</strong><br>
        Girth: ${girth} cm<br>
        Length: ${length} cm<br>
        Type: ${type}<br><br>
        <strong>Estimated Weight:</strong> ${weight.toFixed(2)} kg (${(weight * 2.20462).toFixed(2)} lbs)
    `;
  addBotMessage(messageText);
  currentService = null;
}

// Service 5: Nearby Services
window.findService = async function (serviceType) {
  currentService = "nearby";
  addUserMessage(`Find nearby ${serviceType}`);

  try {
    const position = await getCurrentPosition();
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const queryMap = {
      vet: "veterinary",
      feed: "agricultural supply",
      market: "agricultural market",
    };

    const query = queryMap[serviceType] || serviceType;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&lat=${lat}&lon=${lon}&limit=5`,
    );
    const data = await response.json();

    if (!data || data.length === 0) {
      showCorrection(
        "nearby",
        `No ${serviceType} services found nearby.`,
        `Try a nearby town or type: "nearby ${serviceType} in <city>"`,
      );
      return;
    }

    let message = `📍 <strong>Nearby ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Services</strong><br><br>`;

    data.forEach((place, index) => {
      const distance = calculateDistance(
        lat,
        lon,
        parseFloat(place.lat),
        parseFloat(place.lon),
      );
      const mapsLink = `https://www.google.com/maps?q=${place.lat},${place.lon}`;
      message += `
                <div class="nearby-service">
                    <strong>${index + 1}. ${place.display_name.split(",")[0]}</strong><br>
                    Distance: ${distance.toFixed(2)} km<br>
                    <a href="${mapsLink}" target="_blank">📍 View on Maps</a>
                </div>
            `;
    });

    addBotMessage(message);
    currentService = null;
  } catch (error) {
    console.error("Nearby services error:", error);
    addBotMessage("❌ Error finding services. Please allow location access.");
  }
};

// Service 6: Commodity Prices
function getCommodityPrices(commodity) {
  const prices = {
    tomato: {
      price: "25-30",
      unit: "Rs/kg",
      trend: "stable",
      market: "Uzhavar Sandhai",
      name: "Tomato",
    },
    tomatoes: {
      price: "25-30",
      unit: "Rs/kg",
      trend: "stable",
      market: "Uzhavar Sandhai",
      name: "Tomato",
    },
    rice: {
      price: "45-50",
      unit: "Rs/kg",
      trend: "increasing",
      market: "Local Market",
      name: "Rice",
    },
    wheat: {
      price: "30-35",
      unit: "Rs/kg",
      trend: "stable",
      market: "Local Market",
      name: "Wheat",
    },
    milk: {
      price: "55-60",
      unit: "Rs/liter",
      trend: "stable",
      market: "Dairy Cooperative",
      name: "Milk",
    },
    egg: {
      price: "6-7",
      unit: "Rs/piece",
      trend: "increasing",
      market: "Poultry Market",
      name: "Egg",
    },
    eggs: {
      price: "6-7",
      unit: "Rs/piece",
      trend: "increasing",
      market: "Poultry Market",
      name: "Egg",
    },
    chicken: {
      price: "180-200",
      unit: "Rs/kg",
      trend: "stable",
      market: "Meat Market",
      name: "Chicken",
    },
    onion: {
      price: "40-45",
      unit: "Rs/kg",
      trend: "decreasing",
      market: "Vegetable Market",
      name: "Onion",
    },
    onions: {
      price: "40-45",
      unit: "Rs/kg",
      trend: "decreasing",
      market: "Vegetable Market",
      name: "Onion",
    },
    potato: {
      price: "30-35",
      unit: "Rs/kg",
      trend: "stable",
      market: "Vegetable Market",
      name: "Potato",
    },
    potatoes: {
      price: "30-35",
      unit: "Rs/kg",
      trend: "stable",
      market: "Vegetable Market",
      name: "Potato",
    },
  };

  const commodityLower = commodity.toLowerCase().trim();
  let priceData = prices[commodityLower];

  // If not found, try to match with common variations
  if (!priceData) {
    // Try removing common suffixes
    const variations = [
      commodityLower,
      commodityLower.replace(/s$/, ""), // Remove trailing 's'
      commodityLower + "s", // Add 's'
      commodityLower.replace(/es$/, ""), // Remove 'es'
      commodityLower.replace(/ies$/, "y"), // Replace 'ies' with 'y'
    ];

    for (const variation of variations) {
      if (prices[variation]) {
        priceData = prices[variation];
        break;
      }
    }
  }

  if (!priceData) {
    // Show available commodities in a user-friendly format
    const availableCommodities = [
      "tomato",
      "rice",
      "wheat",
      "milk",
      "egg",
      "chicken",
      "onion",
      "potato",
    ];
    showCorrection(
      "prices",
      `Price data not available for "${commodity}".`,
      `Available: ${availableCommodities.join(", ")}. Try one of these.`,
    );
    return;
  }

  const trendIcon =
    priceData.trend === "increasing"
      ? "📈"
      : priceData.trend === "decreasing"
        ? "📉"
        : "➡️";
  const displayName =
    priceData.name || commodity.charAt(0).toUpperCase() + commodity.slice(1);
  const message = `
        💰 <strong>Commodity Price: ${displayName}</strong><br>
        <div class="price-info">
            <strong>Price:</strong> ${priceData.price} ${priceData.unit}<br>
            <strong>Trend:</strong> ${trendIcon} ${priceData.trend}<br>
            <strong>Market:</strong> ${priceData.market}
        </div>
        <br><small>Note: Prices are approximate and may vary by location and time.</small>
    `;
  addBotMessage(message);
  currentService = null;
}

// Service 7: PDF Summary
async function processPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";
    // Process 5-8 pages (minimum 5, maximum 8)
    const totalPages = pdf.numPages;
    const minPages = Math.min(5, totalPages);
    const maxPages = Math.min(8, totalPages);
    const pagesToProcess = Math.max(minPages, Math.min(maxPages, totalPages));

    for (let i = 1; i <= pagesToProcess; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    // Extract summary in exactly 3 lines
    const sentences = fullText
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 20);

    // Get first 3 meaningful sentences for 3-line summary
    let summaryLines = [];
    let currentLine = "";

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (trimmed.length > 0) {
        if (currentLine.length + trimmed.length < 100) {
          currentLine += (currentLine ? " " : "") + trimmed;
        } else {
          if (currentLine) summaryLines.push(currentLine);
          currentLine = trimmed;
        }
        if (summaryLines.length >= 3) break;
      }
    }

    // Add the last line if we have space
    if (currentLine && summaryLines.length < 3) {
      summaryLines.push(currentLine);
    }

    // Ensure we have exactly 3 lines
    while (summaryLines.length < 3 && sentences.length > summaryLines.length) {
      const nextSentence = sentences[summaryLines.length];
      if (nextSentence && nextSentence.trim().length > 0) {
        summaryLines.push(nextSentence.trim());
      } else {
        break;
      }
    }

    // Format as 3 lines
    const summary =
      summaryLines
        .slice(0, 3)
        .map((line, index) => {
          return `${index + 1}. ${line}${index < 2 ? "." : ""}`;
        })
        .join("<br>") || "Could not extract meaningful text from PDF.";

    const message = `
            📄 <strong>PDF Summary</strong><br><br>
            <strong>File:</strong> ${file.name}<br>
            <strong>Total Pages:</strong> ${totalPages} | <strong>Processed:</strong> ${pagesToProcess} pages<br><br>
            <strong>Summary (3 lines):</strong><br>
            ${summary}
        `;
    addBotMessage(message);
    uploadedFile = null;
    currentService = null;
  } catch (error) {
    console.error("PDF error:", error);
    showCorrection(
      "pdf",
      "Error processing PDF.",
      "Upload a text-based PDF (not scanned image) or try a smaller file.",
    );
  }
}

// Service 8: Disease Diagnosis
let diagnosisCategory = null;

window.startDiagnosis = function (category) {
  currentService = "diagnosis";
  diagnosisCategory = category;
  addUserMessage(`Diagnosis for ${category}`);
  addBotMessage(
    `🔬 <strong>${category.charAt(0).toUpperCase() + category.slice(1)} Disease Diagnosis</strong><br>Please upload an image using the 📎 button.`,
  );
};

async function diagnosePlant(file, category = null) {
  const selectedCategory = category || diagnosisCategory || "crops";

  // Show loading message
  const loadingMsg = document.createElement("div");
  loadingMsg.className = "message bot";
  loadingMsg.id = "diagnosisLoading";
  loadingMsg.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="loading">
                <span></span><span></span><span></span>
            </div>
            Analyzing ${selectedCategory} image...
        </div>
    `;
  document.getElementById("chatbotMessages").appendChild(loadingMsg);
  scrollToBottom();

  try {
    const base64Image = await fileToBase64(file);

    // Use Google Vision API for image analysis
    // Try as API key first, if it fails, try as OAuth token
    const apiUrl = GOOGLE_VISION_API_KEY.startsWith("AIza")
      ? `${GOOGLE_VISION_API_URL}?key=${GOOGLE_VISION_API_KEY}`
      : GOOGLE_VISION_API_URL;

    const headers = {
      "Content-Type": "application/json",
    };

    // If it's not a standard API key, use as Bearer token
    if (!GOOGLE_VISION_API_KEY.startsWith("AIza")) {
      headers["Authorization"] = `Bearer ${GOOGLE_VISION_API_KEY}`;
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              { type: "LABEL_DETECTION", maxResults: 10 },
              { type: "OBJECT_LOCALIZATION", maxResults: 10 },
              { type: "SAFE_SEARCH_DETECTION" },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `API returned status ${response.status}`,
      );
    }

    const data = await response.json();
    const categoryName =
      selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);

    if (data.responses && data.responses[0]) {
      const visionData = data.responses[0];
      const labels = visionData.labelAnnotations || [];
      const objects = visionData.localizedObjectAnnotations || [];

      // Analyze labels for disease/health indicators
      const healthKeywords = [
        "healthy",
        "disease",
        "sick",
        "infection",
        "wound",
        "lesion",
        "spot",
        "blight",
        "rust",
        "mildew",
        "rot",
      ];
      const detectedLabels = labels.map((l) => l.description.toLowerCase());
      const hasHealthIssues = healthKeywords.some((keyword) =>
        detectedLabels.some((label) => label.includes(keyword)),
      );

      // Get top detected objects/labels
      const topLabels = labels
        .slice(0, 5)
        .map((l) => l.description)
        .join(", ");
      const detectedObjects =
        objects.map((o) => o.name).join(", ") || "No specific objects detected";

      if (selectedCategory === "crops") {
        if (hasHealthIssues) {
          const diseaseLabels = labels.filter((l) =>
            healthKeywords.some((k) => l.description.toLowerCase().includes(k)),
          );
          const diseaseInfo =
            diseaseLabels.length > 0
              ? diseaseLabels[0].description
              : "Potential health issue detected";

          const message = `
                        🔬 <strong>${categoryName} Disease Diagnosis</strong><br><br>
                        <div class="plant-info">
                            <strong>Analysis Result:</strong> ${diseaseInfo}<br>
                            <strong>Detected:</strong> ${topLabels}<br>
                            <strong>Confidence:</strong> ${labels[0] ? (labels[0].score * 100).toFixed(1) + "%" : "N/A"}<br><br>
                            <strong>Recommendation:</strong> Based on image analysis, there may be health issues. Please consult with an agricultural expert or plant pathologist for accurate diagnosis and treatment.
                        </div>
                    `;
          addBotMessage(message);
        } else {
          addBotMessage(
            `✅ <strong>${categoryName} Health Assessment</strong><br><br>Based on image analysis, your ${selectedCategory} appears to be <strong>healthy</strong>! No obvious diseases detected.<br><br><strong>Detected:</strong> ${topLabels}`,
          );
        }
      } else {
        // For livestock and poultry
        const message = `
                    🔬 <strong>${categoryName} Disease Diagnosis</strong><br><br>
                    <div class="plant-info">
                        <strong>Image Analysis Complete</strong><br>
                        <strong>Detected Objects:</strong> ${detectedObjects || topLabels}<br>
                        <strong>Analysis:</strong> ${hasHealthIssues ? "Potential health issues detected. " : "No obvious health issues detected. "}Please consult with a veterinarian for accurate diagnosis.<br><br>
                        <strong>Common ${categoryName} Health Issues:</strong><br>
                        ${selectedCategory === "livestock"
            ? "• Respiratory infections<br>• Parasitic infections<br>• Nutritional deficiencies<br>• Foot and mouth disease<br>• Mastitis (in dairy cattle)"
            : "• Avian influenza<br>• Newcastle disease<br>• Coccidiosis<br>• Respiratory infections<br>• Nutritional deficiencies"
          }
                        <br><br>
                        <strong>Recommendation:</strong> Contact a veterinarian for professional diagnosis and treatment.
                    </div>
                `;
        addBotMessage(message);
      }
    } else {
      throw new Error("No response from Google Vision API");
    }

    uploadedFile = null;
    diagnosisCategory = null;
    currentService = null;

    // Remove loading message
    const loadingElement = document.getElementById("diagnosisLoading");
    if (loadingElement) loadingElement.remove();
  } catch (error) {
    console.error("Diagnosis error:", error);

    // Remove loading message
    const loadingElement = document.getElementById("diagnosisLoading");
    if (loadingElement) loadingElement.remove();

    let errorMessage = `❌ Error diagnosing ${selectedCategory}. `;
    if (error.message) {
      if (
        error.message.includes("not been used") ||
        error.message.includes("disabled")
      ) {
        errorMessage += `<br><br><strong>API Not Enabled:</strong><br>`;
        errorMessage += `The Google Cloud Vision API needs to be enabled in your project.<br>`;
        errorMessage += `<a href="https://console.developers.google.com/apis/api/vision.googleapis.com/overview" target="_blank">Enable Cloud Vision API</a><br><br>`;
        errorMessage += `<strong>Alternative:</strong> For now, here's general guidance for ${selectedCategory} health:<br><br>`;

        if (selectedCategory === "crops") {
          errorMessage += `<div class="plant-info">
                        <strong>Common Crop Health Issues:</strong><br>
                        • Fungal diseases (blight, rust, mildew)<br>
                        • Bacterial infections<br>
                        • Viral diseases<br>
                        • Pest damage<br>
                        • Nutrient deficiencies<br><br>
                        <strong>Prevention Tips:</strong><br>
                        • Regular monitoring<br>
                        • Proper irrigation<br>
                        • Crop rotation<br>
                        • Use disease-resistant varieties<br>
                        • Consult agricultural experts
                    </div>`;
        } else if (selectedCategory === "livestock") {
          errorMessage += `<div class="plant-info">
                        <strong>Common Livestock Health Issues:</strong><br>
                        • Respiratory infections<br>
                        • Parasitic infections<br>
                        • Nutritional deficiencies<br>
                        • Foot and mouth disease<br>
                        • Mastitis (in dairy cattle)<br><br>
                        <strong>Prevention Tips:</strong><br>
                        • Regular veterinary checkups<br>
                        • Proper nutrition<br>
                        • Clean living conditions<br>
                        • Vaccination programs<br>
                        • Early detection and treatment
                    </div>`;
        } else {
          errorMessage += `<div class="plant-info">
                        <strong>Common Poultry Health Issues:</strong><br>
                        • Avian influenza<br>
                        • Newcastle disease<br>
                        • Coccidiosis<br>
                        • Respiratory infections<br>
                        • Nutritional deficiencies<br><br>
                        <strong>Prevention Tips:</strong><br>
                        • Biosecurity measures<br>
                        • Proper ventilation<br>
                        • Clean coops<br>
                        • Vaccination programs<br>
                        • Regular health monitoring
                    </div>`;
        }
      } else {
        errorMessage += `<br>Error: ${error.message}`;
        errorMessage +=
          "<br>Please check your API key and ensure the image is valid.";
      }
    } else {
      errorMessage +=
        "<br>Please check your API key and ensure the image is valid.";
    }
    addBotMessage(errorMessage);
  }
}

// Service 9: Species Identification
let identificationCategory = null;

window.startIdentification = function (category) {
  currentService = "identifier";
  identificationCategory = category;
  addUserMessage(`Identification for ${category}`);
  addBotMessage(
    `🌿 <strong>${category.charAt(0).toUpperCase() + category.slice(1)} Species Identification</strong><br>Please upload an image using the 📎 button.`,
  );
};

async function identifyPlant(file, category = null) {
  const selectedCategory = category || identificationCategory || "crops";

  // Show loading message
  const loadingMsg = document.createElement("div");
  loadingMsg.className = "message bot";
  loadingMsg.id = "identificationLoading";
  loadingMsg.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="loading">
                <span></span><span></span><span></span>
            </div>
            Identifying ${selectedCategory} species...
        </div>
    `;
  document.getElementById("chatbotMessages").appendChild(loadingMsg);
  scrollToBottom();

  try {
    const base64Image = await fileToBase64(file);

    // Use Google Vision API for species identification
    // Try as API key first, if it fails, try as OAuth token
    const apiUrl = GOOGLE_VISION_API_KEY.startsWith("AIza")
      ? `${GOOGLE_VISION_API_URL}?key=${GOOGLE_VISION_API_KEY}`
      : GOOGLE_VISION_API_URL;

    const headers = {
      "Content-Type": "application/json",
    };

    // If it's not a standard API key, use as Bearer token
    if (!GOOGLE_VISION_API_KEY.startsWith("AIza")) {
      headers["Authorization"] = `Bearer ${GOOGLE_VISION_API_KEY}`;
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              { type: "LABEL_DETECTION", maxResults: 15 },
              { type: "OBJECT_LOCALIZATION", maxResults: 10 },
              { type: "WEB_DETECTION", maxResults: 5 },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `API returned status ${response.status}`,
      );
    }

    const data = await response.json();
    const categoryName =
      selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);

    if (data.responses && data.responses[0]) {
      const visionData = data.responses[0];
      const labels = visionData.labelAnnotations || [];
      const objects = visionData.localizedObjectAnnotations || [];
      const webEntities = visionData.webDetection?.webEntities || [];

      // Get top identification results
      const topLabels = labels.slice(0, 5);
      const detectedObjects = objects
        .map((o) => o.name)
        .filter((v, i, a) => a.indexOf(v) === i);
      const webResults = webEntities.slice(0, 3).map((e) => e.description);

      if (selectedCategory === "crops") {
        // Filter for plant-related labels
        const plantLabels = topLabels.filter((l) => {
          const desc = l.description.toLowerCase();
          return (
            desc.includes("plant") ||
            desc.includes("leaf") ||
            desc.includes("flower") ||
            desc.includes("fruit") ||
            desc.includes("vegetable") ||
            desc.includes("crop") ||
            desc.includes("tree") ||
            desc.includes("herb")
          );
        });

        const primaryLabel = plantLabels[0] || topLabels[0];
        const confidence = primaryLabel
          ? (primaryLabel.score * 100).toFixed(1)
          : "N/A";

        const message = `
                    🌿 <strong>Crop Species Identification</strong><br><br>
                    <div class="plant-info">
                        <strong>Identified As:</strong> ${primaryLabel ? primaryLabel.description : "Unknown"}<br>
                        <strong>Confidence:</strong> <span class="confidence-score">${confidence}%</span><br>
                        <strong>Additional Labels:</strong> ${topLabels
            .slice(1, 4)
            .map((l) => l.description)
            .join(", ")}<br>
                        ${detectedObjects.length > 0 ? `<strong>Detected Objects:</strong> ${detectedObjects.join(", ")}<br>` : ""}
                        ${webResults.length > 0 ? `<strong>Related:</strong> ${webResults.join(", ")}<br>` : ""}
                        <br>
                        <strong>Note:</strong> For accurate crop identification, please cross-reference with agricultural databases or consult with an agricultural expert.
                    </div>
                `;
        addBotMessage(message);
      } else {
        // For livestock and poultry
        const animalLabels = topLabels.filter((l) => {
          const desc = l.description.toLowerCase();
          return (
            desc.includes("animal") ||
            desc.includes("cattle") ||
            desc.includes("cow") ||
            desc.includes("chicken") ||
            desc.includes("bird") ||
            desc.includes("livestock") ||
            desc.includes("poultry") ||
            desc.includes("goat") ||
            desc.includes("sheep") ||
            desc.includes("pig") ||
            desc.includes("horse")
          );
        });

        const primaryLabel = animalLabels[0] || topLabels[0];
        const confidence = primaryLabel
          ? (primaryLabel.score * 100).toFixed(1)
          : "N/A";

        const message = `
                    🌿 <strong>${categoryName} Species Identification</strong><br><br>
                    <div class="plant-info">
                        <strong>Identified As:</strong> ${primaryLabel ? primaryLabel.description : "Unknown"}<br>
                        <strong>Confidence:</strong> <span class="confidence-score">${confidence}%</span><br>
                        <strong>Additional Labels:</strong> ${topLabels
            .slice(1, 4)
            .map((l) => l.description)
            .join(", ")}<br>
                        ${detectedObjects.length > 0 ? `<strong>Detected Objects:</strong> ${detectedObjects.join(", ")}<br>` : ""}
                        <br>
                        <strong>Common ${categoryName} Breeds:</strong><br>
                        ${selectedCategory === "livestock"
            ? "• Cattle: Holstein, Angus, Hereford, Brahman<br>• Goats: Boer, Nubian, Alpine<br>• Sheep: Merino, Dorper, Suffolk<br>• Pigs: Yorkshire, Duroc, Hampshire"
            : "• Chickens: Rhode Island Red, Leghorn, Plymouth Rock<br>• Ducks: Pekin, Muscovy, Khaki Campbell<br>• Turkeys: Broad Breasted, Bronze<br>• Geese: Embden, Toulouse"
          }
                        <br><br>
                        <strong>Recommendation:</strong> For accurate breed identification, consult with a veterinarian or agricultural specialist.
                    </div>
                `;
        addBotMessage(message);
      }
    } else {
      throw new Error("No response from Google Vision API");
    }

    uploadedFile = null;
    identificationCategory = null;
    currentService = null;

    // Remove loading message
    const loadingElement = document.getElementById("identificationLoading");
    if (loadingElement) loadingElement.remove();
  } catch (error) {
    console.error("Identification error:", error);

    // Remove loading message
    const loadingElement = document.getElementById("identificationLoading");
    if (loadingElement) loadingElement.remove();

    let errorMessage = `❌ Error identifying ${selectedCategory}. `;
    if (error.message) {
      if (
        error.message.includes("not been used") ||
        error.message.includes("disabled")
      ) {
        errorMessage += `<br><br><strong>API Not Enabled:</strong><br>`;
        errorMessage += `The Google Cloud Vision API needs to be enabled in your project.<br>`;
        errorMessage += `<a href="https://console.developers.google.com/apis/api/vision.googleapis.com/overview" target="_blank">Enable Cloud Vision API</a><br><br>`;
        errorMessage += `<strong>Alternative:</strong> Here's general information for ${selectedCategory} identification:<br><br>`;

        if (selectedCategory === "crops") {
          errorMessage += `<div class="plant-info">
                        <strong>Crop Identification Tips:</strong><br>
                        • Observe leaf shape and arrangement<br>
                        • Check flower/fruit characteristics<br>
                        • Note growth pattern and size<br>
                        • Examine stem structure<br>
                        • Check root system (if visible)<br><br>
                        <strong>Common Crops:</strong><br>
                        • Grains: Rice, Wheat, Corn<br>
                        • Vegetables: Tomato, Potato, Onion<br>
                        • Fruits: Mango, Banana, Citrus<br>
                        • Legumes: Beans, Peas, Lentils<br><br>
                        <strong>Recommendation:</strong> Consult agricultural databases or experts for accurate identification.
                    </div>`;
        } else if (selectedCategory === "livestock") {
          errorMessage += `<div class="plant-info">
                        <strong>Livestock Identification Tips:</strong><br>
                        • Note body size and shape<br>
                        • Check coat color and patterns<br>
                        • Observe horn structure<br>
                        • Examine ear shape and size<br>
                        • Check breed-specific markings<br><br>
                        <strong>Common Livestock Breeds:</strong><br>
                        • Cattle: Holstein, Angus, Hereford, Brahman<br>
                        • Goats: Boer, Nubian, Alpine<br>
                        • Sheep: Merino, Dorper, Suffolk<br>
                        • Pigs: Yorkshire, Duroc, Hampshire<br><br>
                        <strong>Recommendation:</strong> Consult with a veterinarian or breed registry for accurate identification.
                    </div>`;
        } else {
          errorMessage += `<div class="plant-info">
                        <strong>Poultry Identification Tips:</strong><br>
                        • Note body size and shape<br>
                        • Check feather color and patterns<br>
                        • Observe comb and wattle type<br>
                        • Examine leg color and structure<br>
                        • Check breed-specific features<br><br>
                        <strong>Common Poultry Breeds:</strong><br>
                        • Chickens: Rhode Island Red, Leghorn, Plymouth Rock<br>
                        • Ducks: Pekin, Muscovy, Khaki Campbell<br>
                        • Turkeys: Broad Breasted, Bronze<br>
                        • Geese: Embden, Toulouse<br><br>
                        <strong>Recommendation:</strong> Consult with a poultry expert or breed registry for accurate identification.
                    </div>`;
        }
      } else {
        errorMessage += `<br>Error: ${error.message}`;
        errorMessage +=
          "<br>Please check your API key and ensure the image is valid.";
      }
    } else {
      errorMessage +=
        "<br>Please check your API key and ensure the image is valid.";
    }
    addBotMessage(errorMessage);
  }
}

// Helper Functions
function showCorrection(serviceKey, reason, suggestion) {
  const serviceNames = {
    weather: "Weather Service",
    forecast: "Forecast Service",
    care: "Care Tips",
    weight: "Weight Estimation",
    nearby: "Nearby Services",
    prices: "Commodity Prices",
    pdf: "PDF Summary",
    diagnosis: "Disease Diagnosis",
    identifier: "Species Identification",
    general: "Input",
  };
  const title = serviceNames[serviceKey] || "Input";
  const message = `❌ <strong>${title} — ${reason}</strong><br>${suggestion}<br><br><small>Need more help? Type "help" to see available services or an example input.</small>`;
  addBotMessage(message);
}
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getWeatherIcon(condition) {
  const icons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Fog: "🌫️",
  };
  return icons[condition] || "🌤️";
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function showFilePreview(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const isImage = file.type.startsWith("image/");
    const preview = `
            <div class="file-preview">
                <strong>📎 ${file.name}</strong> (${(file.size / 1024).toFixed(2)} KB)<br>
                ${isImage ? `<img src="${e.target.result}" alt="Preview">` : "PDF file ready for processing"}
            </div>
        `;
    addBotMessage(preview);
  };
  if (file.type.startsWith("image/")) {
    reader.readAsDataURL(file);
  } else {
    addBotMessage(
      `📎 <strong>File uploaded:</strong> ${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
    );
  }
}

function scrollToBottom() {
  const messagesContainer = document.getElementById("chatbotMessages");
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}
