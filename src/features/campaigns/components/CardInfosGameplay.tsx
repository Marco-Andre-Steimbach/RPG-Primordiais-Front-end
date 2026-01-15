type Props = {
    level: number
    hpMax: number
    manaMax: number
    armorClass: number
    sanityMax: number
    speed: number
}

function CardInfosGameplay({
    level,
    hpMax,
    manaMax,
    armorClass,
    sanityMax,
    speed
}: Props) {
    return (
        <div className="sheet-card sheet-infos-gameplay">
            <h3 className="sheet-card-title">Informações de Combate</h3>

            <div className="sheet-meta-grid">
                <div>
                    <span>Nível</span>
                    <strong>{level}</strong>
                </div>

                <div>
                    <span>Vida Máx.</span>
                    <strong>{hpMax}</strong>
                </div>

                <div>
                    <span>Mana Máx.</span>
                    <strong>{manaMax}</strong>
                </div>

                <div>
                    <span>Classe de Armadura</span>
                    <strong>{armorClass}</strong>
                </div>

                <div>
                    <span>Sanidade Máx.</span>
                    <strong>{sanityMax}</strong>
                </div>

                <div>
                    <span>Deslocamento</span>
                    <strong>{speed}</strong>
                </div>
            </div>
        </div>
    )
}

export default CardInfosGameplay
