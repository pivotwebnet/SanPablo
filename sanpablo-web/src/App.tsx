import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import PosPage from './features/pos/pages/PosPage'
import OrdersPage from './features/orders/pages/OrdersPage'

// El dashboard (y Recharts) se cargan aparte: la pantalla POS queda liviana.
const DashboardPage = lazy(() => import('./features/dashboard/pages/DashboardPage'))

export default function App() {
  return (
    <Suspense
      fallback={<div className="grid place-items-center h-screen text-gray-400">Cargando…</div>}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/pos" replace />} />
        <Route path="/pos" element={<PosPage />} />
        <Route path="/historial" element={<OrdersPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Próximas rutas:
            <Route path="/catalogo" element={<CatalogPage />} />
            <Route path="/login" element={<LoginPage />} /> */}
        <Route path="*" element={<Navigate to="/pos" replace />} />
      </Routes>
    </Suspense>
  )
}
