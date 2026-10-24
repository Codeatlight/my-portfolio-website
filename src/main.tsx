import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { initSmoothScroll } from './lib/scroll'

// Always open at sunset, even after a reload mid-page
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

initSmoothScroll()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
