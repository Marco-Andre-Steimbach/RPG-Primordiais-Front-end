import { apiFetch } from '../../app/http/api'
import type {
  EncountersResponse,
  EncounterStatus,
  CreateEncounterPayload,
  CreateEncounterResponse,
  EncounterDetailsResponse,
  AddPlayerToEncounterPayload,
  AddPlayerToEncounterResponse,
  AddMonsterToEncounterPayload,
  AddMonsterToEncounterResponse,
  EncounterParticipantsResponse,
  SetEncounterInitiativePayload,
  SetEncounterInitiativeResponse,
  UpdateEncounterInitiativePayload,
  UpdateEncounterInitiativeResponse,
  UpdateEncounterStatusPayload,
  UpdateEncounterStatusResponse,
  EncounterCombatResponse,
  UpdateEncounterResourcesPayload,
  UpdateEncounterResourcesResponse
} from './encounters.types'

export function fetchEncounters(
  campaignId: number,
  status?: EncounterStatus
): Promise<EncountersResponse> {
  const params = new URLSearchParams({
    campaign_id: String(campaignId)
  })

  if (status) {
    params.set('status', status)
  }

  return apiFetch<EncountersResponse>(
    `/encounters?${params.toString()}`
  )
}

export function createEncounter(
  payload: CreateEncounterPayload
): Promise<CreateEncounterResponse> {
  return apiFetch<CreateEncounterResponse>(
    '/encounters',
    {
      method: 'POST',
      body: JSON.stringify(payload)
    }
  )
}

export function fetchEncounterById(
  encounterId: number
): Promise<EncounterDetailsResponse> {
  return apiFetch<EncounterDetailsResponse>(
    `/encounters/${encounterId}`
  )
}

export function addPlayerToEncounter(
  payload: AddPlayerToEncounterPayload
): Promise<AddPlayerToEncounterResponse> {
  return apiFetch<AddPlayerToEncounterResponse>(
    '/encounters/add-player',
    {
      method: 'POST',
      body: JSON.stringify(payload)
    }
  )
}

export function addMonsterToEncounter(
  payload: AddMonsterToEncounterPayload
): Promise<AddMonsterToEncounterResponse> {
  return apiFetch<AddMonsterToEncounterResponse>(
    '/encounters/add-monster',
    {
      method: 'POST',
      body: JSON.stringify(payload)
    }
  )
}

export function fetchEncounterParticipants(
  encounterId: number
): Promise<EncounterParticipantsResponse> {
  return apiFetch<EncounterParticipantsResponse>(
    `/encounters/${encounterId}/participants`
  )
}

export function setEncounterInitiative(
  payload: SetEncounterInitiativePayload
): Promise<SetEncounterInitiativeResponse> {
  return apiFetch<SetEncounterInitiativeResponse>(
    '/encounters/set-initiative',
    {
      method: 'POST',
      body: JSON.stringify(payload)
    }
  )
}

export function updateEncounterInitiative(
  payload: UpdateEncounterInitiativePayload
): Promise<UpdateEncounterInitiativeResponse> {
  return apiFetch<UpdateEncounterInitiativeResponse>(
    '/encounters/update-initiative',
    {
      method: 'PUT',
      body: JSON.stringify(payload)
    }
  )
}

export function updateEncounterStatus(
  payload: UpdateEncounterStatusPayload
): Promise<UpdateEncounterStatusResponse> {
  return apiFetch<UpdateEncounterStatusResponse>(
    '/encounters/update-status',
    {
      method: 'PUT',
      body: JSON.stringify(payload)
    }
  )
}

export function fetchEncounterCombat(
  encounterId: number
): Promise<EncounterCombatResponse> {
  return apiFetch<EncounterCombatResponse>(
    `/encounters/${encounterId}/combat`
  )
}

export function updateEncounterResources(
  payload: UpdateEncounterResourcesPayload
): Promise<UpdateEncounterResourcesResponse> {
  return apiFetch<UpdateEncounterResourcesResponse>(
    '/encounters/update-resources',
    {
      method: 'PUT',
      body: JSON.stringify(payload)
    }
  )
}
