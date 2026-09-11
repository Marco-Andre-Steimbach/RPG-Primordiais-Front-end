import type { LupidaWeapon } from '../campaigns.types'

type Props = {
    weapon: LupidaWeapon
    currentModifier: number
    onClose: () => void
}

const MODIFIER_LABELS: Record<
    LupidaWeapon['required_modifier'],
    string
> = {
    str: 'Força',
    dex: 'Destreza',
    con: 'Constituição',
    int: 'Inteligência',
    wis: 'Sabedoria',
    cha: 'Carisma'
}

function WeaponRequirementModal({
    weapon,
    currentModifier,
    onClose
}: Props) {
    const modifierLabel =
        MODIFIER_LABELS[weapon.required_modifier]

    const missingModifier =
        weapon.required_modifier_value - currentModifier

    return (
        <div
            className="lupida-strength-modal-backdrop"
            onClick={onClose}
        >
            <div
                className="lupida-strength-modal"
                onClick={event => event.stopPropagation()}
            >
                <div className="lupida-demon-face">
                    <div className="lupida-demon-eye left" />
                    <div className="lupida-demon-eye right" />

                    <div className="lupida-demon-smile">
                        HAHAHAHA
                    </div>
                </div>

                <div className="lupida-strength-modal-content">
                    <span className="lupida-strength-modal-eyebrow">
                        O Demônio dos Olhos Amarelos observa sua escolha
                    </span>

                    <h2>
                        Você ainda não pode comprar esta arma
                    </h2>

                    <p className="lupida-strength-modal-text">
                        Você não possui modificador de{' '}
                        <strong>{modifierLabel}</strong>{' '}
                        suficiente para comprar{' '}
                        <strong>{weapon.item_name}</strong>.
                    </p>

                    <div className="lupida-strength-comparison">
                        <div className="lupida-strength-value current">
                            <span>
                                Sua {modifierLabel}
                            </span>

                            <strong>
                                +{currentModifier}
                            </strong>
                        </div>

                        <div className="lupida-strength-versus">
                            VS
                        </div>

                        <div className="lupida-strength-value required">
                            <span>
                                Necessária
                            </span>

                            <strong>
                                +{weapon.required_modifier_value}
                            </strong>
                        </div>
                    </div>

                    <div className="lupida-strength-missing">
                        Faltam{' '}
                        <strong>
                            {missingModifier}
                        </strong>{' '}
                        pontos de modificador de {modifierLabel}.
                    </div>

                    <blockquote className="lupida-demon-quote">
                        “Volte quando estiver à altura da arma que deseja.”
                    </blockquote>

                    <div className="lupida-strength-actions">
                        <button
                            type="button"
                            className="lupida-strength-close"
                            onClick={onClose}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WeaponRequirementModal
