<template>
  <!-- Кнопка, що плаває у верхньому правому куті -->
  <div class="chat-hover-area" @mouseenter="showChat = true" @mouseleave="showChat = false">
    <button v-if="!showChat" class="button" :disabled="loading" aria-label="Open chat">
      <img src="/src/assets/light-bulb.png" alt="question-mark" class="question-mark" />
    </button>
    <!-- Віконце чату, що з'являється справа -->
    <transition name="fade-chat">
      <div v-if="showChat" class="chat-window">
        <div v-if="loading" class="chat-message ai">⏳ Loading...</div>
        <div v-else-if="fact" class="chat-message ai">💡 {{ fact }}</div>
        <div v-else-if="!fact" class="chat-message ai">
          ❗You can use the following hints, but keep in mind that you will lose N points for each
          hint used.
        </div>
        <div v-else-if="error" class="chat-message ai error">❗ {{ error }}</div>
        <div class="hint-options" v-if="!loading">
          <button
            class="hint-option-btn"
            v-for="option in hintOptions"
            :key="option.key"
            @click="fetchFact(option.prompt, option.key)"
            :disabled="loading"
            :class="{
              'selected-hint-btn': selectedHintKey === option.key,
              'used-hint-btn': usedHintKeys.includes(option.key) && selectedHintKey !== option.key,
            }"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { GoogleGenerativeAI } from '@google/generative-ai'
import { ref, watch } from 'vue'

const props = defineProps({
  movieTitle: {
    type: String,
    required: true,
  },
  isAnswered: {
    type: Boolean,
    default: false,
  },
})

const showChat = ref(false)
const fact = ref('')
const loading = ref(false)
const error = ref('')
const selectedHintKey = ref(null)
const usedHintKeys = ref([])

const API_KEY = 'AIzaSyAG-l1AAbD1SCYS11c4ChvHyGY8RhGI2xQ'
const genAI = new GoogleGenerativeAI(API_KEY)

const hintOptions = [
  {
    key: 'year',
    label: 'Year of release',
    prompt: `Give a year of the release year of the film "${props.movieTitle}". Do not mention the title.`,
  },
  {
    key: 'genre',
    label: 'Genre',
    prompt: `Give the genre of the film "${props.movieTitle}". Do not mention the title.`,
  },
  {
    key: 'actors',
    label: 'Main actors',
    prompt: `Give some main actors of the film "${props.movieTitle}". Do not mention the title.`,
  },
  {
    key: 'plot',
    label: 'Plot hint',
    prompt: `Give a hint about the plot of the film "${props.movieTitle}" without spoilers. Do not mention the title.`,
  },
  {
    key: 'awards',
    label: 'Awards or records',
    prompt: `Give an awards or records related to the film "${props.movieTitle}". Do not mention the title.`,
  },
]

async function fetchFact(customPrompt, key) {
  loading.value = true
  fact.value = ''
  error.value = ''
  selectedHintKey.value = key
  if (!usedHintKeys.value.includes(key)) {
    usedHintKeys.value.push(key)
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    let prompt
    if (customPrompt) {
      prompt = customPrompt
    }

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = await response.text()

    if (text && text.trim()) {
      fact.value = text.trim()
    } else {
      fact.value = props.isAnswered
        ? `Could not get the fact about "${props.movieTitle}".`
        : 'Could not get a hint.'
    }
  } catch (err) {
    console.error('Gemini API error:', err)
    error.value = 'There was an error retrieving information. Please try again.'
  } finally {
    loading.value = false
  }
}

watch(
  () => props.isAnswered,
  () => {
    fact.value = ''
    showChat.value = false
    selectedHintKey.value = null
    usedHintKeys.value = []
  },
)

watch(
  () => props.movieTitle,
  () => {
    fact.value = ''
    showChat.value = false
    loading.value = false
    error.value = ''
    selectedHintKey.value = null
    usedHintKeys.value = []
  },
)
</script>

<style scoped>
.selected-hint-btn {
  background-color: var(--color-accent) !important;
  color: var(--color-white) !important;
}
.used-hint-btn {
  background-color: var(--color-primary-light) !important;
  color: var(--color-primary) !important;
}

.button {
  position: absolute;
  background: var(--color-white);
  box-shadow: 0 0 20px var(--color-black-shadow);
  border: none;
  right: 6px;
  bottom: 10px;
  width: 80px;
  height: 80px;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fade-chat-enter-active,
.fade-chat-leave-active {
  transition:
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-chat-enter-from,
.fade-chat-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.fade-chat-enter-to,
.fade-chat-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.chat-window {
  width: 200px;
  position: absolute;
  border: none;
  right: 6px;
  bottom: 10px;
  background: var(--color-white);
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 0 3px 8px var(--color-black-shadow);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
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
  box-shadow: 0 2px 8px var(--color-black-shadow);
  border: none;
  border-radius: 20px;
  padding: 0.3rem 0.6rem;
  font-size: 0.85rem;
  cursor: pointer;
  margin: 0.2rem auto;
  width: auto;
  text-align: center;
  transition: all 0.3s;
  display: inline-block;
}

.hint-option-btn:hover {
  transform: scale(1.2);
  box-shadow: 0 7px 12px var(--color-black-shadow);
}

.chat-message {
  margin: 0.3rem 0;
  padding: 0.4rem 0.6rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

.chat-message.user {
  background-color: var(--color-primary-light);
  color: var(--color-black);
  border-radius: 20px;
}

.chat-message.ai {
  background-color: var(--color-primary-light);
  color: var(--color-black);
  border-radius: 20px;
}
</style>
