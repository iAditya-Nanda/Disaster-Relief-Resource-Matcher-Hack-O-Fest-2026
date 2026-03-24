import React, { useState } from 'react';
import { Sidebar } from './ngo/components/Sidebar';
import { Bell, Search, Command, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { DashboardHome } from './ngo/pages/DashboardHome';
import { Inventory } from './ngo/pages/Inventory';
import { Volunteers } from './ngo/pages/Volunteers';
import { Settings } from './ngo/pages/Settings';
import { NotificationPopup } from './ngo/components/NotificationPopup';

export default function NgoDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardHome />;
      case 'inventory': return <Inventory />;
      case 'volunteers': return <Volunteers />;
      case 'settings': return <Settings />;
      default: return <DashboardHome />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFF] font-sans text-gray-900 selection:bg-teal-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <NotificationPopup
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
        />

        {/* Modern Premium Header */}
        <header className="h-24 bg-white/40 backdrop-blur-md border-b border-gray-100/50 flex justify-between items-center px-12 shrink-0">
          <div className="flex items-center gap-12 flex-1">
            <div className="relative group max-w-md w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Universal Research Protocol..."
                className="w-full bg-gray-50/50 border border-transparent focus:border-teal-200 focus:bg-white rounded-2xl py-3.5 pl-14 pr-12 text-sm font-medium transition-all outline-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-100 rounded-lg shadow-sm">
                <Command size={10} className="text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase">K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <button className="p-3 text-gray-400 hover:text-gray-950 hover:bg-gray-50 rounded-2xl transition-all">
                <HelpCircle size={20} />
              </button>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-3 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-2xl transition-all relative group"
              >
                <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-teal-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform"></div>
                <Bell size={20} />
              </button>
            </div>

            <div className="h-10 w-[1px] bg-gray-100"></div>

            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right">
                <p className="text-sm font-black text-gray-950 tracking-tight leading-none">{user?.user_metadata?.full_name}</p>
                <p className="text-[10px] text-teal-600 font-black uppercase tracking-[0.1em] mt-1.5 opacity-70">Chief Operations</p>
              </div>
              <div className="w-12 h-12 rounded-[18px] clay-card bg-teal-50 flex items-center justify-center text-sm font-black text-teal-700 border border-teal-100 transition-transform group-hover:scale-105">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col gap-1">
              <h2 className="text-4xl font-black text-gray-950 tracking-tighter italic capitalize">{activeTab.replace('-', ' ')}</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.4em]">Integrated Response Environment</p>
            </div>
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
