import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
    fetchCharacterById,
    fetchCharacterSheetInfo,
    fetchCharacterSheet,
    fetchPerksByRace,
    fetchPerksByOrder,
    addPerkToCampaignCharacter
} from '../campaigns.service'

import type {
    Character,
    CharacterSheetInfo,
    Perk
} from '../campaigns.types'

import CharacterProgressionModal from '../components/CharacterProgressionModal'
import CampaignCharacterPerkCard from '../components/CampaignCharacterPerkCard'
import '../campaigns.css'

function CampaignCharacterPerksPage() {
    const { campaignId, characterId } = useParams()
    const navigate = useNavigate()

    const [character, setCharacter] = useState<Character | null>(null)
    const [infos, setInfos] = useState<CharacterSheetInfo | null>(null)
    const [ownedPerkIds, setOwnedPerkIds] = useState<number[]>([])
    const [perks, setPerks] = useState<Perk[]>([])

    const [modalOpen, setModalOpen] = useState(false)
    const [addedModalOpen, setAddedModalOpen] = useState(false)

    useEffect(() => {
        if (!campaignId || !characterId) return

        fetchCharacterById(characterId).then(res => {
            setCharacter(res.character.character)
        })

        fetchCharacterSheetInfo(campaignId, characterId).then(res => {
            setInfos(res.infos)
        })

        fetchCharacterSheet(campaignId, characterId).then(res => {
            setOwnedPerkIds(res.sheet.perks.map(p => p.id))
        })
    }, [campaignId, characterId])

    useEffect(() => {
        if (!character || !infos) return

        Promise.all([
            fetchPerksByRace(character.race_id),
            fetchPerksByOrder(character.order_id)
        ]).then(([race, order]) => {
            const all = [...race.perks, ...order.perks]

            const available = all.filter(
                perk =>
                    perk.required_level <= infos.level &&
                    !ownedPerkIds.includes(perk.id)
            )

            setPerks(available)
        })
    }, [character, infos, ownedPerkIds])

    useEffect(() => {
        if (!infos) return

        if (infos.perks >= infos.level) {
            setModalOpen(true)
        }
    }, [infos])

    if (!character || !infos) {
        return (
            <div className="campaign-page-loading">
                Carregando perks...
            </div>
        )
    }

    const missing = infos.level - infos.perks

    const handleAddPerk = (perkId: number) => {
        addPerkToCampaignCharacter(campaignId!, {
            perk_id: perkId
        }).then(() => {
            fetchCharacterSheetInfo(campaignId!, characterId!)
                .then(r => setInfos(r.infos))

            fetchCharacterSheet(campaignId!, characterId!)
                .then(r => setOwnedPerkIds(r.sheet.perks.map(p => p.id)))

            setAddedModalOpen(true)
        })
    }

    return (
        <div className="campaign-perks-page">
            <header className="campaign-perks-header">
                <h1>Perks disponíveis</h1>
                <p>Faltam {missing} perk(s)</p>
            </header>

            {perks.map(perk => {
                const canAddByLevel = infos.level >= perk.required_level

                return (
                    <CampaignCharacterPerkCard
                        key={perk.id}
                        perk={perk}
                        canAdd={missing > 0 && canAddByLevel}
                        onAdd={handleAddPerk}
                    />
                )
            })}

            {modalOpen && (
                <CharacterProgressionModal
                    title="Perks completos"
                    message="Você já distribuiu todos os perks disponíveis. Agora pode voltar para a ficha do personagem."
                    onConfirm={() =>
                        navigate(`/campaign/${campaignId}/characters/${characterId}/sheet`)
                    }
                />
            )}

            {addedModalOpen && (
                <CharacterProgressionModal
                    title="Perk adicionado"
                    message="O perk foi adicionado com sucesso ao personagem."
                    onConfirm={() => setAddedModalOpen(false)}
                />
            )}
        </div>
    )
}

export default CampaignCharacterPerksPage
