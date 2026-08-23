import { Routes, Route } from 'react-router-dom'
import MenuPage from './pages/MenuPage'
import ConfirmationPage from './pages/ConfirmationPage'

export default function App() {
  return (
    <Routes>
      <Route path="/menu/:qrToken" element={<MenuPage />} />
      <Route path="/confirmation" element={<ConfirmationPage />} />
    </Routes>
  )
}