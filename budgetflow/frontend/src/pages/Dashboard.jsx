import { useState, useEffect } from 'react'
import { itemsAPI } from '../api/endpoints'
import config from '../theme.config'

const { s } = config

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    itemsAPI.myStats().then(({ data }) => { setStats(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>

  const s2 = stats || {}
  const maxDaily = Math.max(...(s2.daily || []).map(d => Math.max(d.income, d.expense)), 1)
  const cats = Object.entries(s2.by_category || {}).sort((a, b) => b[1].total - a[1].total)
  const maxCat = cats.length ? cats[0][1].total : 1

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Финансовый дашборд</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Доходы за месяц', value: `${(s2.month_income || 0).toLocaleString('ru')} ₽`, icon: '📈', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'Расходы за месяц', value: `${(s2.month_expense || 0).toLocaleString('ru')} ₽`, icon: '📉', color: 'text-red-500', bg: 'bg-red-50 border-red-100' },
          { label: 'Баланс', value: `${(s2.month_balance || 0).toLocaleString('ru')} ₽`, icon: '💰', color: s2.month_balance >= 0 ? 'text-emerald-600' : 'text-red-500', bg: 'bg-gray-50 border-gray-100' },
          { label: 'Транзакций', value: s2.total_transactions || 0, icon: '📋', color: 'text-gray-700', bg: 'bg-gray-50 border-gray-100' },
        ].map((card, i) => (
          <div key={card.label} className={`${card.bg} border rounded-xl p-5 animate-count count-delay-${i + 1}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className={`text-xl font-bold ${card.color} mono`}>{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Daily chart */}
        <div className="finance-card p-6">
          <h3 className="font-bold text-gray-900 mb-4">Доходы и расходы за 30 дней</h3>
          <div className="flex items-end gap-0.5 h-40">
            {(s2.daily || []).slice(-30).map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5 justify-end h-full">
                <div className="w-full bg-emerald-400 rounded-t-sm" style={{ height: `${(d.income / maxDaily) * 100}%`, minHeight: d.income ? '2px' : 0 }} />
                <div className="w-full bg-red-400 rounded-t-sm" style={{ height: `${(d.expense / maxDaily) * 100}%`, minHeight: d.expense ? '2px' : 0 }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>30 дней назад</span>
            <div className="flex gap-4">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full" /> Доходы</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full" /> Расходы</span>
            </div>
            <span>Сегодня</span>
          </div>
        </div>

        {/* By category */}
        <div className="finance-card p-6">
          <h3 className="font-bold text-gray-900 mb-4">Расходы по категориям</h3>
          {cats.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Нет данных за этот месяц</p>
          ) : (
            <div className="space-y-3">
              {cats.slice(0, 8).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{val.label}</span>
                    <span className="font-mono font-semibold text-gray-900">{val.total.toLocaleString('ru')} ₽</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                      style={{ width: `${(val.total / maxCat) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
