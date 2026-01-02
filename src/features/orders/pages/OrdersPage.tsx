import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchOrders } from '../orders.service'
import type { Order } from '../orders.types'
import '../orders.css'

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrders().then(res => setOrders(res.orders))
  }, [])

  return (
    <div className="races-container">
      {orders.map(order => {
        const imgPath = `/assets/images/orders/${order.id}.jpg`

        return (
          <div
            key={order.id}
            className="race-card"
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            <div
              className="race-card-image"
              style={{ backgroundImage: `url(${imgPath})` }}
            >
              <span className="race-card-title">{order.name}</span>
              <span className="race-card-fallback">Falta imagem</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default OrdersPage
