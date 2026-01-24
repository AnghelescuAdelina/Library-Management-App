<script setup>
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
</script>

<template>
  <main class="home-container">
    <div class="welcome-section">
      <h1>Sistem Gestiune Bibliotecă</h1>
      <p v-if="authStore.isAuthenticated">
        Bine ai revenit, <strong>{{ authStore.userEmail }}</strong>! 
        <span class="role-badge">{{ authStore.isAdmin ? 'Administrator' : 'Cititor' }}</span>
      </p>
      <p v-else>Autentifică-te pentru a vedea colecția de cărți și istoricul tău.</p>
    </div>

    <div class="dashboard-grid">
      <div v-if="authStore.isAuthenticated" class="card">
        <h3>📚 Biblioteca</h3>
        <p>Vezi lista completă de cărți și disponibilitatea lor.</p>
        <RouterLink to="/books" class="action-link">Vezi Cărți</RouterLink>
      </div>

      <div v-if="authStore.isAdmin" class="card admin-card">
        <h3>⚙️ Gestiune Inventar</h3>
        <p>Adaugă titluri noi în baza de date a bibliotecii.</p>
        <RouterLink to="/books/create" class="action-link">Adaugă Carte</RouterLink>
      </div>

      <div v-if="authStore.isAuthenticated && !authStore.isAdmin" class="card">
        <h3>⏳ Istoricul Meu</h3>
        <p>Vezi ce cărți ai împrumutat și când trebuie returnate.</p>
        <RouterLink to="/history" class="action-link">Vezi Istoric</RouterLink>
      </div>

      <div v-if="!authStore.isAuthenticated" class="card login-card">
        <h3>🔑 Începe acum</h3>
        <p>Creează un cont cu adresa @gmail.com pentru a împrumuta cărți.</p>
        <RouterLink to="/register" class="action-link">Înregistrează-te</RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
.home-container {
  max-width: 900px;
  margin: 3rem auto;
  padding: 0 2rem;
  text-align: center;
}

.welcome-section {
  margin-bottom: 3rem;
}

.welcome-section h1 {
  color: #6e3208;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.role-badge {
  background: #6B4C3D;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-left: 0.5rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.card {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-top: 5px solid #341F1A;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.admin-card {
  border-top-color: #e67e22; 
}

.login-card {
  border-top-color: #6B4C3D;
}

.action-link {
  display: inline-block;
  margin-top: 1rem;
  color: #583224;
  text-decoration: none;
  font-weight: bold;
}

.action-link:hover {
  text-decoration: underline;
}
</style>