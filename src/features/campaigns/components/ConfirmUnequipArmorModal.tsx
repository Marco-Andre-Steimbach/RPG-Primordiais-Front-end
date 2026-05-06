type Props = {
    armorName: string
    loading: boolean
    onConfirm: () => void
    onCancel: () => void
}

function ConfirmUnequipArmorModal({
    armorName,
    loading,
    onConfirm,
    onCancel
}: Props) {
    return (
        <div className="unequip-modal-backdrop">
            <div className="unequip-modal">
                <h3>Desequipar armadura?</h3>

                <p>
                    Tem certeza que deseja desequipar <strong>{armorName}</strong>?
                </p>

                <p>
                    Essa ação não poderá ser desfeita.
                </p>

                <div className="unequip-modal-actions">
                    <button
                        type="button"
                        className="secondary"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className="danger"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Desequipando...' : 'Desequipar'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmUnequipArmorModal
