export type GiveGoldPayload = {
    campaign_character_id: number
    amount: number
    operation: 'add' | 'remove'
}

export type GiveGoldResponse = {
    success: boolean
    gold: {
        gold: number
    }
}

export type UpdateCharacterXPRequest = {
    campaign_character_id: number
    amount: number
    operation: 'add' | 'remove'
}

export type UpdateCharacterXPResponse = {
    success: boolean
    xp: {
        current_xp: number
        total_xp: number
        next_level_xp: number
    }
}
