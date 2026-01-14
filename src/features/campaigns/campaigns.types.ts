export type Campaign = {
    id: number
    name: string
    description: string
    created_at: string
    master: string
    characters_count: number
}

export type CampaignCharacter = {
    campaign_character_id: number
    character_id: number
    name: string
    race_id: number
    order_id: number
    level: number
    controlled_by: string
}

export type CampaignWithCharacters = {
    id: number
    name: string
    description: string
    created_at: string
    master: string
    characters: CampaignCharacter[]
}

export type CampaignsResponse = {
    campaigns: Campaign[]
}

export type CampaignByIdResponse = {
    campaign: CampaignWithCharacters
}

export type User = {
    id: number
    first_name: string
    last_name: string
    nickname: string
    email: string
    created_at: string
    updated_at: string
}

export type UserMeResponse = {
    user: User
    roles: string[]
}

export type CharacterSheetInfo = {
    campaign_character_id: number
    level: number
    perks: number
    abilities: number
    weapons: number
    armors: number
}

export type CharacterSheetInfoResponse = {
    infos: CharacterSheetInfo
}

export type Character = {
    id: number
    name: string
    description: string
    race_id: number
    order_id: number
    mana_modifier: string
    created_by: number
    created_at: string
    updated_at: string
}

export type CharacterAbility = {
    id: number
    title: string
    description: string
    arcane_title: string | null
    arcane_description: string | null
    mana_cost: number
    arcane_mana_cost: number | null
    dice_formula: string | null
    base_damage: number
    bonus_speed: number
    required_race_id: number | null
    required_order_id: number | null
}

export type CharacterByIdResponse = {
    character: {
        character: Character
        owner: string
        abilities: CharacterAbility[]
    }
}

export type PerkAbility = {
    id: number
    perk_id: number
    name: string
    description: string
    dice_formula: string | null
    base_damage: number
    bonus_accuracy: number
    bonus_damage: number
    bonus_speed: number
    created_at: string
    updated_at: string
}

export type Perk = {
    id: number
    name: string
    description: string
    type: 'passive' | 'active'
    mana_cost: number
    race_id: number | null
    order_id: number | null
    required_level: number
    element_types: number[]
    flags: string[]
    attributes: any[]
    ability: PerkAbility[]
    created_at: string
    updated_at: string
}

export type PerksResponse = {
    perks: Perk[]
}

export type AddPerkToCampaignCharacterPayload = {
    perk_id: number
}

export type AddAbilityToCampaignCharacterPayload = {
    ability_id: number
}

export type CampaignCharacterActionResponse = {
    success: boolean
    message: string
}

export type CharacterSheet = {
    perks: Perk[]
  }
  
  export type CharacterSheetResponse = {
    sheet: {
      perks: Perk[]
    }
  }
  