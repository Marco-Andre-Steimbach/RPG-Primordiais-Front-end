import type { Item } from '../items.types'

type Props = {
    item: Item
    expanded: boolean
    onToggle: () => void
    onGive: () => void
    onBuy: () => void
}

function MasterGiveItemCard({
    item,
    expanded,
    onToggle,
    onGive,
    onBuy
}: Props) {
    return (
        <div className="master-item-card">
            <div
                className="master-item-header"
                onClick={onToggle}
                role="button"
                tabIndex={0}
            >
                <strong>{item.name}</strong>
            </div>

            {expanded && (
                <div className="master-item-body" onClick={e => e.stopPropagation()}>
                    <p className="master-item-description">
                        {item.description}
                    </p>

                    <div className="master-item-footer">
                        <span className="master-item-value">
                            Valor: {item.value}
                        </span>

                        <div className="master-item-actions">
                            <button
                                className="master-item-btn give"
                                onClick={onGive}
                            >
                                Dar
                            </button>

                            <button
                                className="master-item-btn buy"
                                onClick={onBuy}
                            >
                                Comprar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MasterGiveItemCard
