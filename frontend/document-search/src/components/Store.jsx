// store.js
import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    set({ isLoading: true, error: null })
    
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, you would make an API call to your backend
      if (email === 'user@example.com' && password === 'password') {
        const user = { id: 1, email, name: 'Test User' }
        set({ user, isLoading: false })
        return true
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      set({ error: error.message, isLoading: false })
      return false
    }
  },
  
  logout: () => {
    set({ user: null })
  },
  
  clearErrors: () => {
    set({ error: null })
  }
}))

export default useAuthStore