<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-mid">
        <div class="nav-left">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/game">Game</RouterLink>
          <RouterLink to="/leaderboard">Leaderboard</RouterLink>
          <RouterLink to="/profile">Profile</RouterLink>
        </div>
        <div class="nav-right">
          <template v-if="isAuthenticated">
            <button class="login-btn" @click="handleLogout">Logout</button>
          </template>
          <template v-else>
            <RouterLink to="/registration">
              <RouterLink to="/login">
                <button class="login-btn">Login</button>
              </RouterLink>
            </RouterLink>
          </template>
        </div>
      </div>
      <div class="burger-wrapper-mobile">
        <button class="burger-btn" @click="burgerOpen = !burgerOpen" aria-label="Open menu">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect y="4" width="24" height="2" rx="1" fill="currentColor" />
            <rect y="11" width="24" height="2" rx="1" fill="currentColor" />
            <rect y="18" width="24" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
        <transition name="fade">
          <div v-if="burgerOpen" class="mobile-menu-overlay" @click.self="burgerOpen = false">
            <div class="mobile-menu">
              <div class="mobile-menu-links">
                <RouterLink to="/" @click="closeBurger">Home</RouterLink>
                <RouterLink to="/game" @click="closeBurger">Game</RouterLink>
                <RouterLink to="/leaderboard" @click="closeBurger">Leaderboard</RouterLink>
                <RouterLink to="/profile" @click="closeBurger">Profile</RouterLink>
              </div>
              <div class="mobile-menu-actions">
                <template v-if="isAuthenticated">
                  <button class="login-btn" @click="handleLogoutAndClose">Logout</button>
                </template>
                <template v-else>
                  <RouterLink to="/registration" @click="closeBurger">
                    <RouterLink to="/login" @click="closeBurger">
                      <button class="login-btn">Login</button>
                    </RouterLink>
                  </RouterLink>
                </template>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </nav>

    <main>
      <RouterView />
    </main>

    <footer class="footer">
      <div class="footer-mid">
        <div class="footer-left">
          <p>&copy; 2025 Movie Quiz App</p>
        </div>
        <div class="footer-right">
          <a href="https://facebook.com" target="_blank">Facebook</a>
          <a href="https://twitter.com" target="_blank">Twitter</a>
          <a href="https://instagram.com" target="_blank">Instagram</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)
const router = useRouter()

const burgerOpen = ref(false)

const closeBurger = () => {
  burgerOpen.value = false
}
const handleLogoutAndClose = async () => {
  await handleLogout()
  closeBurger()
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.navbar {
  box-sizing: border-box;
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  color: var(--color-white);
  border-radius: 20px;
  box-shadow: 0 0 20px var(--color-black-shadow);
  border: 10px solid var(--color-white);
  transition: all 0.5s;
  position: relative;
  z-index: 10;
}

.navbar:hover {
  transform: scale(1.01);
  box-shadow: 0 10px 30px var(--color-black-shadow);
}

.nav-mid {
  display: flex;
  justify-content: space-between;
  width: 1000px;
  margin-inline: 20px;
}

.nav-left {
  height: 60px;
  display: flex;
  align-items: center;
}

.nav-left a {
  color: var(--color-white);
  text-decoration: none;
  margin-right: 3rem;
  transition:
    transform 0.3s ease,
    color 0.3s ease;
  display: inline-block;
}

.nav-left a.router-link-exact-active {
  color: var(--color-accent);
  transform: scale(1.5);
}

.nav-left a.router-link-exact-active:hover {
  color: var(--color-accent);
  transform: scale(1.6);
}

.nav-left a:hover {
  transform: scale(1.3) translateY(-3px);
}

.nav-right {
  height: 60px;
  display: flex;
  align-items: center;
}

.nav-right .login-btn {
  background-color: var(--color-white);
  border: none;
  padding: 0.5rem 1rem;
  color: var(--color-primary);
  border-radius: 20px;
  cursor: pointer;
}

.nav-right .login-btn:hover {
  background-color: var(--color-accent);
  color: var(--color-white);
}

.nav-right .router-link-exact-active .login-btn {
  background-color: var(--color-accent);
  color: var(--color-white);
  transform: scale(1.2);
  transition:
    transform 0.3s ease,
    color 0.3s ease;
}

.nav-right .router-link-exact-active .login-btn:hover {
  transform: scale(1.3);
}

main {
  display: flex;
  flex-direction: column;
  min-height: 78vh;
  width: 1000px;
  margin: 20px;
}

.footer {
  box-sizing: border-box;
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  color: var(--color-white);
  border-radius: 20px;
  box-shadow: 0 0 20px var(--color-black-shadow);
  border: 10px solid var(--color-white);
  transition: all 0.5s;
}

.footer:hover {
  transform: scale(1.01);
  box-shadow: 0 10px 30px var(--color-black-shadow);
}

.footer-mid {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1000px;
  margin-inline: 20px;
}

.footer a {
  color: var(--color-white);
  text-decoration: none;
  margin-left: 2rem;
  display: inline-block;
  transition:
    transform 0.2s ease-in-out,
    color 0.2s ease-in-out;
}

.footer a:hover {
  color: var(--color-accent);
  transform: scale(1.1) translateY(-2px);
}

@media (max-width: 1024px) {
  main {
    max-width: 100%;
  }
}

.burger-wrapper-mobile {
  display: none;
}
@media (max-width: 600px) {
  .nav-mid {
    display: none !important;
  }
  .burger-wrapper-mobile {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    z-index: 20;
  }
}

.burger-btn {
  display: flex;
  background: none;
  border: none;
  color: var(--color-white);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 20px;
  margin-right: 10px;
  font-size: 2rem;
  transition: background 0.3s;
}

.burger-btn:active, .burger-btn:focus {
  background: var(--color-accent);
}

.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}
.mobile-menu {
  box-sizing: border-box;
  background: var(--color-white);
  color: var(--color-primary);
  width: 70vw;
  height: 100vh;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  box-shadow: 0 0 20px var(--color-black-shadow);
  display: flex;
  flex-direction: column;
  padding: 30px;
  animation: slideIn 0.3s;
  justify-content: space-between;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.mobile-menu-links {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.mobile-menu-links a {
  color: var(--color-primary);
  font-size: 1.3rem;
  text-decoration: none;
  transition: color 0.3s;
}
.mobile-menu-links a.router-link-exact-active {
  color: var(--color-accent);
}
.mobile-menu .router-link-exact-active .login-btn {
  background: var(--color-accent);
}

.mobile-menu .login-btn {
  width: 100%;
  font-size: 1.3rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  font-weight: 600;
}

</style>
