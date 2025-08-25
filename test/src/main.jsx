import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import DonationTest from './DonationTest.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
  
    <DonationTest />
  </StrictMode>,
)
