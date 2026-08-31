import type { LupidaArmor } from '../campaigns.types'

type Props = {
    armor: LupidaArmor
    strengthModifier: number
    onClose: () => void
}

function StrengthRequirementModal({
    armor,
    strengthModifier,
    onClose
}: Props) {
    const missingStrength =
        armor.min_strength_required - strengthModifier

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
                        O Demônio dos Olhos Amarelos gargalha
                    </span>

                    <h2>
                        Você chama isso de força?
                    </h2>

                    <p className="lupida-strength-modal-text">
                        Você realmente achou que conseguiria carregar{' '}
                        <strong>{armor.item_name}</strong>?
                    </p>

                    <div className="lupida-strength-comparison">
                        <div className="lupida-strength-value current">
                            <span>Sua Força</span>
                            <strong>
                                +{strengthModifier}
                            </strong>
                        </div>

                        <div className="lupida-strength-versus">
                            VS
                        </div>

                        <div className="lupida-strength-value required">
                            <span>Necessária</span>
                            <strong>
                                +{armor.min_strength_required}
                            </strong>
                        </div>
                    </div>

                    <div className="lupida-strength-missing">
                        Faltam{' '}
                        <strong>
                            {missingStrength}
                        </strong>{' '}
                        pontos de modificador de Força.
                    </div>

                    <blockquote className="lupida-demon-quote">
                        “Volte quando conseguir levantar algo mais pesado
                        que a própria vergonha.”
                    </blockquote>

                    <button
                        type="button"
                        className="lupida-strength-close"
                        onClick={onClose}
                    >
                        Sair sob gargalhadas
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StrengthRequirementModal
