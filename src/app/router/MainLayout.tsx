import { Outlet } from 'react-router-dom'
import BottomNav from '../../shared/components/BottomNav/BottomNav'

function MainLayout() {
  return (
    <>
      <div id="app-scroll">
        <Outlet />
      </div>
      <BottomNav />
    </>
  )
}

export default MainLayout
