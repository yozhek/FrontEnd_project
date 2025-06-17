<template>
  <button
    v-if="!showChat"
    @click="toggleChat"
    class="button"
    :disabled="loading"
    aria-label="Open chat"
  >
    Get a hint
  </button>

  <div v-if="showChat" class="chat-window" role="dialog" aria-modal="true" aria-label="Chat window">
    <div v-if="showWarning" class="chat-message ai">
      You can use the following hints as help, but each hint will cost you 1 point
    </div>

    <div v-if="userMessage" class="chat-message user">
      🔍 {{ userMessage }}
    </div>

    <div v-if="loading" class="chat-message ai">
      ⏳ Loading hint...
    </div>

    <div v-if="error" class="chat-message ai error">
      ❗ {{ error }}
    </div>

    <div v-if="fact" class="chat-message ai">
      💡 {{ fact }}
    </div>

    <div class="hint-options" v-if="showHintOptions && !loading && !error">
      <button
        class="hint-option-btn"
        v-for="option in hintOptions"
        :key="option.key"
        @click="fetchFact(option.prompt)"
        :disabled="loading"
      >
        {{ option.label }}
      </button>
    </div>

    <div v-if="!showHintOptions && !loading && !error">
      <button class="hint-option-btn" @click="onGetHintClick" :disabled="loading">
        Get a hint
      </button>
    </div>

    <button class="btn-close-chat" @click="toggleChat" aria-label="Close chat">
      ✖
    </button>
  </div>
</template>

<script setup>
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ref, computed, watch } from "vue";

const props = defineProps({
  movieTitle: {
    type: String,
    required: true,
  }
});
const emits = defineEmits(["deduct-points"]);

const showChat = ref(false);
const fact = ref("");
const loading = ref(false);
const error = ref("");
const showHintOptions = ref(false);
const showWarning = ref(true);
const usedHints = ref(new Set());


const API_KEY = "AIzaSyAG-l1AAbD1SCYS11c4ChvHyGY8RhGI2xQ";
const genAI = new GoogleGenerativeAI(API_KEY);

const userMessage = computed(() => {
  return fact.value ? `Get a hint` : "";
});

const hintOptions = [
  { key: "year", label: "Year of release", prompt: `Give the release year of "${props.movieTitle}". Do not mention the title.` },
  { key: "genre", label: "Genre", prompt: `Give the genre of "${props.movieTitle}". Do not mention the title.` },
  { key: "actors", label: "Main actors", prompt: `Give main actors of "${props.movieTitle}". Do not mention the title.` },
  { key: "plot", label: "Plot hint", prompt: `Give a plot hint for "${props.movieTitle}" without spoilers. Do not mention the title.` },
  { key: "awards", label: "Awards or records", prompt: `Give awards or records related to "${props.movieTitle}". Do not mention the title. In 1-2 short sentences` },
];

function deductPoint() {
  // Тут ти можеш викликати свій метод для оновлення балів
  // Наприклад: emit("deduct-point")
  console.log("Point deducted!"); // Поки просто для перевірки
}

function toggleChat() {
  showChat.value = !showChat.value;
  fact.value = "";
  error.value = "";
  loading.value = false;
  showHintOptions.value = false;
  showWarning.value = true;
  usedHints.value = [];
}

function onGetHintClick() {
  showHintOptions.value = true;
  showWarning.value = false;
}

async function fetchFact(customPrompt, key) {
  loading.value = true;
  fact.value = "";
  error.value = "";

  try {
    if (key && !usedHints.value.has(key)) {
      deductPoint();
      usedHints.value.add(key);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = customPrompt;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = await response.text();

    fact.value = text?.trim() || "Could not get a hint.";
  } catch (err) {
    console.error("Gemini API error:", err);
    error.value = "There was an error retrieving information. Please try again.";
  } finally {
    loading.value = false;
  }
}


watch(
  () => props.movieTitle,
  () => {
    fact.value = "";
    showChat.value = false;
    loading.value = false;
    error.value = "";
    showHintOptions.value = false;
    showWarning.value = true;
    usedHints.value = [];
  }
);
</script>

<style scoped>
.button {
  position: absolute;
  top: 108px;
  right: 70px;
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  width: 100px;
  height: 40px;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button:hover {
  background-color: var(--color-accent);
  transform: scale(1.1);
}

.chat-window {
  position: absolute;
  top: 108px;
  right: 0;
  width: 200px;
  background: var(--color-white);
  border-radius: 14px;
  padding: 1rem;
  padding-top: 2rem;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;
}

.chat-window:hover {
  transform: translateY(-1px) scale(1.02);
}

.hint-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.1rem;
  justify-content: center;
}

.hint-option-btn {
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: 12px;
  padding: 0.3rem 0.6rem;
  font-size: 0.85rem;
  cursor: pointer;
  margin: 0.2rem auto;
  width: auto;
  text-align: center;
  transition: background-color 0.3s ease, transform 0.2s ease;
  display: inline-block;
}

.hint-option-btn:hover {
  background-color: var(--color-accent);
  transform: translateY(-1px);
}

.chat-message {
  margin: 0.3rem 0;
  padding: 0.4rem 0.6rem;
  border-radius: 10px;
  font-size: 0.85rem;
}

.chat-message.user {
  background-color: var(--color-primary-light);
  color: var(--color-black);
  margin-left: auto;
  border-radius: 12px 4px 12px 12px;
}

.chat-message.ai {
  background-color: var(--color-primary-light);
  color: var(--color-black);
  margin-right: auto;
  border-radius: 12px 12px 12px 4px;
}

.btn-close-chat {
  background: transparent;
  border: none;
  color: var(--color-primary);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.2rem;
  position: absolute;
  top: 0;
  right: 6px;
  transition: color 0.3s ease, transform 0.2s ease;
}

.btn-close-chat:hover {
  color: var(--color-accent);
  transform: rotate(90deg);
}
</style>
