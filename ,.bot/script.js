const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");

// ⚠️ Put your OpenAI API key here (only for local testing!)
const API_KEY = "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"; // replace with your key

// Initial bot greeting
addMessage("bot", "Hi — I'm your assistant. Ask me something!");

// Event listeners
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

clearBtn.addEventListener("click", () => {
  chatBox.innerHTML = "";
  addMessage("bot", "Chat cleared. Ask me something new!");
});

// Function to add a message to chat
function addMessage(role, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", role);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message to API
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // Show user message
  addMessage("user", text);
  userInput.value = "";

  // Show "typing..." indicator
  const typingMsg = document.createElement("div");
  typingMsg.classList.add("message", "bot");
  typingMsg.textContent = "Typing...";
  chatBox.appendChild(typingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // change if you want gpt-4o or gpt-3.5-turbo
        messages: [{ role: "user", content: text }]
      })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error?.message || "Unknown API error");
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    typingMsg.textContent = reply || "⚠️ No reply received.";
  } catch (err) {
    console.error("Chatbot error:", err);
    typingMsg.textContent = "⚠️ Error: " + err.message;
  }
}
