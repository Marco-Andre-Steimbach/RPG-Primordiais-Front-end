import { apiFetch } from '../../app/http/api'
import type {
    CampaignsResponse,
    CampaignByIdResponse,
    UserMeResponse,
    CharacterSheetInfoResponse,
    CharacterByIdResponse,
    PerksResponse,
    AddPerkToCampaignCharacterPayload,
    AddAbilityToCampaignCharacterPayload,
    CampaignCharacterActionResponse,
    CharacterSheetResponse,
    CharacterAbilitiesResponse,
    CharacterAbilityByIdResponse,
    AddCharacterToCampaignPayload,
    AddCharacterToCampaignResponse,
    MyCharactersResponse,
    RaceByIdResponse,
    OrderByIdResponse,
    CampaignCharacterLevelUpPayload,
    CampaignCharacterLevelUpResponse,
    FullCharacterSheetResponse,
    ElementByIdResponse,
    ElementsResponse,
    FetchItemByIdResponse,
    LupidaResponse,
    SpendGoldPayload,
    WeaponDetails
} from './campaigns.types'

export function fetchAllCampaigns() {
    return apiFetch<CampaignsResponse>('/campaign')
}

export function fetchCampaignById(id: string | number) {
    return apiFetch<CampaignByIdResponse>(`/campaign/${id}`)
}

export function fetchMe() {
    return apiFetch<UserMeResponse>('/users/me')
}

export function fetchCharacterSheetInfo(
    campaignId: string | number,
    characterId: string | number
) {
    return apiFetch<CharacterSheetInfoResponse>(
        `/campaign/${campaignId}/character/${characterId}/info`
    )
}

export function fetchCharacterById(characterId: string | number) {
    return apiFetch<CharacterByIdResponse>(`/character/${characterId}`)
}

export function fetchPerksByRace(raceId: string | number) {
    return apiFetch<PerksResponse>(`/races/${raceId}/perks`)
}

export function fetchPerksByOrder(orderId: string | number) {
    return apiFetch<PerksResponse>(`/orders/${orderId}/perks`)
}

export function addPerkToCampaignCharacter(
    campaignCharacterId: string | number,
    payload: AddPerkToCampaignCharacterPayload
) {
    return apiFetch<void>(
        `/campaign/${campaignCharacterId}/perk`,
        {
            method: 'POST',
            body: JSON.stringify(payload)
        }
    )
}

export function addAbilityToCampaignCharacter(
    campaignId: string | number,
    payload: AddAbilityToCampaignCharacterPayload
) {
    return apiFetch<CampaignCharacterActionResponse>(
        `/campaign/${campaignId}/ability`,
        {
            method: 'POST',
            body: JSON.stringify(payload)
        }
    )
}

export function fetchCharacterSheet(
    campaignId: string | number,
    characterId: string | number
) {
    return apiFetch<CharacterSheetResponse>(
        `/campaign/${campaignId}/character/${characterId}/sheet`
    )
}

export function fetchCharacterAbilities(characterId: string | number) {
    return apiFetch<CharacterAbilitiesResponse>(
        `/character/${characterId}/abilities`
    )
}

export function fetchCharacterAbilityById(
    characterId: string | number,
    abilityId: string | number
) {
    return apiFetch<CharacterAbilityByIdResponse>(
        `/character/${characterId}/abilities/${abilityId}`
    )
}

export function addCharacterToCampaign(
    campaignId: string | number,
    payload: AddCharacterToCampaignPayload
) {
    return apiFetch<AddCharacterToCampaignResponse>(
        `/campaign/${campaignId}/characters`,
        {
            method: 'POST',
            body: JSON.stringify(payload)
        }
    )
}

export function fetchMyCharacters() {
    return apiFetch<MyCharactersResponse>('/character/me')
}

export function fetchRaceById(raceId: string | number) {
    return apiFetch<RaceByIdResponse>(`/races/${raceId}`)
}

export function fetchOrderById(orderId: string | number) {
    return apiFetch<OrderByIdResponse>(`/orders/${orderId}`)
}

export function levelUpCampaignCharacter(
    payload: CampaignCharacterLevelUpPayload
) {
    return apiFetch<CampaignCharacterLevelUpResponse>(
        '/campaign/characters/level-up',
        {
            method: 'POST',
            body: JSON.stringify(payload)
        }
    )
}

export function fetchFullCharacterSheet(
    campaignId: string | number,
    campaignCharacterId: string | number
) {
    return apiFetch<FullCharacterSheetResponse>(
        `/campaign/${campaignId}/character/${campaignCharacterId}/sheet`
    )
}

export function fetchElementById(elementId: string | number) {
    return apiFetch<ElementByIdResponse>(
        `/elements/${elementId}`
    )
}

export function fetchAllElements() {
    return apiFetch<ElementsResponse>('/elements')
}

export function fetchItemById(itemId: string | number) {
    return apiFetch<FetchItemByIdResponse>(
        `/items/${itemId}`
    )
}

export function fetchLupida(campaignId: string | number) {
    return apiFetch<LupidaResponse>(
        `/campaign/${campaignId}/lupida`
    )
}

export function spendCampaignCharacterGold(
    payload: SpendGoldPayload
) {
    return apiFetch<CampaignCharacterActionResponse>(
        '/campaign/characters/gold',
        {
            method: 'POST',
            body: JSON.stringify(payload)
        }
    )
}

export function fetchCampaignCharacterGold(
    campaignId: string | number,
    characterId: string | number
) {
    return apiFetch<CharacterSheetInfoResponse>(
        `/campaign/${campaignId}/character/${characterId}/info`
    )
}

export function addArmorToCampaignCharacter(
    campaignCharacterId: string | number,
    payload: {
        armor_item_id: number
        equip: boolean
    }
) {
    return apiFetch<CampaignCharacterActionResponse>(
        `/campaign/${campaignCharacterId}/armor`,
        {
            method: 'POST',
            body: JSON.stringify(payload)
        }
    )
}

export function addWeaponToCampaignCharacter(
    campaignCharacterId: number,
    payload: {
        weapon_id: number
        equip?: boolean
        deactivate_weapon_id?: number
    }
) {
    return apiFetch(
        `/campaign/${campaignCharacterId}/weapon`,
        {
            method: 'POST',
            body: JSON.stringify(payload)
        }
    )
}

export function fetchWeaponById(id: number) {
    return apiFetch<{ weapon: WeaponDetails }>(`/weapons/${id}`, {
        method: 'GET'
    })
}

export function addItemToCampaignCharacter(
    campaignCharacterId: string | number,
    payload: {
        item_id: number
        quantity: number
    }
) {
    return apiFetch(
        `/campaign/${campaignCharacterId}/item`,
        {
            method: 'POST',
            body: JSON.stringify(payload)
        }
    )
}

export function useCampaignCharacterItem(payload: {
    campaign_character_id: number
    item_id: number
}) {
    return apiFetch(
        '/campaign/item/use',
        {
            method: 'PUT',
            body: JSON.stringify(payload)
        }
    )
}

export function fetchMyCampaigns() {
    return apiFetch<CampaignsResponse>('/campaign/my')
}

export function confirmCampaignCharacterLevelUp(
    payload: CampaignCharacterLevelUpPayload
) {
    return apiFetch<CampaignCharacterLevelUpResponse>(
        '/campaign/characters/confirm-level-up',
        {
            method: 'POST',
            body: JSON.stringify(payload)
        }
    )
}

