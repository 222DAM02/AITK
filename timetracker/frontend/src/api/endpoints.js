import api from './axios'

export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.patch('/auth/profile/', data),
}

export const itemsAPI = {
  list: (params) => api.get('/items/', { params }),
  myList: () => api.get('/items/', { params: { mine: true } }),
  get: (id) => api.get(`/items/${id}/`),
  create: (data) => api.post('/items/', data),
  update: (id, data) => api.patch(`/items/${id}/`, data),
  delete: (id) => api.delete(`/items/${id}/`),
  getEntries: (id) => api.get(`/items/${id}/entries/`),
  addEntry: (id, data) => api.post(`/items/${id}/entries/`, data),
  updateEntry: (id, entryId, data) => api.patch(`/items/${id}/entries/${entryId}/`, data),
  deleteEntry: (id, entryId) => api.delete(`/items/${id}/entries/${entryId}/`),
  startTimer: (id, data) => api.post(`/items/${id}/start-timer/`, data || {}),
  stopTimer: () => api.post('/items/stop-timer/'),
  getRunning: () => api.get('/items/running/'),
  myStats: () => api.get('/items/my-stats/'),
}

export const aiAPI = {
  generate: (prompt) => api.post('/ai/generate/', { prompt }),
  history: () => api.get('/ai/history/'),
  saveAsItem: (queryId, title) => api.post('/ai/save/', { query_id: queryId, title }),
  fetchData: (data) => api.post('/ai/fetch-data/', data || {}),
  knowledge: (params) => api.get('/ai/knowledge/', { params }),
  knowledgeStats: () => api.get('/ai/knowledge/stats/'),
}

export const adminAPI = {
  getUsers: () => api.get('/admin/users/'),
  toggleBlock: (id) => api.patch(`/admin/users/${id}/block/`),
  getItems: () => api.get('/admin/items/'),
  deleteItem: (id) => api.delete(`/admin/items/${id}/`),
}

// Default export for legacy imports
export default itemsAPI
