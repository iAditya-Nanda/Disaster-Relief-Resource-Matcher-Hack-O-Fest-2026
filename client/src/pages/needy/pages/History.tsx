import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp,
  Clock,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Package,
  Box
} from 'lucide-react';

import { useAuthStore } from '../../../store/authStore';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Skeleton = () => (
    <div className="flex items-center gap-6 p-8 rounded-[35px] border border-slate-200 bg-white animate-pulse relative overflow-hidden mb-4 shadow-sm">
      <div className="w-16 h-16 bg-slate-500/20 rounded-2xl"></div>
      <div className="flex-1 space-y-4">
        <div className="h-6 w-1/2 bg-slate-400/30 rounded-full"></div>
        <div className="h-3 w-1/4 bg-slate-200/40 rounded-full"></div>
      </div>
      <div className="w-14 h-14 bg-slate-100/30 rounded-2xl"></div>
    </div>
);

const HeaderSkeleton = () => (
    <div className="space-y-6 mb-12 animate-pulse px-2">
      <div className="h-16 w-[450px] bg-slate-500/20 rounded-3xl"></div>
      <div className="h-5 w-[350px] bg-slate-400/20 rounded-full"></div>
    </div>
);

export default function History() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const { session, user } = useAuthStore();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const headers: Record<string, string> = {};
        if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
        if (user?.id) headers['x-test-user-id'] = user.id;

        const res = await axios.get(`${API_URL}/api/needs/my`, { headers });
        setHistory(res.data.data || []);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [session]);

  return (
    <div className="h-full flex flex-col overflow-hidden w-full py-6 space-y-8 px-4">
      <AnimatePresence mode="wait">
        {loading ? (
             <motion.div 
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col gap-2"
             >
                <HeaderSkeleton />
                <div className="flex-1 px-4">
                    {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} />)}
                </div>
             </motion.div>
        ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col gap-8 overflow-hidden"
            >
              {/* Header Section */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 px-2">
                <div className="flex flex-col gap-2">
                  <h2 className="text-[52px] font-black text-slate-900 tracking-[-0.04em] leading-none">
                    Rescue <span className="text-emerald-600 font-black">History.</span>
                  </h2>
                  <p className="text-sm font-semibold text-slate-400 leading-relaxed tracking-tight border-l-4 border-emerald-600 pl-6 max-w-xl opacity-70">
                    A streamlined registry of all medical and resource aid engagements.
                  </p>
                </div>
                
                <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-100 p-4 rounded-[24px] shadow-sm self-end md:self-start">
                   <Clock className="text-emerald-500" size={20} />
                   <p className="text-xs font-black text-emerald-600 tracking-tight">System Refreshed: Just now</p>
                </div>
              </div>

              {/* Registry List Only */}
              <div className="flex-1 flex flex-col gap-6 overflow-hidden min-h-0">
                    <div className="flex items-center justify-between px-4">
                      <div className="flex flex-col gap-2 relative">
                        <div className="absolute -left-6 top-0 w-1.5 h-full bg-emerald-600 rounded-full"></div>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Service Log</h3>
                        <p className="text-xs font-semibold text-slate-400 opacity-60">Listing all 10 interactions</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 bg-white border-2 border-slate-50 shadow-2xl shadow-slate-300/10 rounded-[50px] p-8 space-y-4 overflow-y-auto no-scrollbar mb-4">
                       {history.length === 0 ? (
                           <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-20">
                              <Box size={64} className="animate-bounce" />
                              <p className="font-black text-lg tracking-tight">No active signals detected in sector</p>
                           </div>
                       ) : (
                           history.map((item, i) => {
                             const isMedical = item.title?.toLowerCase().includes('medical') || item.title?.toLowerCase().includes('aid') || false;
                             const displayDate = new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                             return (
                             <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                key={item.id} 
                                className="flex items-center gap-8 p-8 rounded-[45px] hover:bg-emerald-50/50 hover:border-emerald-100 border-2 border-transparent transition-all group cursor-default shadow-sm relative overflow-hidden shrink-0"
                             >
                                <div className={`w-16 h-16 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shrink-0 ${isMedical ? 'text-rose-500' : 'text-blue-500'}`}>
                                   {isMedical ? <Stethoscope size={28} /> : <Package size={28}/>}
                                </div>
                                <div className="flex-1 min-w-0">
                                   <div className="flex items-center justify-between gap-4 mb-2">
                                      <div className="flex flex-col">
                                        <h4 className="text-2xl font-black text-slate-900 tracking-tighter truncate group-hover:text-emerald-700 transition-colors uppercase">{item.title}</h4>
                                        <span className={`text-[10px] font-bold tracking-widest uppercase ${isMedical ? 'text-rose-500' : 'text-blue-600'}`}>{isMedical ? 'Medical Aid' : 'Resource Aid'}</span>
                                      </div>
                                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-wide capitalize ${item.status === 'completed' || item.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                        {item.status}
                                      </div>
                                   </div>
                                   <p className="text-xs font-semibold text-slate-400 truncate opacity-60 leading-relaxed capitalize">{item.description}</p>
                                </div>
                                <div className="flex flex-col items-end shrink-0 gap-1 pr-2">
                                   <span className="text-[10px] font-bold text-slate-300 uppercase">{displayDate}</span>
                                   <ChevronRight size={24} className="text-slate-100 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all"/>
                                </div>
                             </motion.div>
                           )})
                       )}
                    </div>
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
