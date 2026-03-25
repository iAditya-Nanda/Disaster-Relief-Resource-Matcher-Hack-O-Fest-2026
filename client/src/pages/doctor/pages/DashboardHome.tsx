import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  ChevronRight, 
  Map, 
  Zap,
  Package,
  Droplets,
  Stethoscope
} from 'lucide-react';
import { CardSkeleton, HeaderSkeleton, TriageItemSkeleton } from '../components/Skeleton';
import { supabase } from '../../../supabaseClient';

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);
  const [stats, setStats] = useState({
    patientQueue: '14',
    medications: '280',
    bloodStock: '32 Units',
    systemStatus: 'ONLINE'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
     try {
       // Fetch latest 3 emergencies
       const { data: latestPatients, error } = await supabase
         .from('needs')
         .select('*, profiles:requester_id(full_name)')
         .eq('category', 'Medical')
         .in('status', ['opened', 'pending', 'in_progress'])
         .order('urgency', { ascending: false })
         .limit(3);
         
       if (!error && latestPatients) {
         setPatients(latestPatients);
         setStats(prev => ({
            ...prev,
            patientQueue: latestPatients.length.toString()
         }));
       }
     } catch (err) {
       console.error(err);
     } finally {
       setLoading(false);
     }
  };

  const statCards = [
    { label: 'Emergency Queue', value: stats.patientQueue, icon: Stethoscope, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Medical Stock', value: stats.medications, icon: Package, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Blood Reserve', value: stats.bloodStock, icon: Droplets, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Network Uptime', value: '100%', icon: Zap, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div 
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-12 pb-20 px-4"
        >
          <HeaderSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
          </div>
          <div className="grid lg:grid-cols-12 gap-10 mt-12">
             <div className="lg:col-span-8 space-y-4">
                {[1,2,3].map(i => <TriageItemSkeleton key={i} />)}
             </div>
             <div className="lg:col-span-4 h-[400px] bg-white border border-slate-200 rounded-[50px] animate-pulse shadow-sm"></div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="content"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12 pb-20 px-2"
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-[64px] font-black text-slate-900 tracking-[-0.04em] leading-none whitespace-nowrap">
                Hospital <span className="text-rose-600">Overview.</span>
              </h2>
              <p className="text-lg font-medium text-slate-400 leading-relaxed tracking-tight border-l-4 border-rose-600 pl-6 max-w-2xl">
                Live medical center for emergency response. Monitor patients coming in, vaccine stock, and urgent alerts.
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-rose-50 border border-rose-100 p-5 rounded-[30px] shadow-sm group">
               <Activity className="text-rose-600 animate-pulse" size={20} />
               <p className="text-xs font-black text-rose-600 tracking-widest uppercase italic">System Status: {stats.systemStatus}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[40px] shadow-[0_12px_45px_-12px_rgba(0,0,0,0.03)] hover:shadow-[0_45px_100px_-20px_rgba(239,68,68,0.08)] transition-all duration-700 flex items-center justify-between group cursor-pointer border border-slate-100 relative overflow-hidden"
              >
                <div className="flex-1 space-y-2 relative z-10">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-rose-600 transition-colors">Live info</span>
                  <p className="text-5xl font-black text-slate-900 tracking-tight leading-none">{stat.value}</p>
                  <h4 className="text-base font-black text-slate-700 tracking-tight leading-none uppercase">{stat.label}</h4>
                </div>
                <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-700 shadow-inner`}>
                  <stat.icon size={28} strokeWidth={2.5} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
               <div className="flex items-center justify-between px-4">
                  <div className="flex flex-col gap-2 relative">
                    <div className="absolute -left-6 top-0 w-1.5 h-full bg-rose-600 rounded-full"></div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight italic">Emergency Queue.</h3>
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Patients waiting for triage checkup</p>
                  </div>
               </div>
               
               <div className="bg-white border border-slate-100 shadow-sm rounded-[50px] p-6 space-y-4">
                  {patients.length === 0 ? (
                     <div className="p-10 text-center flex flex-col items-center justify-center opacity-60">
                        <Activity className="text-slate-300 mb-4" size={40} />
                        <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">Queue Clean</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">No emergency logs available</p>
                     </div>
                  ) : (
                    patients.map((p, i) => (
                      <div key={p.id} className="flex items-center gap-6 p-6 rounded-[35px] hover:bg-rose-50/50 hover:border-rose-100 border border-transparent transition-all group cursor-pointer">
                        <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center shadow-sm group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                          <span className="text-[10px] font-black grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all uppercase">PRTY</span>
                          <span className="text-xl font-black">{p.urgency}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase leading-none">{p.profiles?.full_name || 'Patient'}</h4>
                            <div className="px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full text-[8px] font-black tracking-widest uppercase">{p.urgency > 5 ? 'EMERGENCY' : 'STANDARD'}</div>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Symptom Log | <span className="text-rose-500">{new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></p>
                        </div>
                        <ChevronRight size={24} className="text-slate-100 group-hover:text-rose-600 group-hover:translate-x-2 transition-all"/>
                      </div>
                    ))
                  )}
               </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-900 rounded-[50px] p-10 text-white relative overflow-hidden group shadow-2xl border-4 border-slate-800">
                <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 blur-3xl rounded-full -translate-y-40 translate-x-40 transition-transform duration-1000 group-hover:scale-150"></div>
                <div className="relative z-10 space-y-10">
                   <div className="space-y-4">
                      <div className="w-16 h-16 bg-rose-600 rounded-[20px] shadow-lg shadow-rose-900/50 flex items-center justify-center overflow-hidden">
                         <Map className="text-white group-hover:scale-110 transition-transform" size={32} />
                      </div>
                      <h3 className="text-4xl font-black text-white tracking-tight leading-none uppercase">Health <br/> Mapping.</h3>
                      <p className="text-white/40 text-sm font-bold tracking-tight italic leading-relaxed">Geospatial analysis of epidemiological symptoms in Sector 7.</p>
                   </div>
                   <button className="w-full bg-white text-slate-900 hover:bg-rose-600 hover:text-white py-6 rounded-3xl text-sm font-black tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-4 active:scale-95 group/btn uppercase relative overflow-hidden">
                      Launch Intel Map
                   </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
