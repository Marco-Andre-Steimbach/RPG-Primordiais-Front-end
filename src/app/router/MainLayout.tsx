import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <>
      <div id="app-scroll">
        <Outlet />
      </div>
    </>
  )
}

export default MainLayout
