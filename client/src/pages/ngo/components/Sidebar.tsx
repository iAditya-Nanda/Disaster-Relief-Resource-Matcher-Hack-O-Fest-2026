import React from 'react';
import { 
  LogOut, Package, LayoutDashboard, 
  Users, Settings, ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import ngoIcon from '../../../assets/ngo_icon.png';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { signOut } = useAuthStore();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Control Center' },
    { id: 'inventory', icon: Package, label: 'Supply Chain' },
    { id: 'volunteers', icon: Users, label: 'Field Force' },
    { id: 'settings', icon: Settings, label: 'Configuration' },
  ];

  return (
    <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-gray-100 flex flex-col h-screen sticky top-0 z-50">
      <div className="p-10">
        <div className="flex flex-col gap-6">
          <div className="w-16 h-16 clay-card p-3 bg-teal-50/50 flex items-center justify-center animate-in zoom-in duration-700">
            <img src={ngoIcon} alt="NGO Icon" className="w-10 h-10 object-contain drop-shadow-lg" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tighter text-gray-950 italic">HIMACHAL HUB</h2>
            <p className="text-[10px] font-black text-teal-600 uppercase tracking-[0.3em] mt-1">Disaster Relief Force</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-3 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[20px] text-sm font-black transition-all group ${
              activeTab === item.id
              ? 'clay-card bg-teal-600 text-white border-none'
              : 'text-gray-400 hover:bg-teal-50 hover:text-teal-700'
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-gray-300 group-hover:text-teal-500'} />
            <span className="tracking-tight uppercase text-[11px]">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-8 space-y-6">
        <div className="p-6 bg-gray-50 rounded-[24px] border border-gray-100/50">
           <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={14} className="text-teal-600" />
              <span className="text-[10px] font-black text-gray-950 uppercase tracking-widest">Trust Level 5</span>
           </div>
           <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-4/5 h-full bg-teal-500 rounded-full"></div>
           </div>
        </div>
        
        <button
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-[20px] text-xs font-black text-red-500 hover:bg-red-50 border border-transparent transition-all uppercase tracking-widest"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
};
