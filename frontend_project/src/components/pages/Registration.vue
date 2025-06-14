<template>
  <div class="main-info">
    <div class="auth-form">
      <h2 class="auth-title">Create Your Account</h2>
      <p class="auth-description">Join MovieGuess and start your movie guessing adventure!</p>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            required
            placeholder="Choose your username"
            @input="onNicknameInput"
          />
          <div v-if="nicknameError" class="error-message">{{ nicknameError }}</div>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="Enter your email"
            @input="onEmailInput"
          />
          <div v-if="emailError" class="error-message">{{ emailError }}</div>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Create a password"
          />
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div class="buttons">
          <button type="submit" class="login-btn" :disabled="loading">{{ loading ? 'Creating...' : 'Create Account' }}</button>
          <button type="button" class="register-btn" @click="goToLogin">
            Already have an account? Login
          </button>
        </div>
      </form>
      <div class="divider">
        <span>or</span>
      </div>
      <button class="google-btn" @click="handleGoogleRegister" :disabled="loading">
        <img src="@/assets/google-logo.svg" alt="Google logo" class="google-logo" />
        Continue with Google
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)
const emailError = ref(null)
const nicknameError = ref(null)

defineOptions({ name: 'RegistrationPage' })

function validateEmail(email) {
  // Простая email-маска
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

async function isNicknameTaken(nickname) {
  // Проверяем уникальность никнейма по всем профилям
  // Firestore не поддерживает прямой поиск по полю без индекса, но для простоты делаем запрос
  const { getDocs, collection, query, where } = await import('firebase/firestore')
  const { db } = await import('@/firebase/config')
  const q = query(collection(db, 'users'), where('nickname', '==', nickname))
  const querySnapshot = await getDocs(q)
  return !querySnapshot.empty
}

const handleSubmit = async () => {
  error.value = null
  loading.value = true
  try {
    if (!validateEmail(email.value)) {
      error.value = 'Please enter a valid email address.'
      return
    }
    if (await isNicknameTaken(username.value)) {
      error.value = 'This nickname is already taken. Please choose another one.'
      return
    }
    await authStore.register(email.value, password.value, username.value)
    router.push('/profile')
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      error.value = 'This email is already in use.'
    } else if (err.code === 'auth/invalid-email') {
      error.value = 'Please enter a valid email address.'
    } else if (err.code === 'auth/weak-password') {
      error.value = 'Password should be at least 6 characters.'
    } else {
      error.value = err.message
    }
  } finally {
    loading.value = false
  }
}

const handleGoogleRegister = async () => {
  error.value = null
  loading.value = true
  try {
    await authStore.loginWithGoogle()
    // Если у пользователя нет профиля, перенаправляем на форму для ввода никнейма
    if (!authStore.userProfile || !authStore.userProfile.nickname) {
      router.push({ name: 'SetNickname' })
    } else {
      router.push('/profile')
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}

function onEmailInput() {
  if (!validateEmail(email.value)) {
    emailError.value = 'Please enter a valid email address.'
  } else {
    emailError.value = null
  }
}

async function onNicknameInput() {
  if (username.value && await isNicknameTaken(username.value)) {
    nicknameError.value = 'This nickname is already taken. Please choose another one.'
  } else {
    nicknameError.value = null
  }
}
</script>

<style scoped>
@import '@/assets/auth-forms.css';
</style>
