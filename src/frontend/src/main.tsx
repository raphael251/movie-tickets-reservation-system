import { createRoot } from 'react-dom/client'
import Login from './components/Login.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Reservations from './components/Reservations.tsx'
import { PrivateRoute } from './components/PrivateRoute.tsx';
import { AuthProvider } from './components/AuthProvider.tsx';



createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reservations" element={
          <PrivateRoute>
            <Reservations />
          </PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
)
