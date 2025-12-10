import { ref } from 'vue'

export const isAuthenticated = ref(!!localStorage.getItem('authToken'))

export const logIn = (token) => {
  localStorage.setItem('authToken', token)
  isAuthenticated.value = true
}

export const logOut = () => {
  localStorage.removeItem('authToken')
  isAuthenticated.value = false
}