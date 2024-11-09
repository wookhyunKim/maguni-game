import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import IntroMusicContainer from '../IntroMusicContainer.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <IntroMusicContainer>
      <App />
    </IntroMusicContainer>
  </StrictMode>,
)
