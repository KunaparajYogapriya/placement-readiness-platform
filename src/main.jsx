import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ErrorBoundary } from './ErrorBoundary.jsx'

const rootEl = document.getElementById('root')
if (!rootEl) {
  document.body.innerHTML = '<div style="padding:2rem;font-family:sans-serif;"><h1>Error</h1><p>Root element #root not found.</p></div>'
} else {
  try {
    const root = createRoot(rootEl)
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ErrorBoundary>
      </StrictMode>,
    )
  } catch (err) {
    rootEl.innerHTML = `<div style="padding:2rem;font-family:sans-serif;max-width:600px;"><h1>App failed to load</h1><pre style="background:#f5f5f5;padding:1rem;overflow:auto;">${String(err?.message || err)}</pre></div>`
  }
}
