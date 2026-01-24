<template>
  <div class="register-container">
    <h1>Creează un Cont</h1>

    <div v-if="!authStore.isAuthenticated">
      <form @submit.prevent="handleSubmit" class="register-form">
        <div class="form-group">
          <label>Email (trebuie să fie @gmail.com):</label>
          <input v-model="email" type="email" placeholder="exemplu@gmail.com" required />
          <span v-if="email && !isEmailValid" class="error">Doar adrese @gmail.com sunt permise</span>
        </div>

        <div class="form-group">
          <label>Parolă (min. 8 caractere):</label>
          <input v-model="password" type="password" required />
        </div>

        <div class="form-group">
          <label>Confirmă Parola:</label>
          <input v-model="confirmPassword" type="password" required />
          <span v-if="confirmPassword && !passwordsMatch" class="error">Parolele nu se potrivesc</span>
        </div>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

        <button type="submit" :disabled="!formIsValid || isLoading" class="submit-btn">
          {{ isLoading ? 'Se înregistrează...' : 'Înregistrare' }}
        </button>
      </form>
    </div>

    <div v-else class="success-section">
      <h2>✓ Înregistrare Reușită!</h2>
      <p>Ești logat ca: <strong>{{ authStore.userEmail }}</strong></p>
      <button @click="router.push('/books')" class="submit-btn">Mergi la Cărți</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const isEmailValid = computed(() => email.value.endsWith('@gmail.com'))
const passwordsMatch = computed(() => password.value === confirmPassword.value)
const formIsValid = computed(() => isEmailValid.value && password.value.length >= 8 && passwordsMatch.value)

async function handleSubmit() {
  errorMessage.value = ''
  isLoading.value = true
  try {
    await authStore.register(email.value, password.value)
    setTimeout(() => router.push('/books'), 2000)
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-container { max-width: 500px; margin: 3rem auto; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
h1 { color: #6B4C3D; text-align: center; margin-bottom: 2rem; }
.register-form { display: flex; flex-direction: column; gap: 1.5rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
input { padding: 0.8rem; border: 1px solid #ddd; border-radius: 6px; }
.submit-btn { padding: 1rem; background: #6B4C3D; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
.submit-btn:disabled { background: #ccc; cursor: not-allowed; }
.error { color: #e74c3c; font-size: 0.85rem; }
.error-message { padding: 1rem; background: #fdeaea; color: #e74c3c; border-radius: 6px; border-left: 4px solid #e74c3c; }
.success-section { text-align: center; padding: 2rem; }
</style>