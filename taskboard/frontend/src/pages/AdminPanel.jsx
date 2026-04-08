import { useState, useEffect } from 'react'
import { adminAPI } from '../api/endpoints'
import config from '../theme.config'

const { s } = config
const thClass = 'px-5 py-3.5 text-xs uppercase tracking-wider text-slate-500 font-semibold text-left'
const tdClass = 'px-5 py-3.5 text-sm'

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
    if (!confirm('Удалить эту задачу?')) return
    await adminAPI.deleteItem(id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const tabClass = (name) =>
    `px-5 py-2 rounded-xl font-medium text-sm transition-colors ${
      tab === name ? s.btnPrimary : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
    }`

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-2xl">⚙️</span>
        <h1 className="text-2xl font-bold text-white">Админ-панель</h1>
      </div>

      <div className="flex gap-3 mb-6">
        <button onClick={() => setTab('users')} className={tabClass('users')}>
          Пользователи ({users.length})
        </button>
        <button onClick={() => setTab('items')} className={tabClass('items')}>
          {config.entityNamePlural} ({items.length})
        </button>
      </div>

      {tab === 'users' && (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-700">
                <tr>
                  <th className={thClass}>ID</th>
                  <th className={thClass}>Пользователь</th>
                  <th className={thClass}>Email</th>
                  <th className={thClass}>Роль</th>
                  <th className={thClass}>Статус</th>
                  <th className={thClass}>Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className={`${tdClass} text-slate-500`}>{u.id}</td>
                    <td className={`${tdClass} font-medium text-slate-200`}>{u.username}</td>
                    <td className={`${tdClass} text-slate-400`}>{u.email}</td>
                    <td className={tdClass}>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        u.role === 'admin'
                          ? 'bg-violet-900/60 text-violet-300 border border-violet-700/50'
                          : s.badge
                      }`}>{u.role}</span>
                    </td>
                    <td className={tdClass}>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        u.is_blocked
                          ? 'bg-red-900/50 text-red-300 border border-red-700/50'
                          : 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50'
                      }`}>
                        {u.is_blocked ? 'Заблокирован' : 'Активен'}
                      </span>
                    </td>
                    <td className={tdClass}>
                      <button onClick={() => handleBlock(u.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                          u.is_blocked
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}>
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
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-700">
                <tr>
                  <th className={thClass}>ID</th>
                  <th className={thClass}>Название</th>
                  <th className={thClass}>Статус</th>
                  <th className={thClass}>Автор</th>
                  <th className={thClass}>Дата</th>
                  <th className={thClass}>Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className={`${tdClass} text-slate-500`}>{item.id}</td>
                    <td className={`${tdClass} font-medium text-slate-200`}>{item.title}</td>
                    <td className={tdClass}>
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{item.status}</span>
                    </td>
                    <td className={`${tdClass} text-slate-400`}>{item.owner_username}</td>
                    <td className={`${tdClass} text-slate-500 text-xs`}>{new Date(item.created_at).toLocaleDateString('ru')}</td>
                    <td className={tdClass}>
                      <button onClick={() => handleDeleteItem(item.id)}
                        className={`${s.btnDanger} text-xs px-3 py-1.5 rounded-lg transition-colors`}>
                        Удалить
                      </button>
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
