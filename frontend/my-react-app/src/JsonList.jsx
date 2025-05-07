import { useState, useEffect } from 'react'

export default function JsonList() {
  const [items, setItems]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    fetch('/json-data')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(json => setItems(json))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Carregando...</p>
  if (error)   return <p style={{ color: 'red' }}>Erro: {error}</p>
  if (!items || items.length === 0)
    return <p>Nenhum dado encontrado.</p>

  return (
    <ul>
      {items.map(u => (
        <li key={u.id}>
          <strong>#{u.id}</strong> — {u.nome}
        </li>
      ))}
    </ul>
  )
}
