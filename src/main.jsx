import { createRoot } from 'react-dom/client'
import "./assets/styles/global.css"   // ← first, always
import "./assets/styles/button.css"
import "./assets/styles/mealCard.css"
import "./assets/styles/horizontalScroll.css"
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
<AuthProvider>

    <App />
</AuthProvider>
)
