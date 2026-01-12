import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { MdHome } from 'react-icons/md'
import './bottom-nav.css'

function BottomNav() {
  const navigate = useNavigate()
  const lastScroll = useRef(0)
  const lastDelta = useRef(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const container = document.getElementById('app-scroll')

    function apply(current: number) {
      if (current < lastScroll.current) setVisible(true)
      else if (current > lastScroll.current) setVisible(false)
      lastScroll.current = current
    }

    function onContainerScroll() {
      if (!container) return
      apply(container.scrollTop)
    }

    function onWheel(e: WheelEvent) {
      if (e.deltaY > 0) setVisible(false)
      else if (e.deltaY < 0) setVisible(true)
      lastDelta.current = e.deltaY
    }

    function onTouchMove(e: TouchEvent) {
      const y = e.touches[0].clientY
      if (y > lastDelta.current) setVisible(true)
      else setVisible(false)
      lastDelta.current = y
    }

    if (container) {
      container.addEventListener('scroll', onContainerScroll, { passive: true })
      container.addEventListener('wheel', onWheel, { passive: true })
      container.addEventListener('touchmove', onTouchMove, { passive: true })

      return () => {
        container.removeEventListener('scroll', onContainerScroll)
        container.removeEventListener('wheel', onWheel)
        container.removeEventListener('touchmove', onTouchMove)
      }
    }
  }, [])

  return (
    <nav className={`bottom-nav ${visible ? 'show' : 'hide'}`}>
      <button onClick={() => navigate('/')}>
        <MdHome className="nav-icon" />
      </button>
    </nav>
  )
}

export default BottomNav
