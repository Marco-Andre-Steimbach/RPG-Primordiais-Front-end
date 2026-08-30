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

export type ElementSummary = {
  id: number
  name: string
}

export type ElementRelationType = 'strong' | 'weak' | 'normal'

export type ElementRelationDetail = {
  source_element_id: number
  target_element_id: number
  relation_type: ElementRelationType
  modifier: number
}

export type ElementCalculatedRelation = {
  id: number
  name: string
  modifier: number
  multiplier: number
  relations: ElementRelationDetail[]
}

export type ElementIndividualRelation = {
  source_element_id: number
  source_element_name: string
  target_element_id: number
  target_element_name: string
  relation_type: ElementRelationType
  modifier: number
}

export type ElementIndividualRelations = {
  positive: ElementIndividualRelation[]
  negative: ElementIndividualRelation[]
}

export type ElementDefenseRelations = {
  strong_against_me: ElementCalculatedRelation[]
  weak_against_me: ElementCalculatedRelation[]
  all: ElementCalculatedRelation[]
}

export type ElementAttackRelations = {
  strong_against: ElementCalculatedRelation[]
  weak_against: ElementCalculatedRelation[]
  all: ElementCalculatedRelation[]
}

export type DiscoverAttackRelationsResult = {
  selected_elements: ElementSummary[]
  relations: ElementIndividualRelations
  defense: ElementDefenseRelations
  attack: ElementAttackRelations
}

export type DiscoverAttackRelationsResponse = {
  relations: DiscoverAttackRelationsResult
}

export type DiscoverAttackRelationsPayload = {
  attack_elements: number[]
}

export type EntityElementsResponse = {
  elements: ElementSummary[]
}
