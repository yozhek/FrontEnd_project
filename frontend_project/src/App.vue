
<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-left">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/game">Game</RouterLink>
        <RouterLink to="/leaderboard">Leaderboard</RouterLink>
        <RouterLink to="/profile">Profile</RouterLink>
      </div>
      <div class="nav-right">
        <RouterLink to="/login">
          <button class="login-btn">Login</button>
        </RouterLink>
      </div>
    </nav>

    <main>
      <RouterView />
    </main>

    <footer class="footer">
      <div class="footer-left">
        <p>&copy; 2025 Movie Quiz App</p>
      </div>
      <div class="footer-right">
        <a href="https://facebook.com" target="_blank">Facebook</a>
        <a href="https://twitter.com" target="_blank">Twitter</a>
        <a href="https://instagram.com" target="_blank">Instagram</a>
      </div>
    </footer>

  </div>
</template>

<script setup>
</script>

<style scoped>
.navbar {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-primary);
  color: white;
  border-radius: 20px;
  padding: 0 20px;
}

.nav-left {
  height: 60px;
  display: flex;
  align-items: center;
}

.nav-left a{
  color: white;
  text-decoration: none;
  margin-right: 3rem;
  transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;
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
  transform: scale(1.3) translateY(-5px);
}

.nav-right {
  height: 60px;
  display: flex;
  align-items: center;
}

.nav-right .login-btn {
  background-color: white;
  border: none;
  padding: 0.5rem 1rem;
  color: var(--color-primary);
  border-radius: 20px;
  cursor: pointer;
}

.nav-right .login-btn:hover {
  background-color: var(--color-accent);
  color: white;
}

.nav-right .router-link-exact-active .login-btn{
  background-color: var(--color-accent);
  color: white;
  transform: scale(1.2);
  transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;
}

.nav-right .router-link-exact-active .login-btn:hover{
  transform: scale(1.3);
}



main {
  height: 81vh;
  padding: 20px;
}



.footer {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-primary);
  color: white;
  border-radius: 20px;
  padding: 0 20px;
}

.footer a {
  color: white;
  text-decoration: none;
  margin-left: 2rem;
  display: inline-block;
  transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;
}

.footer a:hover {
  color: var(--color-accent);
  transform: scale(1.1) translateY(-2px);
}
</style>
