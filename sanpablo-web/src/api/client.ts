import axios from 'axios'

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5080/api',
  headers: { 'Content-Type': 'application/json' },
})

// Inyecta el JWT del empleado en cada request (cuando exista login)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sanpablo_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
