import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { MarksProvider } from './context/MarksContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
    <MarksProvider>
    <App />
    </MarksProvider>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
