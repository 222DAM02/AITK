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
    if (!confirm('Удалить эту заметку?')) return
    await adminAPI.deleteItem(id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const tabClass = (name) =>
    `px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
      tab === name ? s.btnPrimary : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }`

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xl">⚙</span>
        <h1 className="text-2xl font-bold text-slate-900">Админ-панель</h1>
      </div>

      <div className="flex gap-2 mb-5">
        <button onClick={() => setTab('users')} className={tabClass('users')}>Пользователи ({users.length})</button>
        <button onClick={() => setTab('items')} className={tabClass('items')}>{config.entityNamePlural} ({items.length})</button>
      </div>

      {tab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-400 font-semibold">ID</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-400 font-semibold">Пользователь</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-400 font-semibold">Email</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-400 font-semibold">Роль</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-400 font-semibold">Статус</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-400 font-semibold">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-400">{u.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{u.username}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : s.badge
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        u.is_blocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>{u.is_blocked ? 'Заблокирован' : 'Активен'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleBlock(u.id)}
                        className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                          u.is_blocked ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}>{u.is_blocked ? 'Разблокировать' : 'Заблокировать'}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'items' && (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-400 font-semibold">ID</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-400 font-semibold">Название</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-400 font-semibold">Предмет</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-400 font-semibold">Автор</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-400 font-semibold">Дата</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-400 font-semibold">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-400">{item.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {item.is_pinned && '📌 '}{item.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.subject}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.owner_username}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{new Date(item.created_at).toLocaleDateString('ru')}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDeleteItem(item.id)}
                        className={`${s.btnDanger} text-xs px-3 py-1 rounded-lg transition-colors`}>Удалить</button>
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
