<template>
  <div class="main-profile">
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
defineOptions({ name: 'LoginPage' })

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
    if (err.code === 'auth/email-not-verified') {
      error.value = 'Please verify your email before logging in. Check your inbox and click the verification link.'
    } else if (err.code === 'auth/wrong-password') {
      error.value = 'Incorrect password. Please try again.'
    } else if (err.code === 'auth/user-not-found') {
      error.value = 'No user found with this email.'
    } else if (err.code === 'auth/invalid-email') {
      error.value = 'Please enter a valid email address.'
    } else if (err.code === 'auth/invalid-credential') {
      const { getDocs, collection, query, where } = await import('firebase/firestore')
      const { db } = await import('@/firebase/config')
      const q = query(collection(db, 'users'), where('email', '==', email.value))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        error.value = 'Incorrect password. Please try again.'
      } else {
        error.value = 'No user found with this email.'
      }
    } else {
      error.value = err.message
    }
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  error.value = null
  loading.value = true
  try {
    await authStore.loginWithGoogle()
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

const goToRegister = () => {
  router.push('/registration')
}
</script>

<style scoped>
@import '@/assets/auth-forms.css';
</style>
