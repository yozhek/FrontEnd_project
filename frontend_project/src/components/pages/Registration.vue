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
        <div class="buttons">
          <button type="submit" class="login-btn">Create Account</button>
          <button type="button" class="register-btn" @click="goToLogin">
            Already have an account? Login
          </button>
        </div>
      </form>
      <div class="divider">
        <span>or</span>
      </div>
      <button class="google-btn" @click="handleGoogleRegister">
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
const username = ref('')
const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  try {
    // Here will be registration logic
    console.log('Registration attempt:', {
      username: username.value,
      email: email.value,
      password: password.value
    })
  } catch (error) {
    console.error('Registration error:', error)
  }
}

const handleGoogleRegister = async () => {
  try {
    // Here will be Google registration logic
    console.log('Google registration attempt')
  } catch (error) {
    console.error('Google registration error:', error)
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
@import '@/assets/auth-forms.css';
</style>
