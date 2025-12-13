import { useEffect, useState } from 'react'

const useAdBlocker = () => {
  const [adBlocked, setAdBlocked] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const tester = document.createElement('div')
    tester.className = 'adsbox'
    tester.style.position = 'absolute'
    tester.style.height = '1px'
    tester.style.width = '1px'
    tester.style.pointerEvents = 'none'
    tester.style.opacity = '0'
    document.body.appendChild(tester)
    setAdBlocked(tester.offsetHeight === 0)
    document.body.removeChild(tester)
  }, [])

  return adBlocked
}

export default useAdBlocker
