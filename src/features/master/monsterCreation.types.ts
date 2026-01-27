export type CreateMonsterPayload = {
    name: string
    description: string

    base_hp: number
    base_ac: number
    base_speed: number

    actions_per_turn: number
    xp_reward: number

    base_str: number
    base_dex: number
    base_con: number
    base_wis: number
    base_int: number

    weakness_damage_type_id: number
    element_types: number[]
}

export type CreateMonsterResponse = {
    message: string
    monster: {
        id: number
    }
}
export type CreateMonsterAttackPayload = {
    name: string
    description: string

    dice_formula: string
    base_damage: number
    bonus_accuracy: number

    attack_range: number
    weapon_damage_type_id: number

    element_types: number[]
}

export type CreateMonsterAttackResponse = {
    message: string
    attack: {
        id: number
        name: string
    }
}


export type CreateMonsterAbilityPayload = {
    title: string
    description: string

    dice_formula: string
    base_damage: number
    bonus_damage: number
    bonus_speed: number

    ability_range: number
    element_types: number[]
}

export type CreateMonsterAbilityResponse = {
    message: string
    ability: {
        id: number
        title: string
    }
}

export type LinkMonsterAttacksPayload = {
    attack_ids: number[]
}

export type LinkMonsterAbilitiesPayload = {
    ability_ids: number[]
}
