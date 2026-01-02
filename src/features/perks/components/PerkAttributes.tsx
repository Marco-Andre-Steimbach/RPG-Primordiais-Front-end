import type { PerkAttribute } from '../perks.types'

function PerkAttributes({ attributes }: { attributes: PerkAttribute[] }) {
  return (
    <div className="perk-attributes">
      {attributes.map(attr => (
        <div key={attr.attribute_name} className="perk-attribute">
          {attr.attribute_name.toUpperCase()}: {attr.attribute_value}
        </div>
      ))}
    </div>
  )
}

export default PerkAttributes
