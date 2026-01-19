import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API_BASE_URL } from '@/utils/constants'
import { useAuthStore } from './auth'
import { db } from '@/firebase.js'
import { collection, onSnapshot } from 'firebase/firestore'


export const useBooksStore = defineStore('books', () => {
  const books = ref([]) 
  const isLoading = ref(false)
  const error = ref(null)

  let unsubscribeFromBooks = null;

  function subscribeToBooks() {
    if (unsubscribeFromBooks) return;

    isLoading.value = true;
    error.value = null;

    const booksCollection = collection(db, 'books'); 

    unsubscribeFromBooks = onSnapshot(booksCollection, (snapshot) => {
      books.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      isLoading.value = false;
    }, (err) => {
      error.value = err.message;
       console.error("Error fetching books:", err);
      isLoading.value = false;
    });
  }

  function unsubscribe() {
    if (unsubscribeFromBooks) {
      unsubscribeFromBooks();
      unsubscribeFromBooks = null;
    }
  }

  
  async function fetchBooks() {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/books`) 
      if (!response.ok) throw new Error('Failed to fetch books.')
      books.value = await response.json()
    } catch (e) {
      error.value = e.message
      books.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function createBook(book) {
    const authStore = useAuthStore()
    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`, 
        },
        body: JSON.stringify(book),
      })
      if (!response.ok) throw new Error('Failed to create book.')
      await fetchBooks() 
    } catch (e) {
      error.value = e.message
    }finally {
      isLoading.value = false
    }
  }

  async function updateBook(id, book) {
    const authStore = useAuthStore()
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`, 
        },
        body: JSON.stringify(book), 
        })
        if (!response.ok) throw new Error('Failed to update book.') 
         await fetchBooks()
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
}
    async function deleteBook(id) { 
    const authStore = useAuthStore()
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token}`, 
        },
      })
      if (!response.ok) throw new Error('Failed to delete book.') 
      await fetchBooks() 
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchBook(id) {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`) 
      if (!response.ok) throw new Error('Failed to fetch book.')
      return await response.json()
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function borrowBook(bookId) {
  const authStore = useAuthStore()
  
  try {
    const response = await fetch(`http://localhost:5000/api/books/${bookId}/borrow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}` 
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Eroare la împrumut')
    }

    alert('Carte împrumutată cu succes!')
    await subscribeToBooks() 
    
  } catch (err) {
    console.error("Eroare împrumut:", err.message)
    alert(err.message)
  }
}

async function returnBook(bookId) {
  const authStore = useAuthStore()
  try {
    const response = await fetch(`http://localhost:5000/api/books/${bookId}/return`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Eroare la returnare')
    
    alert('Carte returnată cu succes!')
  } catch (err) {
    alert(err.message)
  }
}

  return {
    books,
    isLoading,
    error,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
    subscribeToBooks,
    unsubscribe,
    fetchBook,
    borrowBook,
    returnBook
  }
})