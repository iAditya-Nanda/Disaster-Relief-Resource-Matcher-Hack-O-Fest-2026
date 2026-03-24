import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../../store/authStore';
import { 
  Settings as SettingsIcon,
  Shield, 
  MapPin, 
  User, 
  Mail,
  Zap,
  ArrowRight,
  Monitor,
  ChevronRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { HeaderSkeleton } from '../components/Skeleton';

export default function Settings() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const settingsItems = [
    { id: 'profile', label: 'Identity Node.', icon: <User size={20} strokeWidth={2.5}/>, desc: 'Personal hub profile' },
    { id: 'security', label: 'Access Protocol.', icon: <Shield size={20} strokeWidth={2.5}/>, desc: 'Terminal encryption' },
    { id: 'network', label: 'Relief Mesh.', icon: <Monitor size={20} strokeWidth={2.5}/>, desc: 'Network node status' },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-12 pb-20 px-2"
      >
        {loading ? (
          <div className="space-y-12">
            <HeaderSkeleton />
            <div className="grid lg:grid-cols-12 gap-10">
               <div className="lg:col-span-3 space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-50 rounded-[25px] animate-pulse" />)}
               </div>
               <div className="lg:col-span-9 h-[500px] bg-slate-50 rounded-[55px] animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 max-w-2xl">
              <h2 className="text-[64px] font-black text-slate-900 tracking-[-0.04em] leading-none whitespace-nowrap">
                Control <span className="text-blue-600">Panel.</span>
              </h2>
              <p className="text-lg font-medium text-slate-400 tracking-tight leading-relaxed border-l-4 border-blue-600 pl-6 uppercase text-xs italic opacity-80">
                System configuration and node coordinator profile management
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4 space-y-4">
                 {settingsItems.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full group flex items-center justify-between p-8 rounded-[35px] transition-all cursor-pointer relative overflow-hidden border-2 ${activeTab === item.id ? 'bg-slate-900 text-white shadow-2xl scale-[1.02] border-slate-800' : 'bg-white text-slate-400 border-transparent hover:border-blue-50 hover:shadow-xl'}`}
                    >
                       <div className="flex items-center gap-6 relative z-10">
                         <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-500 shadow-xl ${activeTab === item.id ? 'bg-blue-600 text-white rotate-6' : 'bg-slate-50 text-slate-300 group-hover:bg-white group-hover:text-blue-600'}`}>
                            {item.icon}
                         </div>
                         <div className="flex flex-col text-left">
                           <span className={`text-[11px] font-black uppercase tracking-widest ${activeTab === item.id ? 'text-white' : 'text-slate-900'}`}>{item.label}</span>
                           <span className={`text-[9px] font-bold uppercase tracking-widest italic ${activeTab === item.id ? 'text-white/40' : 'text-slate-400'}`}>{item.desc}</span>
                         </div>
                       </div>
                       <ChevronRight size={20} className={`transition-all ${activeTab === item.id ? 'text-blue-500 translate-x-1' : 'text-slate-100 group-hover:text-slate-300'}`} />
                    </button>
                 ))}
              </div>

              <div className="lg:col-span-8 space-y-10">
                 <div className="bg-white p-12 rounded-[60px] border-4 border-white shadow-[0_25px_80px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full translate-x-32 -translate-y-32 opacity-50 blur-3xl"></div>
                    
                    <div className="flex items-center gap-10 mb-16 relative z-10">
                       <div className="w-32 h-32 rounded-[45px] bg-slate-50 p-1 border-4 border-white shadow-2xl overflow-hidden shrink-0 group-hover:rotate-6 transition-transform duration-700">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                            alt="User" 
                            className="w-full h-full object-cover rounded-[40px]"
                          />
                       </div>
                       <div className="space-y-4">
                          <div className="flex items-center gap-3">
                             <div className="flex items-center gap-2 px-5 py-2 bg-blue-50 text-blue-600 rounded-full border border-blue-100 shadow-sm">
                                <Zap size={12} className="fill-blue-600" />
                                <span className="text-[10px] font-black tracking-[0.2em] uppercase italic">Lead Node</span>
                             </div>
                             <div className="flex items-center gap-2 px-5 py-2 bg-slate-50 text-slate-400 rounded-full border border-slate-100">
                                <Activity size={12} />
                                <span className="text-[10px] font-black tracking-[0.2em] uppercase italic">Active Status</span>
                             </div>
                          </div>
                          <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none uppercase italic">{user?.user_metadata?.full_name || 'Coordinator-702'}</h3>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t-2 border-slate-50 pt-12 relative z-10">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-300 tracking-[0.3em] px-8 uppercase italic">Secure Registry</label>
                          <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[35px] border-2 border-transparent hover:border-blue-50 transition-all group/item shadow-inner">
                             <div className="flex items-center gap-5">
                                <div className="p-3 bg-white rounded-2xl text-slate-300 group-hover/item:text-blue-600 shadow-sm transition-colors">
                                   <User size={20} />
                                </div>
                                <span className="text-xs font-black text-slate-900 tracking-widest uppercase italic">{user?.id?.slice(0, 16).toUpperCase()}...</span>
                             </div>
                             <ShieldCheck size={18} className="text-blue-200" />
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-300 tracking-[0.3em] px-8 uppercase italic">Mesh Address</label>
                          <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[35px] border-2 border-transparent hover:border-blue-50 transition-all group/item shadow-inner">
                             <div className="flex items-center gap-5">
                                <div className="p-3 bg-white rounded-2xl text-slate-300 group-hover/item:text-blue-600 shadow-sm transition-colors">
                                   <Mail size={20} />
                                </div>
                                <span className="text-xs font-black text-slate-900 tracking-tight lowercase italic truncate max-w-[150px]">{user?.email}</span>
                             </div>
                             <ShieldCheck size={18} className="text-blue-200" />
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-300 tracking-[0.3em] px-8 uppercase italic">Operation Sector</label>
                          <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[35px] border-2 border-transparent hover:border-blue-50 transition-all group/item shadow-inner">
                             <div className="flex items-center gap-5">
                                <div className="p-3 bg-white rounded-2xl text-slate-300 group-hover/item:text-blue-600 shadow-sm transition-colors">
                                   <MapPin size={20} />
                                </div>
                                <span className="text-xs font-black text-slate-900 tracking-widest uppercase italic">Himalayan Node-04</span>
                             </div>
                             <ShieldCheck size={18} className="text-blue-200" />
                          </div>
                       </div>

                       <div className="flex items-end">
                          <button className="w-full bg-slate-900 hover:bg-blue-600 text-white py-8 rounded-[35px] text-xs font-black uppercase tracking-[0.4em] shadow-2xl transition-all flex items-center justify-center gap-6 active:scale-95 group/btn italic">
                             Sync Terminal <ArrowRight size={22} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                          </button>
                       </div>
                    </div>

                    <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.01] group-hover:opacity-[0.06] transition-all duration-1000 rotate-12 group-hover:rotate-0 pointer-events-none scale-150">
                       <SettingsIcon size={250} strokeWidth={1} />
                    </div>
                 </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
