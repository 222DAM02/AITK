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
  move: (id, status) => api.patch(`/items/${id}/move/`, { status }),
  getComments: (id) => api.get(`/items/${id}/comments/`),
  addComment: (id, text) => api.post(`/items/${id}/comments/`, { text }),
  deleteComment: (id, commentId) => api.delete(`/items/${id}/comments/${commentId}/`),
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
