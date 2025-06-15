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
              <button v-if="!isGoogleUser" class="btn-change">Change</button>
            </div>

            <div class="info-item setting-row">
              <div>
                <span class="label">Password:</span>
                <span class="value">••••••••</span>
              </div>
              <button v-if="!isGoogleUser" class="btn-change" @click="showPasswordForm = true">Change</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Всплывающая форма смены пароля -->
      <div v-if="showPasswordForm" class="modal-overlay">
        <div class="auth-form modal-form">
          <h2 class="auth-title">Change Password</h2>
          <form @submit.prevent="handleChangePassword">
            <div class="form-group">
              <label for="oldPassword">Current Password</label>
              <input type="password" id="oldPassword" v-model="oldPassword" required placeholder="Enter current password" />
            </div>
            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input type="password" id="newPassword" v-model="newPassword" required placeholder="Enter new password" />
            </div>
            <div class="form-group">
              <label for="repeatPassword">Repeat New Password</label>
              <input type="password" id="repeatPassword" v-model="repeatPassword" required placeholder="Repeat new password" />
            </div>
            <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
            <div v-if="passwordSuccess" class="success-message">{{ passwordSuccess }}</div>
            <div class="buttons">
              <button class="login-btn" type="submit" :disabled="passwordLoading">{{ passwordLoading ? 'Saving...' : 'Save' }}</button>
              <button class="register-btn" type="button" @click="closePasswordForm" :disabled="passwordLoading">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
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

// Новое вычисляемое свойство для определения Google-пользователя
const isGoogleUser = computed(() => {
  const u = authStore.user;
  if (!u || !u.providerData || !Array.isArray(u.providerData)) return false;
  return u.providerData.some(p => p.providerId === 'google.com');
})

function goToLogin() {
  router.push('/login')
}
function goToRegister() {
  router.push('/registration')
}

// --- Смена пароля ---
const showPasswordForm = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const repeatPassword = ref('')
const passwordError = ref('')
const passwordSuccess = ref('')
const passwordLoading = ref(false)

function closePasswordForm() {
  showPasswordForm.value = false
  oldPassword.value = ''
  newPassword.value = ''
  repeatPassword.value = ''
  passwordError.value = ''
  passwordSuccess.value = ''
}

async function handleChangePassword() {
  passwordError.value = ''
  passwordSuccess.value = ''

  // Validation
  if (!oldPassword.value || !newPassword.value || !repeatPassword.value) {
    passwordError.value = 'Please fill in all fields.'
    return
  }
  if (newPassword.value.length < 6) {
    passwordError.value = 'New password must be at least 6 characters.'
    return
  }
  if (newPassword.value !== repeatPassword.value) {
    passwordError.value = 'New passwords do not match.'
    return
  }
  if (oldPassword.value === newPassword.value) {
    passwordError.value = 'New password must be different from the current password.'
    return
  }

  passwordLoading.value = true
  try {
    await authStore.changePassword(oldPassword.value, newPassword.value)
    passwordSuccess.value = 'Password changed successfully!'
    // Clear form fields after successful change
    oldPassword.value = ''
    newPassword.value = ''
    repeatPassword.value = ''
    // Close form after delay
    setTimeout(() => {
      closePasswordForm()
    }, 1500)
  } catch (err) {
    // Handle specific Firebase error codes
    switch (err.code) {
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        passwordError.value = 'Current password is incorrect.'
        break
      case 'auth/requires-recent-login':
        passwordError.value = 'Please log in again to change your password.'
        break
      case 'auth/too-many-requests':
        passwordError.value = 'Too many attempts. Please try again later.'
        break
      default:
        passwordError.value = err.message || 'Failed to change password. Please try again.'
    }
  } finally {
    passwordLoading.value = false
  }
}
</script>

<style scoped>
@import '@/assets/profile.css';
@import '@/assets/auth-forms.css';

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-form {
  max-width: 400px;
  min-width: 320px;
  width: 100%;
  box-shadow: 0 0 30px var(--color-black-shadow);
  border-radius: 20px;
}
.success-message {
  text-align: center;
  color: var(--color-primary);
  font-size: 1.1rem;
  margin-top: 1rem;
}
</style>
