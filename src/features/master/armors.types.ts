export type ArmorListItem = {
    armor_id: number
    item_id: number
    item_name: string
    item_description: string
    armor_slot_id: number
    slot_name: string
    armor_class_bonus: number
    min_strength_required: number
    speed_penalty: number
    created_at: string
}
export type ArmorAbility = {
    id: number
    title: string
    description: string
    dice_formula: string | null
    base_damage: number
    range: number
    armor_class_bonus: number
    bonus_speed: number
    created_at: string
    updated_at: string | null
}
export type ArmorDetails = {
    id: number
    item_id: number
    armor_slot_id: number
    armor_class_bonus: number
    min_strength_required: number
    speed_penalty: number
    weak_damage_type_id: number | null
    element_types: number[]
    armor_abilities: ArmorAbility[]
    created_at: string
}
export type FetchArmorsResponse = {
    armors: ArmorListItem[]
}

export type FetchArmorByIdResponse = {
    armor: ArmorDetails
}
