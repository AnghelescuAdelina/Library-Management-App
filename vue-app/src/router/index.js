import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/books',
      name: 'books',
      component: () => import('../views/BooksView.vue'),
    },
    {
      path: '/books/create',
      name: 'book-create',
      component: () => import('../views/BookCreateView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/books/:id',
      name: 'book-detail',
      component: () => import('../views/BookDetailsView.vue'),
     
    },

    {
      path: '/history',
      name: 'history',
      component: () => import('../views/HistoryView.vue'),
      meta: {requiresAuth: true }
    }
  ],
})


router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } 
  
  else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    alert("Acces interzis! Doar administratorii pot accesa această pagină.")
    next('/books') 
  } 
  else {
    next()
  }
})

export default router