import { useState, useEffect } from 'react'
import { adminAPI } from '../api/endpoints'
import config from '../theme.config'

const { s } = config

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [items, setItems] = useState([])
  const [tab, setTab] = useState('users')

  useEffect(() => {
    adminAPI.getUsers().then(({ data }) => setUsers(data.results || data))
    adminAPI.getItems().then(({ data }) => setItems(data.results || data))
  }, [])

  const handleBlock = async (id) => {
    const { data } = await adminAPI.toggleBlock(id)
    setUsers((prev) => prev.map((u) => (u.id === id ? data : u)))
  }

  const handleDeleteItem = async (id) => {
    if (!confirm('Удалить?')) return
    await adminAPI.deleteItem(id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const tabClass = (name) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      tab === name ? 'bg-teal-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
    }`

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Админ-панель</h1>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('users')} className={tabClass('users')}>Пользователи ({users.length})</button>
        <button onClick={() => setTab('items')} className={tabClass('items')}>{config.entityNamePlural} ({items.length})</button>
      </div>

      {tab === 'users' && (
        <div className={`${s.surface} rounded-xl overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-700">
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500">ID</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500">Имя</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500">Email</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500">Роль</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500">Статус</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-sm text-gray-600">{u.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-200">{u.username}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{u.email}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : s.badge}`}>{u.role}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${u.is_blocked ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{u.is_blocked ? 'Заблокирован' : 'Активен'}</span></td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleBlock(u.id)}
                        className={`text-xs px-3 py-1 rounded-lg ${u.is_blocked ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}>
                        {u.is_blocked ? 'Разблокировать' : 'Заблокировать'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'items' && (
        <div className={`${s.surface} rounded-xl overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-700">
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500">ID</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500">Название</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500">Автор</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500">Карточек</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-sm text-gray-600">{item.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-200">{item.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{item.owner_username}</td>
                    <td className="px-4 py-3 text-sm text-teal-400">{item.cards_count || 0}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDeleteItem(item.id)} className={`${s.btnDanger} text-xs px-3 py-1 rounded-lg`}>Удалить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}