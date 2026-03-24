import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Stethoscope,
  Activity,
  ChevronRight
} from 'lucide-react';
import { HeaderSkeleton, PatientLogSkeleton, CardSkeleton } from '../components/Skeleton';

const mockLogs = [
  { id: 1, name: 'Rahul Sharma', symptoms: 'Severe Chest Pain', diagnosis: 'Angina Pectoris', status: 'STABLE', time: '12m ago', location: 'Mandi Sector 7' },
  { id: 2, name: 'Priya Verma', symptoms: 'High Fever & Rashes', diagnosis: 'Suspected Viral Infection', status: 'FULFILLED', time: '45m ago', location: 'Solan Hub' },
  { id: 3, name: 'Amit Negi', symptoms: 'Fracture - Right Arm', diagnosis: 'Radius Fracture', status: 'STABLE', time: '5m ago', location: 'Kullu Relief Camp' },
];

export default function PatientLogs() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
          </div>
          <div className="space-y-4 mt-12">
            {[1, 2, 3, 4].map(i => <PatientLogSkeleton key={i} />)}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-12 pb-20 px-2 font-display"
        >
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="flex flex-col gap-4">

              <h2 className="text-[64px] font-black text-slate-900 tracking-[-0.04em] leading-none whitespace-nowrap">
                Patient <span className="text-rose-600">Records.</span>
              </h2>
              <p className="text-lg font-bold text-slate-400 leading-relaxed tracking-tight border-l-8 border-rose-600 pl-8 uppercase max-w-2xl">
                View all past checkups and medical history.
              </p>
            </div>

            <div className="flex bg-rose-50 p-6 rounded-[35px] border border-rose-100 gap-8 shadow-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 opacity-60 m-0">Archive Integrity</span>
                <span className="text-2xl font-black text-rose-600 m-0 leading-tight tracking-tighter uppercase whitespace-nowrap">98.5% Secure</span>
              </div>
              <Activity className="text-rose-600 opacity-20" size={48} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Total Records', value: '1,280', color: 'text-rose-600', icon: CheckCircle2 },
              { label: 'Recent Checkups', value: '45', color: 'text-slate-900', icon: Calendar },
              { label: 'Unresolved Cases', value: '02', color: 'text-rose-400', icon: XCircle },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm hover:shadow-2xl hover:shadow-rose-100/30 transition-all group flex items-center justify-between"
              >
                <div className="space-y-1">
                  <p className="text-4xl font-black tracking-tighter m-0 leading-none">{stat.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 m-0">{stat.label}</p>
                </div>
                <stat.icon size={32} className={`${stat.color} group-hover:scale-110 transition-transform`} />
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {mockLogs.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-sm hover:shadow-xl hover:shadow-rose-100/30 transition-all group flex items-center gap-8"
              >
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-inner">
                  <Stethoscope size={28} />
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 items-center cursor-default">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 m-0">Patient Identity</p>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight m-0">{log.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 m-0">Main Diagnosis</p>
                    <p className="text-sm font-black text-rose-600 uppercase tracking-tight m-0">{log.diagnosis}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 m-0">Location Node</p>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight m-0 italic">{log.location}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 m-0">Status</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${log.status === 'FULFILLED' ? 'bg-emerald-500' : 'bg-rose-600'}`}></div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-widest m-0">{log.status}</p>
                    </div>
                  </div>
                </div>

                <button className="w-14 h-14 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-sm">
                  <ChevronRight size={20} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
