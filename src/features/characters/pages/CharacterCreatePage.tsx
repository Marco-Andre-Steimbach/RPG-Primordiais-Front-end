import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  fetchRaces,
  fetchOrders,
  createCharacter
} from '../characters.service'
import CharacterBasicInfo from '../components/CharacterBasicInfo'
import CharacterLore from '../components/CharacterLore'
import CharacterSelect from '../components/CharacterSelect'
import ManaModifierSelect from '../components/ManaModifierSelect'
import CharacterSubmit from '../components/CharacterSubmit'
import type {
  Race,
  Order,
  ManaModifier,RacesResponse,OrdersResponse
} from '../characters.types'
import '../characters.css'

function CharacterCreatePage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [raceId, setRaceId] = useState<number | null>(null)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [manaModifier, setManaModifier] = useState<ManaModifier | ''>('')

  const [races, setRaces] = useState<Race[]>([])
  const [orders, setOrders] = useState<Order[]>([])

useEffect(() => {
  fetchRaces().then((res: RacesResponse) => {
    setRaces(res.races)
  })

  fetchOrders().then((res: OrdersResponse) => {
    setOrders(res.orders)
  })
}, [])


  async function handleSubmit() {
    if (!name || !description || !raceId || !manaModifier) {
      console.warn('Campos obrigatórios não preenchidos')
      return
    }

    try {
      const response = await createCharacter({
        name,
        description,
        race_id: raceId,
        order_id: orderId,
        mana_modifier: manaModifier
      })

      console.log('Personagem criado:', response)

      navigate('/characters')
    } catch (error) {
      console.error('Erro ao criar personagem:', error)
    }
  }

  return (
    <div className="character-create-container">
      <CharacterBasicInfo value={name} onChange={setName} />

      <CharacterLore value={description} onChange={setDescription} />

      <CharacterSelect
        label="Raça"
        options={races}
        value={raceId}
        onChange={setRaceId}
      />

      <CharacterSelect
        label="Ordem"
        options={orders}
        value={orderId}
        onChange={setOrderId}
      />

      <ManaModifierSelect
        value={manaModifier}
        onChange={setManaModifier}
      />

      <CharacterSubmit onSubmit={handleSubmit} />
    </div>
  )
}

export default CharacterCreatePage
