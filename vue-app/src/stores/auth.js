import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { API_BASE_URL } from '@/utils/constants'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userEmail = computed(() => user.value?.email || '')

  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(email, password) {
    try{
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      user.value = data.user
      token.value = data.token

      localStorage.setItem('authToken', data.token)
      localStorage.setItem('authUser', JSON.stringify(data.user))
      return data
    }catch (error) {
      console.error('Login error:', error)
      throw error
    }
 }

   async function register(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      user.value = data.user
      token.value = data.token

      localStorage.setItem('authToken', data.token)
      localStorage.setItem('authUser', JSON.stringify(data.user))

      return data
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }


  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
  }


  function checkAuth() {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('authUser')

    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  return {
    user, token, isAuthenticated, userEmail, isAdmin, 
    login, register, logout, checkAuth
  }
})