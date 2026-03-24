import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  Bell, 
  Search, 
  Menu,
  Zap,
  ArrowRight
} from 'lucide-react';

// Sub-pages
import DashboardHome from './ngo/pages/DashboardHome';
import Inventory from './ngo/pages/Inventory';
import NeedsMap from './ngo/pages/NeedsMap';
import Volunteers from './ngo/pages/Volunteers';
import Settings from './ngo/pages/Settings';

const menuItems = [
  { id: 'dashboard', label: 'Overview', icon: '/icons/NGO/dashboard.png', path: '/ngo' },
  { id: 'inventory', label: 'Aid Stock', icon: '/icons/NGO/inventory.png', path: '/ngo/inventory' },
  { id: 'needs', label: 'Relief Mapper', icon: '/icons/NGO/needs.png', path: '/ngo/needs' },
  { id: 'volunteers', label: 'Responders', icon: '/icons/NGO/volunteers.png', path: '/ngo/volunteers' },
  { id: 'settings', label: 'Settings', icon: '/icons/NGO/settings.png', path: '/ngo/settings' },
];

export default function NgoDashboard() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="h-screen w-screen bg-[#FDFEFE] flex overflow-hidden selection:bg-blue-100 font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 320 : 100 }}
        className="bg-white h-screen flex flex-col relative z-20 shrink-0 transition-all duration-700 border-r border-slate-100 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.05)]"
      >
        <div className="p-8 flex items-center gap-6 overflow-hidden h-32 whitespace-nowrap">
          <div className="w-14 h-14 bg-[#2F5FE3] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 border-2 border-white group overflow-hidden shrink-0">
             <img src="/icons/NGO/logo.png" alt="Sahara" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-700" />
          </div>
          <div className={`flex flex-col transition-opacity duration-700 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-slate-900 text-xl font-black tracking-tight leading-none mb-1">Sahara.</span>
            <span className="text-[9px] font-black text-[#2F5FE3] tracking-widest uppercase opacity-70 italic">Relief Portal</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-4 overflow-y-auto no-scrollbar">
          {menuItems.map(item => {
            const isActive = location.pathname === item.path || (item.id === 'dashboard' && location.pathname === '/ngo/');
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-6 p-4 rounded-[30px] transition-all duration-500 group whitespace-nowrap overflow-hidden relative cursor-pointer ${isActive ? 'bg-white shadow-[0_12px_45px_-12px_rgba(0,0,0,0.08)] border border-slate-50' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activePillBlueV4"
                    className="absolute inset-0 bg-blue-50/50 border-r-4 border-[#2F5FE3] transition-opacity"
                  />
                )}
                <div className={`shrink-0 w-14 h-14 flex items-center justify-center transition-all duration-700 relative z-10 ${isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-105'}`}>
                  <img src={item.icon} alt={item.label} className="w-10 h-10 object-contain transition-all duration-700" />
                </div>
                <div className={`flex flex-col text-left transition-all duration-700 relative z-10 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                  <span className={`font-black text-lg tracking-tight leading-none ${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-900'}`}>{item.label}</span>
                  {isActive && <div className="flex items-center gap-1 mt-1"><div className="w-1 h-1 rounded-full bg-[#2F5FE3]"></div><span className="text-[8px] font-black text-[#2F5FE3] tracking-widest uppercase opacity-70 italic tracking-tighter">Active View</span></div>}
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-8 border-t border-slate-50">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-6 p-4 rounded-[30px] text-slate-400 hover:text-red-500 hover:bg-red-50/50 transition-all overflow-hidden whitespace-nowrap group cursor-pointer"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-slate-50 group-hover:bg-red-100 rounded-[15px] transition-all border border-slate-100 shrink-0">
              <LogOut size={20} />
            </div>
            <span className={`font-black text-sm transition-opacity duration-700 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>Sign out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#F8FAFB]">
        <header className="h-28 flex justify-between items-center px-10 relative z-10 shrink-0">
          <div className="flex items-center gap-8 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-12 h-12 flex items-center justify-center bg-white text-slate-400 hover:text-slate-900 border border-slate-100 rounded-2xl transition-all shadow-xl shadow-slate-200/40 active:scale-95 group"
            >
              <Menu size={20} className="group-hover:rotate-180 transition-transform duration-700" />
            </button>
            
            <div className="relative group max-w-lg w-full hidden sm:block">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-[#2F5FE3] transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search resources, requests, or people..." 
                className="w-full bg-slate-100/30 border border-slate-100 focus:border-blue-200 focus:bg-white focus:ring-[10px] focus:ring-blue-500/5 rounded-full py-4 px-14 text-sm font-semibold transition-all outline-none placeholder:text-slate-200 tracking-tight"
              />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <button className="w-12 h-12 flex items-center justify-center bg-white text-slate-400 hover:text-slate-900 border border-slate-100 rounded-2xl transition-all relative group">
                <Bell size={20} />
                <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform animate-pulse"></div>
              </button>
              <button className="w-12 h-12 flex items-center justify-center bg-white text-slate-400 hover:text-[#2F5FE3] border border-slate-100 rounded-2xl transition-all group">
                <Zap size={20} className="group-hover:fill-blue-600 transition-all" />
              </button>
            </div>
            
            <div className="h-10 w-[1px] bg-slate-100"></div>

            <div className="flex items-center gap-6 group cursor-pointer p-2 pl-6 rounded-full border border-transparent hover:bg-white hover:shadow-lg transition-all duration-700">
              <div className="text-right hidden md:block">
                <p className="text-base font-black text-slate-900 tracking-tight leading-none mb-1">{user?.user_metadata?.full_name || 'Coordinator'}</p>
                <div className="flex items-center justify-end gap-1.5 opacity-60">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2F5FE3]"></div>
                  <p className="text-[8px] text-slate-400 font-bold tracking-widest uppercase italic">Manager</p>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-slate-100 p-1 shadow-md overflow-hidden group-hover:rotate-6 transition-transform duration-700 border-2 border-white relative shrink-0">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                  alt="User" 
                  className="w-full h-full object-cover rounded-xl relative z-10"
                />
              </div>
              <ArrowRight size={16} className="text-slate-100 group-hover:text-slate-300 group-hover:translate-x-2 transition-all mr-4" />
            </div>
          </div>
        </header>

        {/* Dash Content Viewport */}
        <div className="flex-1 overflow-y-auto p-12 pt-4 scroll-smooth no-scrollbar">
          <div className="max-w-[1400px] mx-auto min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6 }}
              >
                <Routes>
                  <Route index element={<DashboardHome />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="needs" element={<NeedsMap />} />
                  <Route path="volunteers" element={<Volunteers />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<DashboardHome />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
