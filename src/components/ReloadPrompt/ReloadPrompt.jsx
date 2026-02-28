import { useRegisterSW } from 'virtual:pwa-register/react'

function ReloadPrompt() {
  useRegisterSW({
    onNeedRefresh(updateServiceWorker) {
      updateServiceWorker(true)
    },
  })

  return null
}

export default ReloadPrompt
