import { apiFetch } from '../../app/http/api'
import type {
    FetchCampaignResponse,
    GiveItemToCharacterPayload,
    GiveItemToCharacterResponse,
    FetchCampaignCharacterInfosResponse,
    GiveWeaponToCharacterPayload,
    GiveWeaponToCharacterResponse,
    GiveArmorToCharacterPayload,
    GiveArmorToCharacterResponse
} from './campaigns.types'

export function fetchCampaignById(
    campaignId: number
): Promise<FetchCampaignResponse> {
    return apiFetch<FetchCampaignResponse>(`/campaign/${campaignId}`)
}

export function giveItemToCharacter(
    campaignCharacterId: number,
    payload: GiveItemToCharacterPayload
): Promise<GiveItemToCharacterResponse> {
    return apiFetch<GiveItemToCharacterResponse>(
        `/campaign/${campaignCharacterId}/item`,
        {
            method: 'POST',
            body: JSON.stringify(payload)
        }
    )
}

export function fetchCampaignCharacterInfos(
    campaignId: number,
    characterId: number
): Promise<FetchCampaignCharacterInfosResponse> {
    return apiFetch<FetchCampaignCharacterInfosResponse>(
        `/campaign/${campaignId}/character/${characterId}/info`
    )
}

export function giveWeaponToCharacter(
    campaignCharacterId: number,
    payload: GiveWeaponToCharacterPayload
): Promise<GiveWeaponToCharacterResponse> {
    return apiFetch<GiveWeaponToCharacterResponse>(
        `/campaign/${campaignCharacterId}/weapon`,
        {
            method: 'POST',
            body: JSON.stringify(payload)
        }
    )
}

export function giveArmorToCharacter(
    campaignCharacterId: number,
    payload: GiveArmorToCharacterPayload
): Promise<GiveArmorToCharacterResponse> {
    return apiFetch<GiveArmorToCharacterResponse>(
        `/campaign/${campaignCharacterId}/armor`,
        {
            method: 'POST',
            body: JSON.stringify(payload)
        }
    )
}