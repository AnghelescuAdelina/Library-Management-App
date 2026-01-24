<script setup>
import { ref,onMounted, computed, onUnmounted } from 'vue'                                
import { useBooksStore } from '@/stores/books'                                     
import { useAuthStore } from '@/stores/auth'                                     
import { RouterLink } from 'vue-router' 
import { storeToRefs } from 'pinia';
                                                                                                    
const booksStore = useBooksStore()
const { isLoading, error: errorMessage } = storeToRefs(booksStore);                                        
const authStore = useAuthStore() 
const selectedGenre = ref('')    

const genres = computed(() => {
  const allGenres = booksStore.books.map(book => book.genre).filter(Boolean)
  return [...new Set(allGenres)] 
})

const filteredBooks = computed(() => {
  if (!selectedGenre.value) {
    return booksStore.books
  }
  return booksStore.books.filter(book => book.genre === selectedGenre.value)
})
                                                                  
onMounted(() => {                                                                               
  booksStore.subscribeToBooks();                                                               
});                                                                                             
                                                                                                
onUnmounted(() => {                                                                             
  booksStore.unsubscribe();                                                                     
});    

</script>

<template>
  <div class="container">
    <div class="header-flex">
      <h1>📚 Biblioteca Noastră</h1>
      <RouterLink v-if="authStore.isAdmin" to="/books/create" class="create-btn">
        + Adaugă Carte
      </RouterLink>
    </div>

    <div v-if="isLoading" class="loading">Se încarcă rafturile...</div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    
    <div class="filter-section">
    <label for="genre-filter">Filtrează după gen:</label>
  <select id="genre-filter" v-model="selectedGenre">
    <option value="">Toate genurile</option>
    <option v-for="genre in genres" :key="genre" :value="genre">
      {{ genre }}
    </option>
  </select>
</div>

    <div v-if="filteredBooks.length > 0" class="books-grid">
      <div v-for="book in filteredBooks" :key="book.id" class="book-card">
        <div class="card-content">
          <span class="year-badge">{{ book.publishedYear }}</span>
          <h3>{{ book.title }}</h3>
          <p class="author">de {{ book.author }}</p>
          <p class="stock" :class="{ 'no-stock': book.currentQuantity <= 0 }">
               Stoc: {{ book.currentQuantity > 0 ? book.currentQuantity + ' exemplare' : 'Indisponibil' }}
          </p>
        </div>
        
        <div class="card-actions">
          <RouterLink :to="{ name: 'book-detail', params: { id: book.id } }" class="btn-view">
            Detalii
          </RouterLink>
          <button 
            v-if="authStore.isAuthenticated" 
            @click="booksStore.borrowBook(book.id)"
            :disabled="book.currentQuantity <= 0"
            class="btn-borrow"
          >
            Împrumută
          </button>
        </div>
      </div>
    </div>
    
    <div v-else-if="!isLoading" class="empty-state">
      <p>Nu am găsit nicio carte în acest moment.</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
}

.header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.book-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid #eee;
}

.book-card:hover {
  transform: translateY(-5px);
}

.card-content {
  padding: 1.5rem;
  flex-grow: 1;
}

.year-badge {
  background: #f0fdf4;
  color: #16a34a;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

h3 {
  margin: 1rem 0 0.5rem 0;
  font-size: 1.25rem;
  color: #1a202c;
}

.author {
  color: #718096;
  font-style: italic;
  margin-bottom: 1rem;
}

.stock {
  font-weight: bold;
  font-size: 0.9rem;
  color: #2d3748;
}

.no-stock {
  color: #e53e3e;
}

.card-actions {
  padding: 1rem;
  background: #f8fafc;
  display: flex;
  gap: 0.5rem;
}

.btn-view, .btn-borrow, .create-btn {
  padding: 0.6rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  border: none;
  font-size: 0.9rem;
}

.btn-view {
  background: #edf2f7;
  color: #4a5568;
  flex: 1;
}

.btn-borrow {
  background: #42b983;
  color: white;
  flex: 2;
}

.btn-borrow:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.create-btn {
  background: #42b983;
  color: white;
}

.error-message {
  background: #fff5f5;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.filter-section {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
}

select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #cbd5e0;
  background: white;
  min-width: 150px;
}

</style>