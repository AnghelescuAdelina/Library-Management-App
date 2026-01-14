<script setup>
import { ref } from 'vue'
import { useBooksStore } from '@/stores/books'
import { useRouter } from 'vue-router'

const booksStore = useBooksStore()
const router = useRouter()

const title = ref('')
const author = ref('')
const publishedYear = ref('')

async function handleSubmit() {
  const newBook = {
    title: title.value,
    author: author.value,
    publishedYear: parseInt(publishedYear.value) 
  }

  await booksStore.createBook(newBook)
  
  if (!booksStore.error) {
    router.push('/books') 
  }
}
</script>

<template>
  <div class="container">
    <h1>Adaugă o carte nouă</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Titlu:</label>
        <input v-model="title" type="text" required placeholder="Ex: Ion">
      </div>
      
      <div class="form-group">
        <label>Autor:</label>
        <input v-model="author" type="text" required placeholder="Ex: Liviu Rebreanu">
      </div>
      
      <div class="form-group">
        <label>An Publicare:</label>
        <input v-model="publishedYear" type="number" required placeholder="Ex: 1920">
      </div>
      
      <button type="submit" :disabled="booksStore.isLoading">
        {{ booksStore.isLoading ? 'Se salvează...' : 'Salvează Cartea' }}
      </button>
      
      <p v-if="booksStore.error" class="error">{{ booksStore.error }}</p>
    </form>
  </div>
</template>

<style scoped>
.container { max-width: 500px; margin: 2rem auto; }
.form-group { margin-bottom: 1rem; }
label { display: block; margin-bottom: 0.5rem; }
input { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
button { padding: 0.7rem 1.5rem; background: #42b983; color: white; border: none; border-radius: 4px; cursor: pointer; }
button:disabled { background: #ccc; }
.error { color: red; margin-top: 1rem; }
</style>