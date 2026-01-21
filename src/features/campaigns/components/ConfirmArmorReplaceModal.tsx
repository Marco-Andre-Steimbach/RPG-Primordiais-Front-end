import type { LupidaArmor } from '../campaigns.types'

type Props = {
    armor: LupidaArmor
    onCancel: () => void
    onConfirm: () => void
}

function ConfirmArmorReplaceModal({ armor, onCancel, onConfirm }: Props) {
    return (
        <div className="lupida-modal-backdrop">
            <div className="lupida-modal">
                <h3>Substituir armadura?</h3>

                <p>
                    Você já possui um item equipado no slot <strong>{armor.slot_name}</strong>.
                </p>

                <p>
                    Ao comprar <strong>{armor.item_name}</strong>, o item atual será desequipado automaticamente.
                </p>

                <div className="lupida-modal-actions">
                    <button className="secondary" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button className="primary" onClick={onConfirm}>
                        Confirmar compra
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmArmorReplaceModal
