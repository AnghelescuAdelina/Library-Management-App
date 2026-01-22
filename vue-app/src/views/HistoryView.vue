<script setup>
import { ref, onMounted } from 'vue'
import { useBooksStore } from '@/stores/books'

const booksStore = useBooksStore()
const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = true;
  try {
    // Apelăm funcția nouă din store care aduce datele de la backend
    await booksStore.fetchUserHistory();
  } catch (error) {
    console.error("Eroare la încărcarea istoricului:", error);
  } finally {
    isLoading.value = false;
  }
});

async function handleReturn(bookId) {
  if (confirm('Dorești să returnezi această carte?')) {
    // Store-ul se ocupă acum de tot: API call + refresh listă
    await booksStore.returnBook(bookId);
  }
}
</script>
<template>
  <div class="container">
    <div class="header-flex">
      <h1>Istoricul Meu</h1>
      <RouterLink to="/books" class="create-btn">Răsfoiește Cărțile</RouterLink>
    </div>

    <div v-if="isLoading" class="loader">Se încarcă istoricul...</div>

    <div v-else-if="booksStore.historyItems.length === 0" class="empty-state">
      <p>Nu ai nicio activitate înregistrată încă.</p>
    </div>

    <div v-else class="books-grid">
      <div v-for="item in booksStore.historyItems" :key="item.id" class="book-card">
        <div class="card-content">
          <span class="year-badge" :style="item.action === 'returned' ? 'background: #fff7ed; color: #d97706;' : ''">
            {{ item.action === 'borrowed' ? '📖 Împrumutat' : '✅ Returnat' }}
          </span>
          
          <h3>{{ item.bookTitle }}</h3>
          <p class="author">Data: {{ item.date }}</p>
          
          <p class="stock">
            Status: 
            <span :class="item.action === 'borrowed' ? 'no-stock' : ''">
              {{ item.action === 'borrowed' ? 'Trebuie returnată' : 'Restituită' }}
            </span>
          </p>
        </div>

        <div class="card-actions" v-if="item.action === 'borrowed'">
          <button @click="handleReturn(item.bookId)" class="btn-borrow">
            Returnează
          </button>
        </div>
      </div>
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

.btn-borrow, .create-btn {
  padding: 0.6rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  border: none;
  font-size: 0.9rem;
}

.btn-borrow {
  background: #42b983;
  color: white;
  flex: 1;
}

.create-btn {
  background: #42b983;
  color: white;
}

.loader, .empty-state {
  text-align: center;
  margin-top: 50px;
  color: #718096;
}
</style>