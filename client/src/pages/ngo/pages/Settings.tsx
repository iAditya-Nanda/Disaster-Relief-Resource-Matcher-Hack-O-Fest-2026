import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../../store/authStore';
import { 
  Settings as SettingsIcon,
  Shield, 
  MapPin, 
  User, 
  Mail,
  Zap,
  ArrowRight,
  Monitor
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const settingsItems = [
    { id: 'profile', label: 'Profile registry.', icon: <User size={18}/> },
    { id: 'security', label: 'Access protocol.', icon: <Shield size={18}/> },
    { id: 'network', label: 'Relief network.', icon: <Monitor size={18}/> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20 px-4"
    >
      <div className="flex flex-col gap-4 max-w-xl">
        <h2 className="text-6xl font-black text-slate-900 tracking-[-0.04em] leading-tight uppercase">
          Control Panel.
        </h2>
        <p className="text-lg font-medium text-slate-400 leading-relaxed tracking-tight border-l-4 border-blue-500 pl-6">
          System-level configuration and authenticated profile management for the Sahara node coordinator.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3 space-y-4">
           {settingsItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 p-5 rounded-[25px] transition-all cursor-pointer group ${activeTab === item.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                 <div className={`p-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-300'}`}>
                    {item.icon}
                 </div>
                 <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
              </button>
           ))}
        </div>

        <div className="lg:col-span-9 space-y-8">
           <div className="bg-white p-12 rounded-[55px] border border-slate-50 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full translate-x-20 -translate-y-20 opacity-50"></div>
              
              <div className="flex items-center gap-8 mb-12">
                 <div className="w-24 h-24 rounded-[35px] bg-slate-100 p-1 border-4 border-white shadow-2xl relative z-10 overflow-hidden shrink-0 group-hover:rotate-6 transition-transform">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                      alt="User" 
                      className="w-full h-full object-cover rounded-[30px]"
                    />
                 </div>
                 <div className="space-y-2 relative z-10">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">{user?.user_metadata?.full_name || 'Coordinator 702'}</h3>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-2 px-3 py-1 bg-[#2F5FE3]/10 text-[#2F5FE3] rounded-full border border-[#2F5FE3]/20">
                          <Zap size={10} className="fill-blue-500" />
                          <span className="text-[10px] font-black tracking-widest uppercase">Lead NGO</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-10 border-t border-slate-50 pt-10">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-300 tracking-widest px-4 uppercase italic">Registry ID</label>
                    <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 text-slate-400 italic font-bold text-sm">
                       <User size={16} />
                       <span>{user?.id?.slice(0, 16)}...</span>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-300 tracking-widest px-4 uppercase italic">Communications</label>
                    <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 text-slate-400 italic font-bold text-sm">
                       <Mail size={16} />
                       <span>{user?.email}</span>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-300 tracking-widest px-4 uppercase italic">Operation Node</label>
                    <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 text-slate-400 italic font-bold text-sm">
                       <MapPin size={16} />
                       <span>Himachal North Sector 4</span>
                    </div>
                 </div>
                 <div className="flex items-end pt-8">
                    <button className="w-full bg-slate-900 hover:bg-[#2F5FE3] text-white py-6 rounded-3xl text-xs font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-4 group/btn">
                       Update Protocol <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                 </div>
              </div>

              {/* Absolute Watermark Icon */}
              <div className="absolute right-0 bottom-0 opacity-[0.03] grayscale transition-opacity p-8 group-hover:opacity-10 transition-all duration-1000">
                 <SettingsIcon size={160} strokeWidth={1} />
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
