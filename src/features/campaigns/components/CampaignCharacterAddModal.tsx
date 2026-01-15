import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
    fetchRaceById,
    fetchOrderById,
    addCharacterToCampaign
} from '../campaigns.service'

import type {
    MyCharacter,
    AddCharacterToCampaignAttributes
} from '../campaigns.types'

type Props = {
    character: MyCharacter
    onClose: () => void
}

type Step = 'rolls' | 'sanity' | 'free'

type RolledAttributes = {
    str: number
    dex: number
    con: number
    intt: number
    wis: number
    cha: number
}

type FreeAttributes = {
    str: number
    dex: number
    con: number
    intt: number
    wis: number
    cha: number
}

function CampaignCharacterAddModal({
    character,
    onClose
}: Props) {
    const navigate = useNavigate()
    const { id: campaignId } = useParams()

    const [step, setStep] = useState<Step>('rolls')

    const [rolled, setRolled] = useState<RolledAttributes>({
        str: 0,
        dex: 0,
        con: 0,
        intt: 0,
        wis: 0,
        cha: 0
    })

    const [sanity, setSanity] = useState(0)

    const [free, setFree] = useState<FreeAttributes>({
        str: 0,
        dex: 0,
        con: 0,
        intt: 0,
        wis: 0,
        cha: 0
    })

    const [remainingFree, setRemainingFree] = useState(0)

    useEffect(() => {
        if (!character.race_id || !character.order_id) return

        Promise.all([
            fetchRaceById(character.race_id),
            fetchOrderById(character.order_id)
        ]).then(([raceRes, orderRes]) => {
            const totalFree =
                raceRes.race.attributes.free +
                orderRes.order.attributes.free

            setRemainingFree(totalFree)
        })
    }, [character])

    function canProceedRolls() {
        return Object.values(rolled).every(v => v > 0)
    }

    function addFree(attr: keyof FreeAttributes) {
        if (remainingFree <= 0) return

        setFree(prev => ({
            ...prev,
            [attr]: prev[attr] + 1
        }))

        setRemainingFree(prev => prev - 1)
    }

    function removeFree(attr: keyof FreeAttributes) {
        if (free[attr] <= 0) return

        setFree(prev => ({
            ...prev,
            [attr]: prev[attr] - 1
        }))

        setRemainingFree(prev => prev + 1)
    }

    function buildPayload(): AddCharacterToCampaignAttributes {
        return {
            str: rolled.str + free.str,
            dex: rolled.dex + free.dex,
            con: rolled.con + free.con,
            intt: rolled.intt + free.intt,
            wis: rolled.wis + free.wis,
            cha: rolled.cha + free.cha,
            sanity
        }
    }

    function handleConfirm() {
        console.log("eae")
        console.log(campaignId)
        if (!campaignId) return

        addCharacterToCampaign(campaignId, {
            character_id: character.id,
            attributes: buildPayload()
        })
            .then(() => {
                onClose()
                navigate(`/campaigns/${campaignId}`)
            })
    }

    return (
        <div className="progression-modal-backdrop">
            <div className="progression-modal modal-large">

                {step === 'rolls' && (
                    <>
                        <h3>Distribuir valores rolados</h3>

                        <p className="modal-hint">
                            Jogue 4d6 seis vezes e distribua os valores
                        </p>

                        {Object.entries(rolled).map(([key, value]) => (
                            <div key={key} className="attribute-row">
                                <span>{key.toUpperCase()}</span>

                                <input
                                    type="number"
                                    min={1}
                                    value={value === 0 ? '' : value}
                                    onBlur={e => {
                                        if (e.target.value === '') {
                                            setRolled(prev => ({
                                                ...prev,
                                                [key]: 0
                                            }))
                                        }
                                    }}
                                    onChange={e =>
                                        setRolled(prev => ({
                                            ...prev,
                                            [key]: Number(e.target.value)
                                        }))
                                    }
                                />
                            </div>
                        ))}

                        <button
                            className="campaign-character-button primary"
                            disabled={!canProceedRolls()}
                            onClick={() => setStep('sanity')}
                        >
                            Confirmar valores
                        </button>
                    </>
                )}

                {step === 'sanity' && (
                    <>
                        <h3>Sanidade</h3>

                        <p className="modal-hint">
                            Role 1d100 para determinar sua sanidade
                        </p>

                        <div className="sanity-box">
                            <input
                                type="number"
                                min={1}
                                max={100}
                                value={sanity === 0 ? '' : sanity}
                                onBlur={e => {
                                    if (e.target.value === '') {
                                        setSanity(0)
                                    }
                                }}
                                onChange={e =>
                                    setSanity(Number(e.target.value))
                                }
                            />
                        </div>

                        <button
                            className="campaign-character-button primary"
                            disabled={sanity < 1 || sanity > 100}
                            onClick={() => setStep('free')}
                        >
                            Confirmar sanidade
                        </button>
                    </>
                )}

                {step === 'free' && (
                    <>
                        <h3>
                            Pontos livres disponíveis: {remainingFree}
                        </h3>

                        {Object.keys(free).map(attr => (
                            <div key={attr} className="attribute-row">
                                <span>
                                    {attr.toUpperCase()}:{' '}
                                    {
                                        rolled[
                                            attr as keyof RolledAttributes
                                        ] +
                                        free[
                                            attr as keyof FreeAttributes
                                        ]
                                    }
                                </span>

                                <div className="free-controls">
                                    <button
                                        onClick={() =>
                                            removeFree(
                                                attr as keyof FreeAttributes
                                            )
                                        }
                                    >
                                        -
                                    </button>

                                    <button
                                        onClick={() =>
                                            addFree(
                                                attr as keyof FreeAttributes
                                            )
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            className="campaign-character-button primary"
                            disabled={remainingFree !== 0}
                            onClick={handleConfirm}
                        >
                            Confirmar personagem
                        </button>
                    </>
                )}

                <button
                    className="campaign-character-button"
                    onClick={onClose}
                >
                    Cancelar
                </button>
            </div>
        </div>
    )
}

export default CampaignCharacterAddModal
