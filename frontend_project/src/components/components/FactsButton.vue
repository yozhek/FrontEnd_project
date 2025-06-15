<template>
    <!-- Кнопка, що плаває у верхньому правому куті -->
      <button
        v-if="!showChat"
        @click="toggleChat"
        class="button"
        :disabled="loading"
        aria-label="Open chat"
      >
        {{buttonText}}
      </button>
    <!-- Віконце чату, що з’являється справа -->
    <div v-if="showChat" class="chat-window" role="dialog" aria-modal="true" aria-label="Chat window">
      <div class="chat-message user">
        🔍 {{ userMessage }}
      </div>

      <div v-if="loading" class="chat-message ai">
        ⏳ Loading hint...
      </div>

      <div v-else-if="fact" class="chat-message ai">
        💡 {{ fact }}
      </div>

      <div v-else-if="error" class="chat-message ai error">
        ❗ {{ error }}
      </div>

      <div class="hint-options" v-if="!loading">
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
  },
  isAnswered: {
    type: Boolean,
    default: false,
  },
});

const showChat = ref(false);
const fact = ref("");
const loading = ref(false);
const error = ref("");

const API_KEY = "AIzaSyAG-l1AAbD1SCYS11c4ChvHyGY8RhGI2xQ";
const genAI = new GoogleGenerativeAI(API_KEY);

const buttonText = computed(() => {
  return props.isAnswered ? "Show a fact about this film" : "Get a hint";
});

const userMessage = computed(() => {
  return props.isAnswered
    ? `Fact about "${props.movieTitle}"`
    : "Get a hint";
});

const hintOptions = [
  {
    key: "year",
    label: "Year of release",
    prompt: `Give a year of the release year of the film "${props.movieTitle}". Do not mention the title.`,
  },
  {
    key: "genre",
    label: "Genre",
    prompt: `Give the genre of the film "${props.movieTitle}". Do not mention the title.`,
  },
  {
    key: "actors",
    label: "Main actors",
    prompt: `Give some main actors of the film "${props.movieTitle}". Do not mention the title.`,
  },
  {
    key: "plot",
    label: "Plot hint",
    prompt: `Give a hint about the plot of the film "${props.movieTitle}" without spoilers. Do not mention the title.`,
  },
  {
    key: "awards",
    label: "Awards or records",
    prompt: `Give an awards or records related to the film "${props.movieTitle}". Do not mention the title.`,
  },
];

function toggleChat() {
  showChat.value = !showChat.value;
  if (showChat.value && !fact.value && !loading.value) {
    fetchFact();
  }
}

async function fetchFact(customPrompt) {
  loading.value = true;
  fact.value = "";
  error.value = "";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt;
    if (customPrompt) {
      prompt = customPrompt;
    } else {
      prompt = props.isAnswered
        ? `Write an interesting fact about film "${props.movieTitle}". Fact should be short (1-2 sentences), informative and interesting. Answer in english.`
        : `Give a hint about "${props.movieTitle}", but DONT mention the movie title in your hint. Hint should help to guess the film. Answer briefly (1-2 sentences).`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    if (text && text.trim()) {
      fact.value = text.trim();
    } else {
      fact.value = props.isAnswered
        ? `Could not get the fact about "${props.movieTitle}".`
        : "Could not get a hint.";
    }
  } catch (err) {
    console.error("Gemini API error:", err);
    error.value = "There was an error retrieving information. Please try again.";
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.isAnswered,
  () => {
    fact.value = "";
    showChat.value = false;
  }
);

watch(
  () => props.movieTitle,
  () => {
    fact.value = "";
    showChat.value = false;
    loading.value = false;
    error.value = "";
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
  padding-top: 2rem; /* Місце для хрестика */
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;
}
.hint-options {
  display: flex;
  flex-wrap: wrap; /* якщо кнопки не вміщаються в ряд — переносяться */
  gap: 0.1rem; /* горизонтальний та вертикальний відступ між кнопками */
  justify-content: center; /* щоб кнопки були по центру */
}
.chat-window:hover {
  transform: translateY(-1px) scale(1.02);
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
  margin: 0.3rem 0; /* відступи між повідомленнями */
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
