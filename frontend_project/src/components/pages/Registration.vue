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
          />
        </div>
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
import { updateProfile } from 'firebase/auth'

const router = useRouter()
const authStore = useAuthStore()
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

const handleSubmit = async () => {
  error.value = null
  loading.value = true
  try {
    const user = await authStore.register(email.value, password.value)
    // Сохраняем username в профиле пользователя
    await updateProfile(user, { displayName: username.value })
    router.push('/profile')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleGoogleRegister = async () => {
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

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
@import '@/assets/auth-forms.css';
</style>
