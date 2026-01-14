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
    CharacterSheetResponse
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
    campaignId: string | number,
    payload: AddPerkToCampaignCharacterPayload
) {
    return apiFetch<void>(
        `/campaign/${campaignId}/perk`,
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
  