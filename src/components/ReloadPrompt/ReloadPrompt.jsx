import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

function ReloadPrompt() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW()

  useEffect(() => {
    if (needRefresh) {
      updateServiceWorker(true)
    }
  }, [needRefresh])

  return null
}

export default ReloadPrompt
