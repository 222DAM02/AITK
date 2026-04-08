import api from './axios'
export const authAPI = { register: (data) => api.post('/auth/register/', data), login: (data) => api.post('/auth/login/', data), getProfile: () => api.get('/auth/profile/'), updateProfile: (data) => api.patch('/auth/profile/', data) }
export const itemsAPI = {
  list: (params) => api.get('/items/', { params }), myList: () => api.get('/items/', { params: { mine: true } }),
  get: (id) => api.get(`/items/${id}/`), create: (data) => api.post('/items/', data),
  update: (id, data) => api.patch(`/items/${id}/`, data), delete: (id) => api.delete(`/items/${id}/`),
  myStats: () => api.get('/items/my-stats/'),
  getAppointments: (id) => api.get(`/items/${id}/appointments/`),
  bookAppointment: (id, data) => api.post(`/items/${id}/appointments/`, data),
  updateAppointment: (id, aptId, data) => api.patch(`/items/${id}/appointments/${aptId}/`, data),
}
export const aiAPI = { generate: (prompt) => api.post('/ai/generate/', { prompt }), history: () => api.get('/ai/history/'), saveAsItem: (qid, title) => api.post('/ai/save/', { query_id: qid, title }), fetchData: (d) => api.post('/ai/fetch-data/', d||{}), knowledge: (p) => api.get('/ai/knowledge/', { params: p }), knowledgeStats: () => api.get('/ai/knowledge/stats/') }
export const adminAPI = { getUsers: () => api.get('/admin/users/'), toggleBlock: (id) => api.patch(`/admin/users/${id}/block/`), getItems: () => api.get('/admin/items/'), deleteItem: (id) => api.delete(`/admin/items/${id}/`) }
