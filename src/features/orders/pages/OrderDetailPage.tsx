import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchOrderById, fetchOrderPerks } from '../orders.service'
import type { Order, Perk } from '../orders.types'
import OrderHeader from '../components/OrderHeader'
import OrderAttributes from '../components/OrderAttributes'
import OrderPerks from '../components/OrderPerks'
import '../order-detail.css'

function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [perks, setPerks] = useState<Perk[]>([])

  useEffect(() => {
    if (!id) return
    fetchOrderById(id).then(res => setOrder(res.order))
    fetchOrderPerks(id).then(res => setPerks(res.perks))
  }, [id])

  if (!order) return null

  return (
    <div className="race-detail-container">
      <OrderHeader name={order.name} />

      <div className="race-info-card">
        <div
          className="race-info-image"
          style={{ backgroundImage: `url(/assets/images/orders/${order.id}.jpg)` }}
        />

        <div className="race-info-content">
          <p className="race-description">{order.description}</p>
        </div>
      </div>

      <OrderAttributes attributes={order.attributes} />

      <OrderPerks perks={perks} />
    </div>
  )
}

export default OrderDetailPage
