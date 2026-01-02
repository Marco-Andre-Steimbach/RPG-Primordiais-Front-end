import { useState } from 'react'
import { useAuthController } from './AuthController'
import { useNavigate, Link } from 'react-router-dom'
import ParchmentCard from '../../shared/components/ParchmentCard'

function LoginPage() {
  const { login } = useAuthController()
  const navigate = useNavigate()

  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await login(loginValue, password)
    navigate('/')
  }

  return (
    <div style={{ padding: 16 }}>
      <ParchmentCard>
        <h2 className="parchment-title">Login</h2>

        <form className="parchment-form" onSubmit={handleSubmit}>
          <input
            className="parchment-input"
            placeholder="Login ou Nickname"
            value={loginValue}
            onChange={e => setLoginValue(e.target.value)}
          />

          <input
            className="parchment-input"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button className="parchment-button" type="submit">
            Entrar
          </button>

          <p className="parchment-footer">
            Ainda não é cadastrado?{' '}
            <Link to="/register" className="parchment-link">
              Registre-se
            </Link>
          </p>
        </form>
      </ParchmentCard>
    </div>
  )
}

export default LoginPage
