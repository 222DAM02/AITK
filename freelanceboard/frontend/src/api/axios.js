import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const tokens = JSON.parse(localStorage.getItem('tokens') || '{}')
  if (tokens.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}')
      if (tokens.refresh) {
        try {
          const { data } = await axios.post('/api/auth/refresh/', {
            refresh: tokens.refresh,
          })
          localStorage.setItem('tokens', JSON.stringify({ ...tokens, access: data.access }))
          original.headers.Authorization = `Bearer ${data.access}`
          return api(original)
        } catch {
          localStorage.removeItem('tokens')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
