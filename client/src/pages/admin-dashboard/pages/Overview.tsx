import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Users, 
  Shield, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  MapPin, 
  Clock,
  CheckCircle2,
  XCircle,
  Stethoscope,
  Globe,
  HeartHandshake
} from 'lucide-react';
import { supabase } from '../../../supabaseClient';

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalNGOs: 0,
    totalDoctors: 0,
    totalNeedys: 0,
    activeNeeds: 0,
    availableResources: 0,
    systemHealth: 'NOMINAL',
    syncLatency: '0.02ms'
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [nextUpdate, setNextUpdate] = useState(10);

  const fetchStats = async () => {
    try {
      // In a real app, we'd fetch from Supabase
      // const { count: ngoCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'NGO');
      
      // Simulating for now as requested
      const mockStats = {
        totalNGOs: Math.floor(Math.random() * 50) + 120,
        totalDoctors: Math.floor(Math.random() * 30) + 85,
        totalNeedys: Math.floor(Math.random() * 200) + 1420,
        activeNeeds: Math.floor(Math.random() * 50) + 342,
        availableResources: Math.floor(Math.random() * 100) + 892,
        systemHealth: Math.random() > 0.95 ? 'DEGRADED' : 'NOMINAL',
        syncLatency: (Math.random() * 0.05).toFixed(2) + 'ms'
      };
      
      setStats(mockStats);
      
      const activities = [
        { id: 1, type: 'NGO', message: 'Red Cross added 50 bunk beds', time: '2m ago', icon: Globe, color: 'text-blue-500' },
        { id: 2, type: 'Doctor', message: 'Dr. Jane Smith cleared 5 patients', time: '5m ago', icon: Stethoscope, color: 'text-emerald-500' },
        { id: 3, type: 'Needy', message: 'New urgent need: Medicines in Sector 7', time: '12m ago', icon: HeartHandshake, color: 'text-rose-500' },
        { id: 4, type: 'System', message: 'Node synchronization complete', time: '15m ago', icon: Database, color: 'text-amber-500' },
      ].sort(() => Math.random() - 0.5);

      setRecentActivities(activities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    
    const interval = setInterval(() => {
      fetchStats();
      setNextUpdate(10);
    }, 10000);

    const timer = setInterval(() => {
      setNextUpdate(prev => (prev > 0 ? prev - 1 : 10));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
    })
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black tracking-tight text-slate-900 leading-none">Command Overview</h2>
          <p className="text-slate-500 font-bold mt-4 flex items-center gap-3 tracking-wide">
            <Activity className="text-amber-500 animate-pulse" size={20} />
            Live Global Relief Telemetry
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-2" />
            <span className="text-amber-600 font-black tabular-nums">Next update in {nextUpdate}s</span>
          </p>
        </div>

        <div className="flex gap-4">
          <div className="px-6 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${stats.systemHealth === 'NOMINAL' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'} shadow-[0_0_10px_rgba(16,185,129,0.5)]`} />
            <span className="font-black text-xs uppercase tracking-widest text-slate-400">System Status:</span>
            <span className={`font-black text-sm uppercase tracking-widest ${stats.systemHealth === 'NOMINAL' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {stats.systemHealth}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-[40px] border border-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Registered NGOs', value: stats.totalNGOs, icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
            { label: 'Active Personnel', value: stats.totalDoctors, icon: Stethoscope, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+5%' },
            { label: 'Unfulfilled Needs', value: stats.activeNeeds, icon: HeartHandshake, color: 'text-rose-600', bg: 'bg-rose-50', trend: '-8%' },
            { label: 'Total Resources', value: stats.availableResources, icon: Database, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+18%' }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white border-2 border-slate-100 p-8 rounded-[40px] group transition-all hover:border-amber-500/20 hover:shadow-2xl hover:shadow-slate-200/50 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <stat.icon size={120} />
              </div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
                  <stat.icon size={28} strokeWidth={2.5} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                  <TrendingUp size={14} className={stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'} />
                  <span className={`text-[10px] font-black ${stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>{stat.trend}</span>
                </div>
              </div>

              <div className="mt-8 relative z-10">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums drop-shadow-sm">{stat.value.toLocaleString()}</h3>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-2">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-10">
        <motion.div 
          custom={4} initial="hidden" animate="visible" variants={cardVariants}
          className="lg:col-span-8 bg-white border-2 border-slate-100 rounded-[50px] overflow-hidden p-10 flex flex-col min-h-[500px]"
        >
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Live Mission Log</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Global Events Timeline</p>
            </div>
            <button className="px-6 py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 transition-all border border-slate-200">View Full Log</button>
          </div>

          <div className="flex-1 space-y-4">
            <AnimatePresence mode="popLayout">
              {recentActivities.map((activity, idx) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-6 p-6 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 group relative"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 border-white shadow-lg ${activity.color.replace('text', 'bg').replace('500', '50')} ${activity.color}`}>
                    <activity.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900 font-black text-lg tracking-tight leading-none group-hover:translate-x-1 transition-transform">{activity.message}</p>
                    <div className="flex items-center gap-4 mt-2">
                       <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <Clock size={12} /> {activity.time}
                       </span>
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${activity.color} ${activity.color.replace('text', 'bg').replace('500', '50')} border-current opacity-70`}>
                          {activity.type}
                       </span>
                    </div>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
                    <CheckCircle2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div 
          custom={5} initial="hidden" animate="visible" variants={cardVariants}
          className="lg:col-span-4 space-y-8"
        >
          <div className="bg-slate-900 rounded-[50px] p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <Shield size={140} className="text-amber-500" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-amber-500 mb-6">Master Directives</h3>
            <div className="space-y-6 relative z-10">
              {[
                { label: 'Security Protocols', status: 'ACTIVE', level: 'HIGH' },
                { label: 'Data Encryption', status: 'AES-256', level: 'MAX' },
                { label: 'Neural Link', status: 'NOMINAL', level: 'v2.1' }
              ].map((d, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                  <span className="text-xs font-black uppercase tracking-widest text-white/50">{d.label}</span>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">{d.status}</p>
                    <p className="text-[10px] font-black text-amber-500 tracking-widest mt-0.5">{d.level}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-3xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-amber-500/20">
              System Audit
            </button>
          </div>

          <div className="bg-white border-2 border-slate-100 rounded-[50px] p-10 flex flex-col justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
               <CheckCircle2 size={40} />
            </div>
            <div>
              <h4 className="text-2xl font-black text-slate-900 tracking-tighter">Everything Stable</h4>
              <p className="text-slate-400 text-sm font-medium mt-2">All global nodes are currently reporting within nominal parameters.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
