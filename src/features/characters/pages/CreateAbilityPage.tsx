import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  fetchCharacterById,
  createCharacterAbility,
  fetchElements
} from '../characters.service'
import type { CharacterFull, ElementType } from '../characters.types'
import '../characters.css'

function CreateAbilityPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [character, setCharacter] = useState<CharacterFull | null>(null)
  const [elements, setElements] = useState<ElementType[]>([])

  const [form, setForm] = useState({
    title: '',
    description: '',
    arcane_title: '',
    arcane_description: '',
    mana_cost: '',
    arcane_mana_cost: '',
    dice_formula: '',
    base_damage: '',
    bonus_speed: '',
    element_types: [] as number[]
  })

  useEffect(() => {
    if (!id) return

    fetchCharacterById(Number(id)).then(res =>
      setCharacter(res.character)
    )

    fetchElements().then(res =>
      setElements(res.elements)
    )
  }, [id])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function toggleElement(elementId: number) {
    setForm(prev => ({
      ...prev,
      element_types: prev.element_types.includes(elementId)
        ? prev.element_types.filter(e => e !== elementId)
        : [...prev.element_types, elementId]
    }))
  }

  async function handleSubmit() {
    if (!id || !character) return

    const payload = {
      title: form.title,
      description: form.description,
      arcane_title: form.arcane_title || null,
      arcane_description: form.arcane_description || null,
      mana_cost: Number(form.mana_cost),
      arcane_mana_cost: form.arcane_mana_cost
        ? Number(form.arcane_mana_cost)
        : null,
      dice_formula: form.dice_formula,
      base_damage: Number(form.base_damage),
      bonus_speed: Number(form.bonus_speed),
      element_types: form.element_types,
      required_race_id: character.character.race_id,
      required_order_id: character.character.order_id
    }

    await createCharacterAbility(Number(id), payload)

    navigate(`/characters/${id}`)
  }


  if (!character) return null

  return (
    <div className="character-create-container">
      <div className="parchment">
        <strong>Título</strong>
        <input name="title" value={form.title} onChange={handleChange} />

        <strong>Descrição</strong>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="parchment">
        <strong>Título Arcano</strong>
        <input
          name="arcane_title"
          value={form.arcane_title}
          onChange={handleChange}
        />

        <strong>Descrição Arcana</strong>
        <textarea
          name="arcane_description"
          value={form.arcane_description}
          onChange={handleChange}
        />
      </div>

      <div className="parchment">
        <strong>Mana</strong>
        <input
          type="number"
          name="mana_cost"
          value={form.mana_cost}
          onChange={handleChange}
        />

        <strong>Mana Arcana</strong>
        <input
          type="number"
          name="arcane_mana_cost"
          value={form.arcane_mana_cost}
          onChange={handleChange}
        />
      </div>

      <div className="parchment">
        <strong>Dano</strong>

        <span className="field-label">Fórmula</span>
        <input
          name="dice_formula"
          placeholder="Ex: 2d8+4"
          value={form.dice_formula}
          onChange={handleChange}
        />

        <span className="field-label">Dano Base</span>
        <input
          type="number"
          name="base_damage"
          value={form.base_damage}
          onChange={handleChange}
        />

        <span className="field-label">Bônus de Velocidade</span>
        <input
          type="number"
          name="bonus_speed"
          value={form.bonus_speed}
          onChange={handleChange}
        />
      </div>

      <div className="parchment">
        <strong>Elementos</strong>

        <div className="elements-grid">
          {elements.map(element => {
            const active = form.element_types.includes(element.id)

            return (
              <button
                key={element.id}
                type="button"
                className={`element-chip ${active ? 'active' : ''}`}
                onClick={() => toggleElement(element.id)}
              >
                {element.name}
              </button>
            )
          })}
        </div>
      </div>

      <button className="character-owner-action" onClick={handleSubmit}>
        Criar Habilidade
      </button>
    </div>
  )
}

export default CreateAbilityPage
