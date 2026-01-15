type Attributes = {
    str: number
    dex: number
    con: number
    intt: number
    wis: number
    cha: number
}

type Modifiers = {
    str: number
    dex: number
    con: number
    intt: number
    wis: number
    cha: number
}

type Props = {
    attributes: Attributes
    modifiers: Modifiers
}

function formatModifier(value: number) {
    if (value > 0) return `+${value}`
    return value.toString()
}

function CardAtributos({ attributes, modifiers }: Props) {
    return (
        <div className="sheet-card sheet-attributes">
            <h3 className="sheet-card-title">Atributos</h3>

            <div className="sheet-attributes-grid">
                <div className="sheet-attribute">
                    <span>Força</span>
                    <strong>{attributes.str}</strong>
                    <em>{formatModifier(modifiers.str)}</em>
                </div>

                <div className="sheet-attribute">
                    <span>Destreza</span>
                    <strong>{attributes.dex}</strong>
                    <em>{formatModifier(modifiers.dex)}</em>
                </div>

                <div className="sheet-attribute">
                    <span>Constituição</span>
                    <strong>{attributes.con}</strong>
                    <em>{formatModifier(modifiers.con)}</em>
                </div>

                <div className="sheet-attribute">
                    <span>Inteligência</span>
                    <strong>{attributes.intt}</strong>
                    <em>{formatModifier(modifiers.intt)}</em>
                </div>

                <div className="sheet-attribute">
                    <span>Sabedoria</span>
                    <strong>{attributes.wis}</strong>
                    <em>{formatModifier(modifiers.wis)}</em>
                </div>

                <div className="sheet-attribute">
                    <span>Carisma</span>
                    <strong>{attributes.cha}</strong>
                    <em>{formatModifier(modifiers.cha)}</em>
                </div>
            </div>
        </div>
    )
}

export default CardAtributos
