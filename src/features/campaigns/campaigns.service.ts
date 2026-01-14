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
    MyCharactersResponse
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
