<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBooksStore } from '@/stores/books'
import { useAuthStore } from '@/stores/auth'
import { S } from 'vue-router/dist/router-CWoNjPRp.mjs'

const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()
const authStore = useAuthStore()

const id = route.params.id
const isEditing = ref(false)
const bookData = ref({ title: '', author: '', publishedYear: '', stock:0 })

onMounted(async () => {
  const book = booksStore.books.find(b => b.id === id)
  if (book) {
    bookData.value = { ...book }
  } else {
    const fetchedBook = await booksStore.fetchBook(id)
    if(fetchedBook){
        bookData.value={...fetchedBook}
    }
  }
})

async function handleUpdate() {
  await booksStore.updateBook(id, bookData.value)
  if (!booksStore.error) {
    isEditing.value = false
    alert('Cartea a fost actualizată!')
  }
}

async function handleBorrow() {
  await booksStore.borrowBook(id)
  if (!booksStore.error) {
    alert('Carte împrumutată cu succes!')
    bookData.value.stock -= 1
  }
}

async function handleDelete() {
  if (confirm('Sigur vrei să ștergi această carte?')) {
    await booksStore.deleteBook(id)
    if (!booksStore.error) {
      router.push('/books')
    }
  }
}
</script>

<template>
  <div class="container">
    <h1>Detalii Carte</h1>
    
    <div v-if="!isEditing" class="details-card">
      <div class="info">
        <p><strong>Titlu:</strong> {{ bookData.title }}</p>
        <p><strong>Autor:</strong> {{ bookData.author }}</p>
        <p><strong>An:</strong> {{ bookData.publishedYear }}</p>
        <p><strong>Stoc disponibil:</strong> {{ bookData.stock }} exemplare</p>
      </div>

      <div class="actions">
        <button 
          v-if="authStore.isAuthenticated" 
          @click="handleBorrow" 
          :disabled="bookData.stock <= 0"
          class="borrow-btn"
        >
          {{ bookData.stock > 0 ? 'Împrumută Cartea' : 'Stoc Epuizat' }}
        </button>

        <template v-if="authStore.isAdmin">
          <button @click="isEditing = true" class="edit-btn">Editează</button>
          <button @click="handleDelete" class="delete-btn">Șterge</button>
        </template>
      </div>
    </div>

    <form v-else @submit.prevent="handleUpdate">
      <div class="actions">
        <button type="submit" class="save-btn">Salvează</button>
        <button type="button" @click="isEditing = false" class="cancel-btn">Anulează</button>
      </div>
    </form>
    
    <button @click="router.push('/books')" class="back-btn">← Înapoi la listă</button>
  </div>
</template>

<style scoped>
.container { max-width: 600px; margin: 2rem auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
.form-group { margin-bottom: 1rem; }
input { width: 100%; padding: 8px; margin-top: 5px; }
.actions { margin-top: 20px; display: flex; gap: 10px; }
.edit-btn { background: #3498db; color: white; border: none; padding: 10px; cursor: pointer; }
.delete-btn { background: #e74c3c; color: white; border: none; padding: 10px; cursor: pointer; }
.save-btn { background: #2ecc71; color: white; border: none; padding: 10px; cursor: pointer; }
.cancel-btn { background: #95a5a6; color: white; border: none; padding: 10px; cursor: pointer; }
.back-btn { margin-top: 20px; background: none; border: 1px solid #ccc; cursor: pointer; }
</style>