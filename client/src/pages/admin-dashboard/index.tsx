import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Overview from './pages/Overview';
import NGOManagement from './pages/NGOManagement';
import DoctorManagement from './pages/DoctorManagement';
import NeedyManagement from './pages/NeedyManagement';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="h-screen w-screen bg-[#f8fafc] flex overflow-hidden selection:bg-amber-100 font-sans">
      <Sidebar isOpen={isSidebarOpen} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#f8fafc]">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Dash Content Viewport */}
        <div className="flex-1 overflow-y-auto p-12 pt-8 scroll-smooth no-scrollbar">
          <div className="max-w-[1400px] mx-auto min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Routes>
                  <Route index element={<Overview />} />
                  <Route path="ngos" element={<NGOManagement />} />
                  <Route path="doctors" element={<DoctorManagement />} />
                  <Route path="needys" element={<NeedyManagement />} />
                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
