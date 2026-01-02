import { useState } from 'react'
import { useAuthController } from './AuthController'
import { useNavigate } from 'react-router-dom'
import ParchmentCard from '../../shared/components/ParchmentCard'

function RegisterPage() {
  const { register } = useAuthController()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    nickname: '',
    password: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await register(form)
    navigate('/login')
  }

  return (
    <div style={{ padding: 16 }}>
      <ParchmentCard>
        <h2 className="parchment-title">Cadastro</h2>

        <form className="parchment-form" onSubmit={handleSubmit}>
          {Object.keys(form).map(key => (
            <input
              key={key}
              name={key}
              placeholder={key.replace('_', ' ')}
              value={(form as any)[key]}
              onChange={handleChange}
              className="parchment-input"
            />
          ))}

          <button className="parchment-button" type="submit">
            Cadastrar
          </button>
        </form>
      </ParchmentCard>
    </div>
  )
}

export default RegisterPage
