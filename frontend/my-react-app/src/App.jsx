import { Routes, Route, Link } from 'react-router-dom'
import Home     from './Home'
import JsonPage from './JsonPage'
import './App.css'

export default function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/json">Json</Link>
      </nav>

      <Routes>
        <Route path="/"      element={<Home     />} />
        <Route path="/json"  element={<JsonPage />} />
        <Route path="*"      element={<h2>404: Não encontrado</h2>} />
      </Routes>
    </>
  )
}
