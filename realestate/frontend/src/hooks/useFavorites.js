import { useState, useEffect } from 'react'

const STORAGE_KEY = 'favorites'

export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const toggle = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  const isFav = (id) => favorites.includes(id)

  return { favorites, toggle, isFav, count: favorites.length }
}
