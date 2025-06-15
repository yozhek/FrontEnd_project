<template>
  <div class="main-info">
    <div v-if="!showVerifyWait" class="auth-form">
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
    <div v-else class="auth-form">
      <h2 class="auth-title">Verify your email</h2>
      <p class="auth-description">
        A verification email has been sent to <b>{{ email }}</b>.<br>
        Please check your inbox and click the link to complete registration.
      </p>
      <div v-if="verifyLoading" class="loading-message" style="text-align:center;margin-bottom:1.5rem;">Waiting for verification...</div>
      <div v-if="verifyError" class="error-message">{{ verifyError }}</div>
      <div class="buttons">
        <button class="login-btn" @click="resendVerification" :disabled="verifyLoading" style="margin-bottom:0;">Resend email</button>
        <button class="register-btn" @click="cancelVerification" :disabled="verifyLoading">Cancel</button>
      </div>
      <div v-if="verificationSent" class="success-message" style="text-align:center;margin-top:1rem;color:var(--color-primary);font-size:1.1rem;">Verification email sent!</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
const showVerifyWait = ref(false)
const verifyLoading = ref(false)
const verifyError = ref(null)
const verifyInterval = ref(null)
const verificationSent = ref(false)

defineOptions({ name: 'RegistrationPage' })

function validateEmail(email) {
  // Simple email mask
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

async function isNicknameTaken(nickname) {
  // Check nickname uniqueness among all profiles
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
    const user = await authStore.register(email.value, password.value)
    showVerifyWait.value = true
    verificationSent.value = true
    startVerificationCheck(user, username.value)
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

async function startVerificationCheck(user, nickname) {
  verifyLoading.value = true
  verifyError.value = null
  verifyInterval.value = setInterval(async () => {
    const verified = await authStore.checkEmailVerified()
    if (verified) {
      clearInterval(verifyInterval.value)
      // Create profile only after email is verified
      const { createUserProfile } = await import('@/services/userProfile')
      await createUserProfile(user.uid, { email: user.email, nickname })
      // Реальный re-login для реактивности
      const { signInWithEmailAndPassword, signOut } = await import('firebase/auth')
      const { auth } = await import('@/firebase/config')
      await signOut(auth)
      await signInWithEmailAndPassword(auth, user.email, password.value)
      await authStore.init()
      router.push('/profile')
    }
  }, 4000)
}

const resendVerification = async () => {
  verifyError.value = null
  try {
    await authStore.resendVerificationEmail()
    verificationSent.value = true
  } catch {
    verifyError.value = 'Error sending email. Please try again later.'
  }
}

const cancelVerification = async () => {
  // Log out user and redirect to login
  await authStore.logout()
  username.value = ''
  email.value = ''
  password.value = ''
  error.value = null
  loading.value = false
  emailError.value = null
  nicknameError.value = null
  showVerifyWait.value = false
  verifyLoading.value = false
  verifyError.value = null
  verifyInterval.value = null
  verificationSent.value = false
  router.push('/login')
}

onMounted(() => {
  // Clear interval on unmount
  return () => {
    if (verifyInterval.value) clearInterval(verifyInterval.value)
  }
})
</script>

<style scoped>
@import '@/assets/auth-forms.css';
.success-message {
  text-align: center;
  color: var(--color-primary);
  font-size: 1.1rem;
  margin-top: 1rem;
}
.loading-message {
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}
</style>
