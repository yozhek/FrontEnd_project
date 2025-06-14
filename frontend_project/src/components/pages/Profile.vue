<template>
  <div class="main-info">
    <!-- Если не авторизован -->
    <div v-if="!currentUserProfile" class="auth-form">
      <h2 class="auth-title">Profile is available only for authorized users</h2>
      <p class="auth-description">Please log in or create an account to view your profile and achievements.</p>
      <div class="buttons">
        <button class="login-btn" @click="goToLogin">Login</button>
        <button class="register-btn" @click="goToRegister">Create Account</button>
      </div>
    </div>

    <!-- Если авторизован -->
    <div v-else class="profile-page">
      <!-- Левая карточка с фото и никнеймом -->
      <div class="profile-card">
        <div class="avatar-wrapper">
          <img src="@/assets/img.png" alt="avatar" class="avatar" />
        </div>
        <h2 class="username">{{ user.nickname }}</h2>

        <div class="info-list">
          <div class="info-item">
            <span class="label">Nickname:</span>
            <span class="value">{{ user.nickname }}</span>
          </div>
          <div class="info-item">
            <span class="label">Points:</span>
            <span class="value">{{ user.totalPoints }} ⭐</span>
          </div>
        </div>
      </div>

      <!-- Правая колонка с двумя карточками -->
      <div class="right-cards">
        <!-- Верхняя карточка: Quiz summary -->
        <div class="quiz-card">
          <h3>Quiz Summary</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="label">Quizzes Taken:</span>
              <span class="value">{{ user.quizzesCompleted }}</span>
            </div>
            <div class="info-item">
              <span class="label">Highest Score:</span>
              <span class="value">98</span>
            </div>
            <div class="info-item">
              <span class="label">Average Score:</span>
              <span class="value">85</span>
            </div>
          </div>
        </div>

        <!-- Нижняя карточка: Настройки -->
        <div class="settings-card">
          <h3>Settings</h3>
          <div class="info-list">
            <div class="info-item setting-row">
              <div>
                <span class="label">Email:</span>
                <span class="value">{{ user.email }}</span>
              </div>
              <button class="btn-change">Change</button>
            </div>

            <div class="info-item setting-row">
              <div>
                <span class="label">Password:</span>
                <span class="value">••••••••</span>
              </div>
              <button class="btn-change">Change</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

defineOptions({ name: 'ProfilePage' })

const authStore = useAuthStore()
const { currentUserProfile } = storeToRefs(authStore)
const router = useRouter()

const user = computed(() => {
  if (!currentUserProfile.value) {
    return {
      email: 'Not authorized',
      nickname: 'Guest',
      quizzesCompleted: '-',
      totalPoints: '-',
    }
  }
  return {
    email: currentUserProfile.value.email,
    nickname: currentUserProfile.value.nickname,
    quizzesCompleted: '-', // Можно заменить на реальные данные, если появятся
    totalPoints: '-', // Можно заменить на реальные данные, если появятся
  }
})

function goToLogin() {
  router.push('/login')
}
function goToRegister() {
  router.push('/registration')
}
</script>

<style scoped>
@import '@/assets/profile.css';
@import '@/assets/auth-forms.css';
</style>
