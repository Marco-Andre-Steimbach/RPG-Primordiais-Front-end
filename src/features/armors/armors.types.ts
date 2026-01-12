export type ArmorAbility = {
    id: number
    title: string
    description: string
    dice_formula: string | null
    base_damage: number
    armor_class_bonus: number
    bonus_speed: number
    created_at: string
    updated_at: string | null
}

export type Armor = {
    id: number
    item_id: number

    armor_slot_id: number
    armor_class_bonus: number
    min_strength_required: number
    speed_penalty: number

    element_types: number[]
    armor_abilities: ArmorAbility[]

    created_at: string
}

export type ArmorsResponse = {
    armors: {
        armor_id: number
        item_id: number
        item_name: string

        armor_slot_id: number
        slot_name: string

        armor_class_bonus: number
        min_strength_required: number
        speed_penalty: number

        created_at: string
    }[]
}

export type ArmorResponse = {
    armor: Armor
}

export type Element = {
    id: number
    name: string
    description: string
}

export type ElementsResponse = {
    elements: Element[]
}

export type ElementResponse = {
    element: Element
}

export type Item = {
    id: number
    name: string
    description: string
    value: number
    element_types: number[]
  }
  
  export type ItemResponse = {
    item: Item
  }