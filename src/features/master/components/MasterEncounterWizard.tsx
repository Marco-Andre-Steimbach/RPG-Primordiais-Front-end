import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { createEncounter } from '../encounters.service'
import type { CreateEncounterPayload } from '../encounters.types'

type Props = {
  onCancel: () => void
  onDone: (encounterId: number) => void
}

function MasterEncounterWizard({ onCancel, onDone }: Props) {
  const { id } = useParams()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const parsedCampaignId = Number(id)

    if (!parsedCampaignId || parsedCampaignId <= 0) {
      setError('Campanha inválida.')
      return
    }

    if (name.trim().length < 2) {
      setError('O nome do encontro deve possuir pelo menos 2 caracteres.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const payload: CreateEncounterPayload = {
        campaign_id: parsedCampaignId,
        name: name.trim(),
        description: description.trim()
      }

      const response = await createEncounter(payload)

      onDone(response.encounter.id)
    } catch {
      setError('Erro ao criar encontro.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="master-sheet card master-wizard">
      <div className="master-wizard-top">
        <div>
          <h2 className="master-wizard-title">Criar Encontro</h2>
          <p className="master-wizard-sub">Passo 1 de 1</p>
        </div>

        <div className="master-wizard-actions">
          <button
            className="master-wizard-btn ghost"
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </div>

      {error && (
        <div className="master-wizard-error">
          {error}
        </div>
      )}

      <form className="master-wizard-body" onSubmit={handleSubmit}>
        <div className="master-wizard-panel">
          <label className="form-label">
            Nome
          </label>

          <input
            className="form-input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading}
          />

          <label className="form-label">
            Descrição
          </label>

          <textarea
            className="form-input"
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={loading}
          />

          <button
            className="master-wizard-btn primary"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Criar encontro'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default MasterEncounterWizard
