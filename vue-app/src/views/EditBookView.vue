<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBooksStore } from '@/stores/books'

const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()

const bookData = ref({
  title: '',
  author: '',
  publishedYear: '',
  genre: '',
  quantity: 0 
})

const isLoading = ref(true)

onMounted(async () => {
  try {
    const data = await booksStore.fetchBook(route.params.id)
    if (data) {
      bookData.value = {
        title: data.title,
        author: data.author,
        publishedYear: data.publishedYear,
        genre: data.genre,
        quantity: data.initialQuantity 
      }
    }
  } finally {
    isLoading.value = false
  }
})

const handleUpdate = async () => {
  try {
    await booksStore.updateBook(route.params.id, bookData.value)
    alert('Carte actualizată cu succes!')
    router.push('/books')
  } catch (error) {
    alert('Eroare la actualizare: ' + error.message)
  }
}
</script>

<template>
  <div class="container">
    <h1>Editează Carte</h1>
    
    <div v-if="isLoading">Se încarcă datele...</div>
    
    <form v-else @submit.prevent="handleUpdate" class="edit-form">
      <div class="form-group">
        <label>Titlu:</label>
        <input v-model="bookData.title" required type="text" />
      </div>

      <div class="form-group">
        <label>Autor:</label>
        <input v-model="bookData.author" required type="text" />
      </div>

      <div class="form-group">
        <label>An Publicare:</label>
        <input v-model.number="bookData.publishedYear" required type="number" />
      </div>

      <div class="form-group">
        <label>Gen:</label>
        <input v-model="bookData.genre" required type="text" />
      </div>

      <div class="form-group">
        <label>Stoc Total (initialQuantity):</label>
        <input v-model.number="bookData.quantity" required type="number" min="1" />
        <small>Dacă schimbi acest număr, sistemul va recalcula stocul disponibil.</small>
      </div>

      <div class="actions">
        <button type="submit" class="btn-save">Salvează Modificările</button>
        <button type="button" @click="router.back()" class="btn-cancel">Anulează</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.container { max-width: 600px; margin: 2rem auto; padding: 2rem; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.edit-form { display: flex; flex-direction: column; gap: 1.5rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
input { padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px; }
.actions { display: flex; gap: 1rem; margin-top: 1rem; }
.btn-save { background: #42b983; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 4px; cursor: pointer; font-weight: bold; flex: 1; }
.btn-cancel { background: #94a3b8; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 4px; cursor: pointer; flex: 1; }
</style>