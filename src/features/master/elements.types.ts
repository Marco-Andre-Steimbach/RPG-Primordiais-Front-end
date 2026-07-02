export type ElementType = {
  id: number
  name: string
  description: string
  created_at: string
}

export type ElementsResponse = {
  elements: ElementType[]
}

export type ElementDamagePayload = {
  attack_elements: number[]
  defense_elements: number[]
  base_damage: number
}

export type ElementDamageResponse = {
  damage: {
    base_damage: number
    final_damage: number
    multiplier: number
    modifier: number
  }
}

export type ElementRelation = {
  id: number
  name: string
  advantages: number
  disadvantages: number
  immunity: boolean
  multiplier: number
}

export type DiscoverRelationsResponse = {
  relations: ElementRelation[]
}

export type GroupedElementRelations = {
  multiplier: number
  elements: ElementRelation[]
}

export type DiscoverAttackRelationsPayload = {
  attack_elements: number[]
}

export type ElementSummary = {
  id: number
  name: string
}

export type EntityElementsResponse = {
  elements: ElementSummary[]
}
