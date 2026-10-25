import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:8080/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api