import { Routes, Route, Link } from 'react-router-dom'
import Home      from './Home'
import JsonPage  from './JsonPage'
import Login     from './Login'
import ProtectedRoute from './ProtectedRoute'
import './App.css'

export default function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/json">Json</Link>
        {/* removemos o <Link to="/login"> */}
      </nav>

      <Routes>
        {/* Rota pública de login */}
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/json"
          element={
            <ProtectedRoute>
              <JsonPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<h2>404: Não encontrado</h2>} />
      </Routes>
    </>
  )
}
