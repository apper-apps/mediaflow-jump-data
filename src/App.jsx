import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { ToastContainer } from 'react-toastify'

// Layout Components
import Header from '@/components/organisms/Header'
import Sidebar from '@/components/organisms/Sidebar'

// Page Components
import Dashboard from '@/components/pages/Dashboard'
import MediaPlans from '@/components/pages/MediaPlans'
import MediaPlanDetail from '@/components/pages/MediaPlanDetail'
import CompetitorLibrary from '@/components/pages/CompetitorLibrary'
import Audiences from '@/components/pages/Audiences'
import Reports from '@/components/pages/Reports'
import Settings from '@/components/pages/Settings'

// Create a basic store (you may want to expand this later)
const store = configureStore({
  reducer: {
    // Minimal root reducer to prevent "no valid reducer" error
    app: (state = { initialized: true }) => state,
    // Add your reducers here as needed
  },
})

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex h-screen bg-slate-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto p-6">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
<Route path="/media-plans" element={<MediaPlans />} />
                <Route path="/media-plans/:id" element={<MediaPlanDetail />} />
                <Route path="/competitors" element={<CompetitorLibrary />} />
                <Route path="/audiences" element={<Audiences />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="mt-16"
        />
      </Router>
    </Provider>
  )
}

export default App