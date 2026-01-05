import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LoginPage from '../../features/auth/LoginPage'
import RegisterPage from '../../features/auth/RegisterPage'
import HomePage from '../../features/home/HomePage'
import InfoPage from '../../features/info/InfoPage'
import RacesPage from '../../features/races/pages/RacesPage'
import RaceDetailPage from '../../features/races/pages/RaceDetailPage'
import PerkDetailPage from '../../features/perks/pages/PerkDetailPage'
import OrdersPage from '../../features/orders/pages/OrdersPage'
import OrderDetailPage from '../../features/orders/pages/OrderDetailPage'
import ItemsPage from '../../features/items/pages/ItemsPage'
import ItemsAllPage from '../../features/items/pages/ItemsAllPage'
import WeaponsAllPage from '../../features/weapons/pages/WeaponsAllPage'

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/races" element={<RacesPage />} />
        <Route path="/races/:id" element={<RaceDetailPage />} />
        <Route path="/perks/:id" element={<PerkDetailPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/items/all" element={<ItemsAllPage />} />
        <Route path="/items/weapons" element={<WeaponsAllPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
