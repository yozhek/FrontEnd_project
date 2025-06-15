<template>
  <div class="main-info">
    <div class="auth-form">
      <h2 class="auth-title">Choose your nickname</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="nickname">Nickname</label>
          <input
            type="text"
            id="nickname"
            v-model="nickname"
            required
            placeholder="Enter your nickname"
          />
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? 'Saving...' : 'Save' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { createUserProfile } from '@/services/userProfile'

defineOptions({ name: 'SetNickname' })

const score = ref(0)
const router = useRouter()
const authStore = useAuthStore()
const nickname = ref('')
const error = ref(null)
const loading = ref(false)

const handleSubmit = async () => {
  error.value = null
  loading.value = true
  try {
    const user = authStore.user
    if (!user) {
      error.value = 'User not authenticated'
      return
    }
    await createUserProfile(user.uid, {
      email: user.email,
      nickname: nickname.value,
      score: score.value
    })
    authStore.userProfile = { email: user.email, nickname: nickname.value, score: score.value}
    router.push('/profile')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import '@/assets/auth-forms.css';
</style>
