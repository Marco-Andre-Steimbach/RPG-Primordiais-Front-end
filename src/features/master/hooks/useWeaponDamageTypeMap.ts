import { useEffect, useState } from 'react'
import type { WeaponDamageType } from '../weaponDamage.types'

export function useWeaponDamageTypeMap() {
    const [map, setMap] = useState<Map<number, WeaponDamageType>>(new Map())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const data: WeaponDamageType[] = [
            {
                id: 1,
                name: 'Cortante',
                description: 'Dano causado por lâminas e golpes de corte.',
                primary_attribute: 'STR'
            },
            {
                id: 2,
                name: 'Perfurante',
                description: 'Dano causado por estocadas, flechas e projéteis.',
                primary_attribute: 'DEX'
            },
            {
                id: 3,
                name: 'Concussão',
                description: 'Dano causado por impacto bruto e força contundente.',
                primary_attribute: 'STR'
            }
        ]

        const weaponMap = new Map<number, WeaponDamageType>()
        data.forEach(d => weaponMap.set(d.id, d))

        setMap(weaponMap)
        setLoading(false)
    }, [])

    return {
        weaponDamageTypeMap: map,
        loading
    }
}
