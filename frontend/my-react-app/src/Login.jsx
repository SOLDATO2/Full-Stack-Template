import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  // rota para onde voltaremos após login (ou "/" por padrão)
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)

    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (res.ok) {
      // marca login e redireciona para a rota original
      sessionStorage.setItem('isLoggedIn', 'true')
      navigate(from, { replace: true })
    } else {
      setError('Credenciais inválidas')
    }
  }

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Usuário"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}
