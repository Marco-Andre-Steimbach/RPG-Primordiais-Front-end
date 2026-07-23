export type EncounterStatus = 'pending' | 'active' | 'finished'

export type EncounterListItem = {
  id: number
  name: string
  status: EncounterStatus
}

export type EncountersResponse = {
  encounters: EncounterListItem[]
}

export type CreateEncounterPayload = {
  campaign_id: number
  name: string
  description: string
}

export type CreateEncounterResponse = {
  message: string
  encounter: {
    id: number
    campaign_id: number
    name: string
    description: string
    status: EncounterStatus
    created_at: string
  }
}

export type EncounterDetails = {
  id: number
  campaign_id: number
  name: string
  description: string
  status: EncounterStatus
  created_at: string | null
}

export type EncounterDetailsResponse = {
  encounter: EncounterDetails
}

export type AddPlayerToEncounterPayload = {
  encounter_id: number
  campaign_character_id: number
}

export type AddPlayerToEncounterResponse = {
  message: string
}

export type AddMonsterToEncounterPayload = {
  encounter_id: number
  monster_id: number
  quantity: number
  monster_level: number
}

export type AddMonsterToEncounterResponse = {
  message: string
  data: unknown
}

export type EncounterParticipantMonster = {
  encounter_monster_id: number
  monster_name: string
}

export type EncounterParticipantPlayer = {
  encounter_player_id: number
  character_name: string
}

export type EncounterParticipants = {
  encounter_id: number
  monsters: EncounterParticipantMonster[]
  players: EncounterParticipantPlayer[]
}

export type EncounterParticipantsResponse = {
  participants: EncounterParticipants
}

export type SetEncounterInitiativePayload = {
  encounter_id: number
  initiative_value: number
  encounter_monster_id?: number
  encounter_player_id?: number
}

export type SetEncounterInitiativeResponse = {
  message: string
}

export type UpdateEncounterStatusPayload = {
  encounter_id: number
  status: EncounterStatus
}

export type UpdateEncounterStatusResponse = {
  message: string
}

export type CombatSetupParticipant = {
  key: string
  type: 'player' | 'monster'
  targetId: number
  name: string
  displayName: string
  initiative: string
}

export type EncounterCombatPlayer = {
  type: 'player'
  initiative_id: number
  initiative_value: number
  encounter_player_id: number
  campaign_character_id: number
  character_id: number
  name: string
  current_hp: number
  max_hp: number
  current_mana: number
  max_mana: number
  current_sanity: number
  max_sanity: number
  armor_class: number
}

export type EncounterCombatMonster = {
  type: 'monster'
  initiative_id: number
  initiative_value: number
  encounter_monster_id: number
  monster_id: number
  monster_level: number
  name: string
  current_hp: number
  max_hp: number
}

export type EncounterCombatParticipant =
  | EncounterCombatPlayer
  | EncounterCombatMonster

export type EncounterCombat = {
  encounter_id: number
  campaign_id: number
  name: string
  description: string
  status: EncounterStatus
  turn_order: EncounterCombatParticipant[]
}

export type EncounterCombatResponse = {
  combat: EncounterCombat
}
