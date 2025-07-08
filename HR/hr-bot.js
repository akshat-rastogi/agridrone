// Simple HR Bot Q&A
const hrBotOpen = document.getElementById("hr-bot-open");
const hrBotWidget = document.getElementById("hr-bot-widget");
const hrBotClose = document.getElementById("hr-bot-close");
const hrBotForm = document.getElementById("hr-bot-form");
const hrBotInput = document.getElementById("hr-bot-input");
const hrBotMessages = document.getElementById("hr-bot-messages");

const HR_FAQ = [
  {
    q: /onboard|join|start|first day/i,
    a: "Welcome! Check the Onboarding Checklist and Welcome Guide for your first steps at Agri-Drone.",
  },
  {
    q: /leave|vacation|pto|holiday/i,
    a: "Full-time employees at Agri-Drone get 20 paid days off per year, plus national holidays. Sick days are flexible. See Policies for details.",
  },
  {
    q: /benefit|insurance|wellness/i,
    a: "Agri-Drone offers comprehensive health insurance, wellness allowance, free therapy sessions, and more. See the Benefits section for details.",
  },
  {
    q: /policy|remote|work from home/i,
    a: "Agri-Drone is remote-first with flexible hours and an internet stipend. See the Policies section for all details.",
  },
  {
    q: /contact|help|support|hr/i,
    a: "You can reach Agri-Drone HR at hr@agridrone.com or use the Feedback Survey in the portal.",
  },
  {
    q: /org chart|team|structure/i,
    a: "See the Org Chart page for Agri-Drone's team structure and reporting lines.",
  },
  {
    q: /feedback|suggestion/i,
    a: "We value your feedback! Please fill out the Feedback Survey in the portal.",
  },
  {
    q: /thank|thanks|bye|goodbye/i,
    a: "You're welcome! If you have more questions, just ask.",
  },
];

function botAddMessage(text, fromUser = false) {
  const msg = document.createElement("div");
  msg.className = "hr-bot-message" + (fromUser ? " user" : "");
  const bubble = document.createElement("div");
  bubble.className = "hr-bot-bubble";
  bubble.textContent = text;
  msg.appendChild(bubble);
  hrBotMessages.appendChild(msg);
  hrBotMessages.scrollTop = hrBotMessages.scrollHeight;
}

function botGetAnswer(input) {
  for (const pair of HR_FAQ) {
    if (pair.q.test(input)) return pair.a;
  }
  return "I'm here to help! Please check the portal sections or ask Agri-Drone HR for more info.";
}

hrBotOpen.onclick = () => {
  hrBotWidget.style.display = "flex";
  hrBotOpen.style.display = "none";
  hrBotInput.focus();
  if (!hrBotMessages.hasChildNodes()) {
    botAddMessage(
      "Hi! I'm your Agri-Drone HR Bot. Ask me about onboarding, leave, benefits, or policies."
    );
  }
};

hrBotClose.onclick = () => {
  hrBotWidget.style.display = "none";
  hrBotOpen.style.display = "block";
};

hrBotForm.onsubmit = (e) => {
  e.preventDefault();
  const userInput = hrBotInput.value.trim();
  if (!userInput) return;
  botAddMessage(userInput, true);
  setTimeout(() => {
    botAddMessage(botGetAnswer(userInput));
  }, 500);
  hrBotInput.value = "";
};
