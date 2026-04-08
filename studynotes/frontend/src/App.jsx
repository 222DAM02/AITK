import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ItemList from './pages/ItemList'
import ItemDetail from './pages/ItemDetail'
import ItemForm from './pages/ItemForm'
import AIPage from './pages/AIPage'
import AdminPanel from './pages/AdminPanel'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/items" element={<ProtectedRoute><ItemList /></ProtectedRoute>} />
          <Route path="/items/new" element={<ProtectedRoute><ItemForm /></ProtectedRoute>} />
          <Route path="/items/:id" element={<ProtectedRoute><ItemDetail /></ProtectedRoute>} />
          <Route path="/items/:id/edit" element={<ProtectedRoute><ItemForm /></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute><AIPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}
