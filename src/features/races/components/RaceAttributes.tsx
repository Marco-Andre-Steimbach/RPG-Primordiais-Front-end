import type { RaceAttributes as RaceAttributesType } from '../races.types'

type Props = {
  attributes: RaceAttributesType
}

function RaceAttributes({ attributes }: Props) {
  return (
    <div className="race-attributes">
      {Object.entries(attributes).map(([key, value]) => (
        <div key={key} className="attribute-item">
          <span className="attr-text">
            {key.toUpperCase()}: {value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default RaceAttributes
