import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import DashboardHome from './pages/DashboardHome';
import History from './pages/History';

export default function NeedyDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="h-screen w-screen bg-[#edf0f5] flex overflow-hidden selection:bg-emerald-100 font-sans">
      <Sidebar isOpen={isSidebarOpen} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#edf0f5]">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Dash Content Viewport - Fixed No Scroll */}
        <div className="flex-1 overflow-hidden p-10 pt-6 bg-[#edf0f5]">
          <div className="w-full h-full flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full flex flex-col"
              >
                <Routes>
                  <Route index element={<DashboardHome />} />
                  <Route path="history" element={<History />} />
                  <Route path="*" element={<Navigate to="/needy" replace />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
