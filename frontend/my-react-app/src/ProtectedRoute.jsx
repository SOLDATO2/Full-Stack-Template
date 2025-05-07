import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'
  const location = useLocation()

  if (!isLoggedIn) {
    // guarda a rota de onde veio pra, após login, voltar aqui
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
