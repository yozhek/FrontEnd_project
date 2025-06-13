<template>
  <div class="main-info">
    <div class="auth-form">
      <h2 class="auth-title">Welcome to MovieGuess</h2>
      <p class="auth-description">Log in to start your movie guessing adventure!</p>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="Enter your email"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Enter your password"
          />
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div class="buttons">
          <button type="submit" class="login-btn" :disabled="loading">{{ loading ? 'Logging in...' : 'Login' }}</button>
          <button type="button" class="register-btn" @click="goToRegister">
            Create Account
          </button>
        </div>
      </form>
      <div class="divider">
        <span>or</span>
      </div>
      <button class="google-btn" @click="handleGoogleLogin" :disabled="loading">
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
const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

const handleSubmit = async () => {
  error.value = null
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    router.push('/profile')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  error.value = null
  loading.value = true
  try {
    await authStore.loginWithGoogle()
    router.push('/profile')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/registration')
}
</script>

<style scoped>
@import '@/assets/auth-forms.css';
</style>
