import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LoginPage from '../../features/auth/LoginPage'
import RegisterPage from '../../features/auth/RegisterPage'
import HomePage from '../../features/home/HomePage'
import InfoPage from '../../features/info/InfoPage'
import RacesPage from '../../features/races/pages/RacesPage'
import RaceDetailPage from '../../features/races/pages/RaceDetailPage'

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
      </Routes>
    </BrowserRouter>
  )
}

export default Router
