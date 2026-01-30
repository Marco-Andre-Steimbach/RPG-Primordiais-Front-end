import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { fetchWeapons } from '../weapons.service'
import { fetchCampaignById } from '../campaigns.service'

import type { Weapon } from '../weapons.types'
import type { CampaignCharacter } from '../campaigns.types'
import { fetchWeaponById } from '../weapons.service'


import MasterGiveWeaponCard from './MasterGiveWeaponCard'
import MasterGiveWeaponModal from './MasterGiveWeaponModal'

function MasterGiveWeapon() {
    const { id } = useParams()
    const campaignId = Number(id)

    const [weapons, setWeapons] = useState<Weapon[]>([])
    const [characters, setCharacters] = useState<CampaignCharacter[]>([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [filter, setFilter] = useState('')
    const [expandedWeaponId, setExpandedWeaponId] = useState<number | null>(null)

    const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null)
    const [action, setAction] = useState<'give' | 'buy' | null>(null)
    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        setLoading(true)
        setError(null)

        Promise.all([
            fetchWeapons(),
            fetchCampaignById(campaignId)
        ])
            .then(([weaponsRes, campaignRes]) => {
                setWeapons(weaponsRes.weapons)
                setCharacters(campaignRes.campaign.characters)
            })
            .catch(() => {
                setError('Falha ao carregar armas.')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [campaignId])

    const filteredWeapons = useMemo(() => {
        const q = filter.trim().toLowerCase()
        if (!q) return weapons
        return weapons.filter(w =>
            w.item_name.toLowerCase().includes(q)
        )
    }, [weapons, filter])

    function toggleExpand(id: number) {
        setExpandedWeaponId(v => (v === id ? null : id))
    }

    if (loading) {
        return (
            <section className="master-sheet card">
                <div className="master-sheet-loading">
                    Carregando armas...
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="master-sheet card">
                <div className="master-wizard-error">{error}</div>
            </section>
        )
    }

    return (
        <section className="master-sheet card">
            <h2 className="master-sheet-title">Dar / Comprar Arma</h2>

            <input
                className="master-search-input"
                placeholder="Buscar arma..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
            />

            {filteredWeapons.length === 0 ? (
                <div className="master-empty">
                    Nenhuma arma encontrada.
                </div>
            ) : (
                <div className="master-gold-list">
                    {filteredWeapons.map(weapon => (
                        <MasterGiveWeaponCard
                            key={weapon.id}
                            weapon={weapon}
                            expanded={expandedWeaponId === weapon.id}
                            onToggle={() => toggleExpand(weapon.id)}
                            onGive={async () => {
                                const res = await fetchWeaponById(weapon.id)
                                setSelectedWeapon(res.weapon)
                                setAction('give')
                                setModalOpen(true)
                            }}

                            onBuy={async () => {
                                const res = await fetchWeaponById(weapon.id)
                                setSelectedWeapon(res.weapon)
                                setAction('buy')
                                setModalOpen(true)
                            }}
                        />
                    ))}
                </div>
            )}

            {selectedWeapon && action && (
                <MasterGiveWeaponModal
                    open={modalOpen}
                    weapon={selectedWeapon}
                    action={action}
                    campaignId={campaignId}
                    characters={characters}
                    onClose={() => {
                        setModalOpen(false)
                        setSelectedWeapon(null)
                        setAction(null)
                    }}
                />
            )}
        </section>
    )
}

export default MasterGiveWeapon
