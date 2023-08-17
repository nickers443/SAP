import { useEffect, useState } from 'react'

export default function useDeviceType() {
  const [deviceType, setDeviceType] = useState('')

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setDeviceType('Mobile')
      } else if (window.innerWidth <= 1024 && window.innerWidth >= 769) {
        setDeviceType('Tablet')
      } else {
        setDeviceType('Desktop')
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return deviceType
}
