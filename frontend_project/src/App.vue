
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
          <RouterLink to="/login">
            <button class="login-btn">Login</button>
          </RouterLink>
        </div>
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
</script>

<style scoped>
#app{
  display: flex;
  flex-direction: column; /* или row, если нужно по горизонтали */
  align-items: center;     /* по горизонтали */
  justify-content: center; /* по вертикали */
}

.navbar {
  box-sizing: border-box;
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  color: white;
  border-radius: 20px;
}

.nav-mid{
  display: flex;
  justify-content: space-between;
  width: 1100px;
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
  transition: transform 0.3s ease, color 0.3s ease;
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
  transition: transform 0.3s ease, color 0.3s ease;
}

.nav-right .router-link-exact-active .login-btn:hover{
  transform: scale(1.3);
}



main {
  min-height: 81vh;
  width: 1100px;
  padding: 20px;
}



.footer {
  box-sizing: border-box;
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  color: white;
  border-radius: 20px;
}

.footer-mid{
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1100px;
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
