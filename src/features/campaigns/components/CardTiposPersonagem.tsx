import type { Element } from '../campaigns.types'

type Props = {
    elements: Element[]
}

function CardTiposPersonagem({ elements }: Props) {
    return (
        <div className="sheet-card">
            <h3 className="sheet-card-title">Tipo do Personagem</h3>

            <div className="sheet-elements-list">
                {elements.map(el => (
                    <span
                        key={el.id}
                        className="item-element-tag"
                    >
                        {el.name}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default CardTiposPersonagem
