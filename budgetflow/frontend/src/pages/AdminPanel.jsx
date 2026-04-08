import { useState, useEffect } from 'react'
import { adminAPI } from '../api/endpoints'
import config from '../theme.config'
const { s } = config
export default function AdminPanel() {
  const [users, setUsers] = useState([]); const [items, setItems] = useState([]); const [tab, setTab] = useState('users')
  useEffect(() => { adminAPI.getUsers().then(r => setUsers(r.data?.results || r.data || [])).catch(() => {}); adminAPI.getItems().then(r => setItems(r.data?.results || r.data || [])).catch(() => {}) }, [])
  const toggleBlock = async (uid, blocked) => { await adminAPI.toggleBlock(uid); setUsers(users.map(u => u.id === uid ? { ...u, is_blocked: !blocked } : u)) }
  const deleteItem = async (iid) => { if (!confirm('Удалить?')) return; await adminAPI.deleteItem(iid); setItems(items.filter(i => i.id !== iid)) }
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Админ-панель</h1>
      <div className="flex gap-2 mb-6">{['users','items'].map(t=>(<button key={t} onClick={()=>setTab(t)}
        className={`px-4 py-2 rounded-lg text-sm font-medium ${tab===t?s.btnPrimary:'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
        {t==='users'?'Пользователи':'Транзакции'}</button>))}</div>
      {tab==='users'&&(<div className="finance-card overflow-hidden"><table className="w-full"><thead className="bg-gray-50">
        <tr><th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Пользователь</th>
          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Роль</th>
          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Статус</th><th className="px-5 py-3"></th></tr></thead>
        <tbody className="divide-y divide-gray-50">{users.map(u=>(<tr key={u.id} className="hover:bg-gray-50">
          <td className="px-5 py-3 text-sm font-medium">{u.username}</td><td className="px-5 py-3 text-sm text-gray-500">{u.email}</td>
          <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${u.role==='admin'?'bg-purple-100 text-purple-700':'bg-gray-100 text-gray-600'}`}>{u.role}</span></td>
          <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${u.is_blocked?'bg-red-100 text-red-700':'bg-green-100 text-green-700'}`}>{u.is_blocked?'Заблокирован':'Активен'}</span></td>
          <td className="px-5 py-3 text-right">{u.role!=='admin'&&<button onClick={()=>toggleBlock(u.id,u.is_blocked)}
            className={`text-xs px-3 py-1 rounded-lg ${u.is_blocked?'text-green-600 hover:bg-green-50':'text-red-600 hover:bg-red-50'}`}>
            {u.is_blocked?'Разблокировать':'Заблокировать'}</button>}</td></tr>))}</tbody></table></div>)}
      {tab==='items'&&(<div className="finance-card overflow-hidden"><table className="w-full"><thead className="bg-gray-50">
        <tr><th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Транзакция</th>
          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Автор</th>
          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Сумма</th><th className="px-5 py-3"></th></tr></thead>
        <tbody className="divide-y divide-gray-50">{items.map(i=>(<tr key={i.id} className="hover:bg-gray-50">
          <td className="px-5 py-3 text-sm font-medium">{i.title}</td><td className="px-5 py-3 text-sm text-gray-500">{i.owner_username}</td>
          <td className="px-5 py-3"><span className={`text-sm font-mono ${i.type==='income'?'text-emerald-600':'text-red-500'}`}>{i.amount} {i.currency}</span></td>
          <td className="px-5 py-3 text-right"><button onClick={()=>deleteItem(i.id)} className="text-xs text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg">Удалить</button></td>
        </tr>))}</tbody></table></div>)}</div>)
}
