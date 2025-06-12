<template>
  <div class="main-info">
    <div class="auth-form">
      <h2 class="auth-title">Welcome to MovieGuess</h2>
      <p class="auth-description">Log in to start your movie guessing adventure!</p>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="login">Username</label>
          <input
            type="text"
            id="login"
            v-model="login"
            required
            placeholder="Enter your username"
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
        <div class="buttons">
          <button type="submit" class="login-btn">Login</button>
          <button type="button" class="register-btn" @click="goToRegister">
            Create Account
          </button>
        </div>
      </form>
      <div class="divider">
        <span>or</span>
      </div>
      <button class="google-btn" @click="handleGoogleLogin">
        <img src="@/assets/google-logo.svg" alt="Google logo" class="google-logo" />
        Continue with Google
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const login = ref('')
const password = ref('')

const handleSubmit = async () => {
  try {
    // Here will be authentication logic
    console.log('Login attempt:', { login: login.value, password: password.value })
  } catch (error) {
    console.error('Auth error:', error)
  }
}

const handleGoogleLogin = async () => {
  try {
    // Here will be Google authentication logic
    console.log('Google login attempt')
  } catch (error) {
    console.error('Google auth error:', error)
  }
}

const goToRegister = () => {
  router.push('/registration')
}
</script>

<style scoped>
@import '@/assets/auth-forms.css';
</style>
