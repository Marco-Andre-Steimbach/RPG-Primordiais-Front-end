type Props = {
  level: number
  gold: number
  xpCurrent: number
  xpRequired: number
  xpRemaining: number
  pendingLevelUps: number
}

function CardInfosGerais({
  level,
  gold,
  xpCurrent,
  xpRequired,
  xpRemaining,
  pendingLevelUps
}: Props) {

  const xpPercent =
    xpRequired > 0
      ? Math.min(100, Math.floor((xpCurrent / xpRequired) * 100))
      : 0

  return (
    <div className="card-infos-gerais">
      <h3 className="card-title">Informações Gerais</h3>

      <div className="infos-gerais-grid">
        <div className="info-box">
          <span className="label">Nível</span>
          <strong className="value">{level}</strong>

          {pendingLevelUps > 0 && (
            <span className="levelup-badge">
              +{pendingLevelUps}
            </span>
          )}
        </div>

        <div className="info-box">
          <span className="label">Ouro</span>
          <strong className="value">{gold}</strong>
        </div>
      </div>

      <div className="xp-container">
        <div className="xp-header">
          <span>Experiência</span>
          <span>
            {xpCurrent} / {xpRequired}
          </span>
        </div>

        <div className="xp-bar">
          <div
            className={`xp-bar-fill ${pendingLevelUps > 0 ? 'level-ready' : ''}`}
            style={{ width: `${xpPercent}%` }}
          />
        </div>

        <div className="xp-footer">
          {pendingLevelUps > 0 ? (
            <strong className="levelup-text">
              Atributo pendente para evoluir
            </strong>
          ) : (
            <>
              Faltam <strong>{xpRemaining}</strong> XP para o próximo nível
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CardInfosGerais
