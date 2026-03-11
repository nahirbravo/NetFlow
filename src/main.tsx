import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import { App } from '@/App'
import { useAuthStore } from '@/stores/auth.store'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

// Initialize auth store (restore session + subscribe to changes) before rendering
useAuthStore.getState().initialize().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
})
