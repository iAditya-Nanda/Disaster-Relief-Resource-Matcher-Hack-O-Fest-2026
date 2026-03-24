import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import DashboardHome from './pages/DashboardHome';
import Inventory from './pages/Inventory';
import NeedsMap from './pages/NeedsMap';
import Volunteers from './pages/Volunteers';

export default function NgoDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="h-screen w-screen bg-[#edf0f5] flex overflow-hidden selection:bg-blue-100 font-sans">
      <Sidebar isOpen={isSidebarOpen} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#edf0f5]">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Dash Content Viewport */}
        <div className="flex-1 overflow-y-auto p-12 pt-8 scroll-smooth no-scrollbar">
          <div className="max-w-[1400px] mx-auto min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Routes>
                  <Route index element={<DashboardHome />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="needs" element={<NeedsMap />} />
                  <Route path="volunteers" element={<Volunteers />} />
                  <Route path="*" element={<Navigate to="/ngo" replace />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
