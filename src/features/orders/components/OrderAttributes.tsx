import type { OrderAttributes as OrderAttributesType } from '../orders.types'

type Props = {
  attributes: OrderAttributesType
}

function OrderAttributes({ attributes }: Props) {
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

export default OrderAttributes