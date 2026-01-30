export type CampaignCharacter = {
    campaign_character_id: number
    character_id: number
    name: string
    race_id: number
    order_id: number
    level: number
    controlled_by: string
}

export type Campaign = {
    id: number
    name: string
    description: string
    created_at: string
    master: string
    characters: CampaignCharacter[]
}

export type FetchCampaignResponse = {
    campaign: Campaign
}

export type GiveItemToCharacterPayload = {
    item_id: number
    quantity: number
}

export type GiveItemToCharacterResponse = {
    success: boolean
}

export type CampaignCharacterWeaponInfo = {
    id: number
    weapon_id: number
    item_id: number
}

export type CampaignCharacterArmorInfo = {
    id: number
    campaign_character_id: number
    armor_id: number
    is_equipped: number
    is_active: number
    item_id: number
    armor_slot_id: number
}

export type CampaignCharacterInfos = {
    campaign_character_id: number
    level: number
    gold: number
    perks: number
    abilities: number
    weapons: CampaignCharacterWeaponInfo[]
    armors: CampaignCharacterArmorInfo[]
}

export type FetchCampaignCharacterInfosResponse = {
    infos: CampaignCharacterInfos
}

export type GiveWeaponToCharacterPayload = {
    weapon_id: number
    equip: boolean
    deactivate_weapon_id?: number | null
}

export type GiveWeaponToCharacterResponse = {
    message: string
}

export type GiveArmorToCharacterPayload = {
    armor_item_id: number
    equip: boolean
}

export type GiveArmorToCharacterResponse = {
    success: true
}
