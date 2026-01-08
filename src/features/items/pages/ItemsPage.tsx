import { useNavigate } from 'react-router-dom'
import '../items.css'

function ItemsPage() {
  const navigate = useNavigate()

  return (
    <div className="items-container">
      <div
        className="items-card"
        style={{ backgroundImage: 'url(/assets/images/menu/items.jpg)' }}
        onClick={() => navigate('/items/all')}
      >
        <div className="items-card-title">Itens</div>
      </div>

      <div
        className="items-card"
        style={{ backgroundImage: 'url(/assets/images/menu/weapons.jpg)' }}
        onClick={() => navigate('/items/weapons')}
      >
        <div className="items-card-title">Armas</div>
      </div>

      <div
        className="items-card items-card-top"
        style={{ backgroundImage: 'url(/assets/images/menu/armors.jpg)' }}
        onClick={() => navigate('/items/armors')}
      >
        <div className="items-card-title">Armaduras</div>
      </div>
    </div>
  )
}

export default ItemsPage
