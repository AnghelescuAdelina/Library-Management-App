<script setup>
import { onMounted, onUnmounted } from 'vue'                                
import { useBooksStore } from '@/stores/books'                                     
import { useAuthStore } from '@/stores/auth'                                     
import { RouterLink } from 'vue-router' 
import { storeToRefs } from 'pinia';
                                                                                                    
const booksStore = useBooksStore()
const { isLoading, error: errorMessage } = storeToRefs(booksStore);                                        
const authStore = useAuthStore()                                                                    
                                                                  
onMounted(() => {                                                                               
  booksStore.subscribeToBooks();                                                               
});                                                                                             
                                                                                                
onUnmounted(() => {                                                                             
  booksStore.unsubscribe();                                                                     
});    

</script>

<template>
  <div class="container">
    <h1>Biblioteca Mea</h1>
    <div v-if="isLoading">Se încarcă cărțile...</div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    
    <div v-if="booksStore.books.length > 0" class="items-list">
      <div class="item-header">
        <div class="item-name">Titlu și Autor</div>
        <div class="item-price">An Publicare</div>
        <div class="item-action">Acțiuni</div>
      </div>
      
      <div v-for="book in booksStore.books" :key="book.id" class="item">
        <div class="item-name">
          <strong>{{ book.title }}</strong>
          <p>{{ book.author }}</p>
        </div>
        <div class="item-price">{{ book.publishedYear }}</div>
        <div class="item-action">
          <RouterLink :to="{ name: 'book-detail', params: { id: book.id } }">Vezi</RouterLink>
        </div>
      </div>
    </div>
    
    <div v-else-if="!isLoading">
      <p>Nu am găsit nicio carte.</p>
    </div>
    
    <RouterLink v-if="authStore.isAuthenticated" to="/books/create" class="create-btn">
      Adaugă Carte Nouă
    </RouterLink>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}
.items-list {
  margin-top: 2rem;
}
.item-header, .item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}
.item-header {
  font-weight: bold;
  border-bottom-width: 2px;
}
.item-name {
  flex: 3;
}
.item-price {
  flex: 1;
  text-align: right;
}
.item-action {
  flex: 1;
  text-align: right;
}
.create-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
</style>