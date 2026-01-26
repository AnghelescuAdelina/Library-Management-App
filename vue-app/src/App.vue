<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth' 
const router = useRouter()
const authStore = useAuthStore() 

function handleLogout() {
  authStore.logout()
  router.push('/login') 
}
</script>

<template>
  <header class="navbar">
    <div class="nav-container">
      <RouterLink to="/" class="brand">
        <img alt="Library logo" class="logo" src="@/assets/Library Logo.png" />
        <span class="brand-name">BiblioTech</span>
      </RouterLink>

      <nav class="wrapper">
        <div class="nav-links">
          <RouterLink to="/books">Cărți</RouterLink>

          <template v-if="!authStore.isAuthenticated">
            <RouterLink to="/login">Autentificare</RouterLink>
            <RouterLink to="/register" class="btn-primary">Cont Nou</RouterLink>
          </template>

          <template v-else>
            <span class="welcome-msg">Salut, {{ authStore.user.userEmail || 'Utilizator' }}</span>
            
            <button @click="handleLogout" class="btn-logout">Ieșire</button>
          </template>
        </div>
      </nav>
    </div>
  </header>

  <main class="main-content">
    <RouterView />
  </main>
</template>

<style scoped>
.navbar {
  background-color: #CBB799;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position:static;
  top: 0;
  z-index: 1000;
  width: 100%;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
}

.logo {
  height: 200px;
  width: 200px;
  object-fit: contain;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: #653607; 
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-links a {
  text-decoration: none;
  color: #6B4C3D;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover, .nav-links a.router-link-active {
  color: #1e3a8a;
}

.welcome-msg {
  color: #1e293b;
  font-size: 0.9rem;
  font-weight: 600;
  border-left: 2px solid #e2e8f0;
  padding-left: 1.5rem;
}

.btn-primary {
  background-color: #6B4C3D;
  color: white !important;
  padding: 0.5rem 1.25rem !important;
  border-radius: 8px;
  font-weight: 600;
}

.btn-logout {
  background:white;
  border: 1px solid #e2e8f0;
  color: #ef4444;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-logout:hover {
  background-color: #fef2f2;
  border-color: #fecaca;
}

.main-content {
  padding-top: 1rem;
}
</style>