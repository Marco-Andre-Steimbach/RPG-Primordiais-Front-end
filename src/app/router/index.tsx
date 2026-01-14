import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './MainLayout'

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
import CharactersMenuPage from '../../features/characters/pages/CharactersMenuPage'
import CharacterCreatePage from '../../features/characters/pages/CharacterCreatePage'
import CharacterMePage from '../../features/characters/pages/CharacterMePage'
import CharacterPage from '../../features/characters/pages/CharacterPage'
import CreateAbilityPage from '../../features/characters/pages/CreateAbilityPage'
import CharacterAllPage from '../../features/characters/pages/CharacterAllPage'
import ArmorsAllPage from '../../features/armors/pages/ArmorsAllPage'
import CampaignsMenuPage from '../../features/campaigns/pages/CampaignsMenuPage'
import CampaignsAllPage from '../../features/campaigns/pages/CampaignsAllPage'
import CampaignPage from '../../features/campaigns/pages/CampaignPage'
import CharacterSheetPage from '../../features/campaigns/pages/CharacterSheetPage'
import CampaignCharacterPerksPage from '../../features/campaigns/pages/CampaignCharacterPerksPage'
import CampaignCharacterAbilitiesPage from '../../features/campaigns/pages/CampaignCharacterAbilitiesPage'
import CampaignCharacterAddPage from '../../features/campaigns/pages/CampaignCharacterAddPage'

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route element={<MainLayout />}>
          <Route path="/info" element={<InfoPage />} />
          <Route path="/races" element={<RacesPage />} />
          <Route path="/races/:id" element={<RaceDetailPage />} />
          <Route path="/perks/:id" element={<PerkDetailPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/items/all" element={<ItemsAllPage />} />
          <Route path="/items/weapons" element={<WeaponsAllPage />} />
          <Route path="/items/armors" element={<ArmorsAllPage />} />
          <Route path="/characters" element={<CharactersMenuPage />} />
          <Route path="/characters/create" element={<CharacterCreatePage />} />
          <Route path="/characters/my" element={<CharacterMePage />} />
          <Route path="/characters/:id" element={<CharacterPage />} />
          <Route path="/character/:id/ability" element={<CreateAbilityPage />} />
          <Route path="/character/all" element={<CharacterAllPage />} />
          <Route path="/campaigns" element={<CampaignsMenuPage />} />
          <Route path="/campaigns/all" element={<CampaignsAllPage />} />
          <Route path="/campaigns/:id" element={<CampaignPage />} />
          <Route path="/campaign/:campaignId/characters/:characterId/sheet" element={<CharacterSheetPage />} />
          <Route path="/campaign/:campaignId/characters/:characterId/perks" element={<CampaignCharacterPerksPage />} />
          <Route path="/campaign/:campaignId/characters/:characterId/abilities" element={<CampaignCharacterAbilitiesPage />} />
          <Route path="/campaign/:id/characters" element={<CampaignCharacterAddPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
