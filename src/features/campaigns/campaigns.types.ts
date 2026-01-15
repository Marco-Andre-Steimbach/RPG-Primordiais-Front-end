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
        abilities: CampaignCharacterAbility[]
    }
}

export type CampaignCharacterAbility = {
    ability: Ability
    elements: number[]
}

export type ElementType = {
    id: number
    name: string
}

export type Ability = {
    id: number
    title: string
    description: string
    arcane_title: string | null
    arcane_description: string | null
    mana_cost: number
    arcane_mana_cost: number | null
    dice_formula: string
    base_damage: number
    bonus_speed: number
    required_race_id: number | null
    required_order_id: number | null
    element_types: ElementType[]
}

export type CharacterAbilitiesResponse = {
    abilities: Ability[]
}

export type CharacterAbilityByIdResponse = {
    ability: Ability
}

export type AddCharacterToCampaignAttributes = {
    str: number
    dex: number
    con: number
    intt: number
    wis: number
    cha: number
    sanity: number
}

export type AddCharacterToCampaignPayload = {
    character_id: number
    attributes: AddCharacterToCampaignAttributes
}

export type AddCharacterToCampaignResponse = {
    success: boolean
    message: string
}

export type MyCharacter = {
    id: number
    name: string
    race_id: number
    order_id: number
}

export type MyCharactersResponse = {
    characters: MyCharacter[]
}

export type BaseAttributes = {
    str: number
    dex: number
    con: number
    int: number
    wis: number
    cha: number
    free: number
}

export type Race = {
    id: number
    name: string
    description: string
    attributes: BaseAttributes
    created_at: string
    updated_at: string
}

export type RaceByIdResponse = {
    race: Race
}

export type Order = {
    id: number
    name: string
    description: string
    required_race_id: number | null
    attributes: BaseAttributes
    created_at: string
    updated_at: string
}

export type OrderByIdResponse = {
    order: Order
}

export type LevelUpAttribute =
    | 'str'
    | 'dex'
    | 'con'
    | 'intt'
    | 'wis'
    | 'cha'

export type CampaignCharacterLevelUpPayload = {
    campaign_character_id: number
    attribute: LevelUpAttribute
}

export type CampaignCharacterLevelUpResponse = {
    message: string
}

export type SheetAttributes = {
    str: number
    dex: number
    con: number
    intt: number
    wis: number
    cha: number
}

export type CharacterAttributesBlock = {
    base: SheetAttributes
    race: SheetAttributes
    order: SheetAttributes
    perk: SheetAttributes
    final: SheetAttributes
}

export type CharacterModifiers = {
    str: number
    dex: number
    con: number
    intt: number
    wis: number
    cha: number
}

export type CharacterSanity = {
    current: number
    max: number
}

export type CharacterSheetBase = {
    campaign_character_id: number
    level: number
    attributes: CharacterAttributesBlock
    modifiers: CharacterModifiers
    hp_max: number
    mana_max: number
    base_ca: number
    sanity: CharacterSanity
}

export type SheetRace = {
    id: number
    name: string
    description: string
    attributes: any[]
    created_at: string
    updated_at: string
}


export type SheetOrder = {
    id: number
    name: string
    description: string
    required_race_id: number | null
    attributes: any[]
    created_at: string
    updated_at: string
}

export type CharacterDerived = {
    armor_class: number
    speed: number
}

export type SheetWeaponAbility = {
    id: number
    weapon_id: number
    title: string
    description: string
    dice_formula: string
    base_damage: number
    bonus_damage: number
    bonus_accuracy: number
    bonus_speed: number
    element_types: number[]
    created_at: string
}

export type SheetWeapon = {
    id: number
    item_id: number
    item_name: string
    item_description: string
    weapon_damage_type_id: number
    damage_type: string
    dice_formula: string
    base_damage: number
    bonus_accuracy: number
    bonus_speed: number
    ammo_item_id: number | null
    ammo_per_use: number
    created_at: string
    element_types: number[]
    abilities: SheetWeaponAbility[]
    is_equipped: boolean
}

export type SheetArmorAbility = {
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

export type SheetArmorSlot = {
    id: number
    name: string
    is_exclusive: number
    created_at: string
}

export type SheetArmor = {
    armor: {
        id: number
        item_id: number
        armor_slot_id: number
        armor_class_bonus: number
        min_strength_required: number
        speed_penalty: number
        element_types: number[]
        armor_abilities: any[]
        created_at: string
    }
    slot: SheetArmorSlot
    elements: number[]
    abilities: SheetArmorAbility[]
    is_equipped: boolean
}

export type SheetItem = {
    item: {
        id: number
        name: string
        description: string
        value: number
        element_types: number[]
        item_abilities: any[]
        created_at: string
        updated_at: string
    }
    quantity: number
    elements: number[]
    abilities: any[]
}

export type FullCharacterSheet = {
    base: CharacterSheetBase
    race: SheetRace
    order: SheetOrder
    derived: CharacterDerived
    perks: Perk[]
    weapons: SheetWeapon[]
    armors: SheetArmor[]
    items: SheetItem[]
    abilities: CampaignCharacterAbility[]
}

export type FullCharacterSheetResponse = {
    sheet: FullCharacterSheet
}

export type Element = {
    id: number
    name: string
    description: string
    created_at: string
}

export type ElementByIdResponse = {
    element: Element
}

export type ElementsResponse = {
    elements: Element[]
}

export type Item = {
    id: number
    name: string
    description: string
    value: number
    element_types: number[]
    item_abilities: any[]
    created_at: string
    updated_at: string
  }
  
  export type FetchItemByIdResponse = {
    item: Item
  }