<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBooksStore } from '@/stores/books'

const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()

const id = route.params.id
const isEditing = ref(false)
const bookData = ref({ title: '', author: '', publishedYear: '' })

onMounted(async () => {
  // Căutăm cartea în lista deja descărcată în store
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
    
    <div v-if="!isEditing">
      <p><strong>Titlu:</strong> {{ bookData.title }}</p>
      <p><strong>Autor:</strong> {{ bookData.author }}</p>
      <p><strong>An:</strong> {{ bookData.publishedYear }}</p>
      
      <div class="actions">
        <button @click="isEditing = true" class="edit-btn">Editează</button>
        <button @click="handleDelete" class="delete-btn">Șterge</button>
      </div>
    </div>

    <form v-else @submit.prevent="handleUpdate">
      <div class="form-group">
        <label>Titlu:</label>
        <input v-model="bookData.title" required>
      </div>
      <div class="form-group">
        <label>Autor:</label>
        <input v-model="bookData.author" required>
      </div>
      <div class="form-group">
        <label>An:</label>
        <input v-model="bookData.publishedYear" type="number" required>
      </div>
      
      <div class="actions">
        <button type="submit" class="save-btn">Salvează</button>
        <button type="button" @click="isEditing = false" class="cancel-btn">Anulează</button>
      </div>
    </form>
    
    <button @click="router.push('/books')" class="back-btn">Înapoi la listă</button>
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