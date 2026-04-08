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
    if (!confirm('Удалить тренировку?')) return
    await adminAPI.deleteItem(id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const tabClass = (name) =>
    `px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
      tab === name ? 'bg-slate-900 text-lime-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xl">⚙</span>
        <h1 className="text-2xl font-bold text-gray-900">Админ-панель</h1>
      </div>

      <div className="flex gap-2 mb-5">
        <button onClick={() => setTab('users')} className={tabClass('users')}>Пользователи ({users.length})</button>
        <button onClick={() => setTab('items')} className={tabClass('items')}>{config.entityNamePlural} ({items.length})</button>
      </div>

      {tab === 'users' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['ID', 'Пользователь', 'Email', 'Роль', 'Статус', 'Действия'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-400">{u.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.username}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : s.badge}`}>{u.role}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded font-medium ${u.is_blocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>{u.is_blocked ? 'Заблокирован' : 'Активен'}</span></td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleBlock(u.id)}
                        className={`text-xs px-3 py-1 rounded-lg font-medium ${u.is_blocked ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}>
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
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['ID', 'Название', 'Тип', 'Автор', 'Дата', 'Действия'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-400">{item.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.workout_type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.owner_username}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{new Date(item.created_at).toLocaleDateString('ru')}</td>
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
