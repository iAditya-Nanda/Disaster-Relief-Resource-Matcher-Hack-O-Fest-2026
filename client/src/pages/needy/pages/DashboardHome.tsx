import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X,
  AlertTriangle,
  Zap,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import ResourceChat from '../components/ResourceChat';
import MedicalChat from '../components/MedicalChat';

// Icon Paths
const resourceIcon = '/icons/needy/resource.png';
const medicalIcon = '/icons/needy/doctor.png';
const ngoIcon = '/icons/needy/ngo.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const HomeSkeleton = () => (
    <div className="h-full flex flex-col gap-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start px-2 mb-4">
            <div className="space-y-6">
                <div className="h-16 w-[450px] bg-slate-500/20 rounded-3xl"></div>
                <div className="h-4 w-[350px] bg-slate-400/20 rounded-full"></div>
            </div>
            <div className="h-16 w-56 bg-slate-500/10 rounded-[28px]"></div>
        </div>

        {/* Action Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[45%]">
            <div className="bg-white p-12 rounded-[45px] border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                   <div className="h-14 w-1/2 bg-slate-500/20 rounded-2xl"></div>
                   <div className="h-4 w-1/3 bg-slate-400/20 rounded-full"></div>
                </div>
                <div className="w-48 h-12 bg-slate-300/20 rounded-full"></div>
            </div>
            <div className="bg-white p-12 rounded-[45px] border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                   <div className="h-14 w-1/2 bg-slate-500/20 rounded-2xl"></div>
                   <div className="h-4 w-1/3 bg-slate-400/20 rounded-full"></div>
                </div>
                <div className="w-48 h-12 bg-slate-300/20 rounded-full"></div>
            </div>
        </div>

        {/* NGO Finder Skeleton */}
        <div className="flex-1 bg-white rounded-[60px] border-8 border-white shadow-2xl bg-slate-500/5 flex items-center p-14 gap-12">
            <div className="w-56 h-56 bg-white/40 rounded-[45px]"></div>
            <div className="flex-1 space-y-6">
               <div className="h-6 w-32 bg-slate-400/30 rounded-full"></div>
               <div className="h-16 w-2/3 bg-slate-500/20 rounded-3xl"></div>
               <div className="h-4 w-1/2 bg-slate-300/30 rounded-full"></div>
            </div>
        </div>
    </div>
);

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'DASHBOARD' | 'CHAT' | 'NGO_FINDER' | 'MEDICAL_CHAT'>('DASHBOARD');
  const [ngos, setNgos] = useState<{id: string, full_name: string, avatar_url?: string}[]>([]);
  const [fetchingNgos, setFetchingNgos] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
        setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const openNgoFinder = async () => {
    setActiveView('NGO_FINDER');
    setFetchingNgos(true);
    try {
      const res = await axios.get(`${API_URL}/api/stats/v1/ngos`);
      setNgos(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingNgos(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden w-full space-y-4 px-2 pb-4">
      <AnimatePresence mode="wait">
        {loading ? (
            <motion.div 
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
            >
                <HomeSkeleton />
            </motion.div>
        ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col gap-6 overflow-hidden min-h-0"
            >
              {/* Dashboard Content */}
              {activeView === 'DASHBOARD' && (
                <motion.div
                  key="dashboard-content"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex flex-col gap-6 w-full h-full pb-10"
                >
                  {/* Header Section */}
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6 px-2">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-[52px] font-black text-slate-900 tracking-[-0.04em] leading-none">
                        Rescue <span className="text-emerald-600 font-black">Overview.</span>
                      </h2>
                      <p className="text-sm font-semibold text-slate-400 leading-relaxed tracking-tight border-l-4 border-emerald-600 pl-6 max-w-xl opacity-70">
                        Live emergency broadcast hub. Initiate protocols for immediate rescue and assistance.
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-100 p-4 rounded-[24px] shadow-sm group self-end md:self-start">
                       <Zap className="text-emerald-500 animate-pulse" size={20} />
                       <p className="text-xs font-black text-emerald-600 tracking-tight">System Status: Active</p>
                    </div>
                  </div>

                  {/* Action Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[45%]">
                      {/* Medical Aid Button */}
                      <motion.button 
                          whileHover={{ y: -8, scale: 1.01 }}
                          onClick={() => setActiveView('MEDICAL_CHAT')}
                          className="w-full group relative bg-white shadow-2xl shadow-slate-200/40 rounded-[45px] p-12 transition-all flex flex-col justify-between overflow-hidden text-left cursor-pointer border border-transparent hover:border-slate-100"
                      >
                          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-50/50 blur-3xl rounded-full group-hover:bg-rose-100/50 transition-all scale-150"></div>

                          <div className="relative z-10 space-y-4">
                              <div className="space-y-1">
                                  <h4 className="text-5xl font-black tracking-tighter leading-none text-slate-900">Medical<br/>Triage</h4>
                              </div>
                              <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-[240px]">AI symptom check and immediate connection to active doctors.</p>
                          </div>

                          <div className="absolute -bottom-10 -right-6 scale-125 z-10 group-hover:scale-135 transition-transform duration-1000">
                              <img src={medicalIcon} alt="Medical Aid" className="w-64 h-64 object-contain drop-shadow-[0_45px_45px_rgba(225,29,72,0.25)]" />
                          </div>

                          <div className="relative z-10 flex items-center gap-3 text-rose-600 font-black text-xs bg-rose-50 w-fit px-8 py-4 rounded-full border border-rose-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                              Consult Doctor <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                      </motion.button>

                      {/* Resource Aid Button */}
                      <motion.button 
                          whileHover={{ y: -8, scale: 1.01 }}
                          onClick={() => setActiveView('CHAT')}
                          className="w-full group relative bg-white shadow-2xl shadow-slate-200/40 rounded-[45px] p-12 transition-all flex flex-col justify-between overflow-hidden text-left cursor-pointer border border-transparent hover:border-slate-100"
                      >
                          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/50 blur-3xl rounded-full group-hover:bg-blue-100/50 transition-all scale-150"></div>

                          <div className="relative z-10 space-y-4">
                              <div className="space-y-1">
                                  <h4 className="text-5xl font-black tracking-tighter leading-none text-slate-900">Resource<br/>Aid</h4>
                              </div>
                              <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-[240px]">Request survival kits, food units, and clean water supplies.</p>
                          </div>

                          <div className="absolute -bottom-10 -right-6 scale-125 z-10 group-hover:scale-135 transition-transform duration-1000">
                              <img src={resourceIcon} alt="Resource Aid" className="w-64 h-64 object-contain drop-shadow-[0_45px_45px_rgba(37,99,235,0.25)]" />
                          </div>

                          <div className="relative z-10 flex items-center gap-3 text-blue-600 font-black text-xs bg-blue-50 w-fit px-8 py-4 rounded-full border border-blue-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                              Request Supplies <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                      </motion.button>
                  </div>

                    {/* NGO Finder Card */}
                  <div className="flex-1 bg-white rounded-[55px] p-14 shadow-2xl shadow-slate-200/30 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group border-2 border-slate-50 cursor-pointer" onClick={openNgoFinder}>
                      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50/50 blur-[100px] rounded-full translate-x-32 -translate-y-32 group-hover:scale-110 transition-transform duration-1000"></div>
                      
                      <div className="relative z-10 flex items-center gap-12 flex-1">
                          <div className="w-56 h-56 flex items-center justify-center pointer-events-none">
                              <img src={ngoIcon} alt="NGO Finder" className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(16,185,129,0.2)]" />
                          </div>
                          <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                                  <h4 className="text-xl font-bold tracking-tight text-emerald-600">NGO Finder</h4>
                              </div>
                              <p className="text-6xl font-black tracking-tighter leading-none text-slate-900">Locate <br/> <span className="text-emerald-500 font-black">Rescue Teams</span></p>
                              <p className="text-slate-400 font-medium text-sm tracking-tight opacity-80 leading-relaxed">Scanning 10km radius for all active humanitarian rescue nodes.</p>
                          </div>
                      </div>

                      <button className="relative z-10 bg-emerald-600 text-white font-black px-16 py-8 rounded-[35px] text-sm tracking-tight shadow-xl shadow-emerald-100 transition-all hover:scale-105 active:scale-95 leading-none cursor-pointer">
                          Find NGO
                      </button>
                  </div>
                </motion.div>
              )}

              {/* Emergency Views (Replacing Modals) */}
              <AnimatePresence mode="wait">
                {activeView === 'NGO_FINDER' && (
                  <motion.div 
                    key="ngo-finder-view"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="flex-1 bg-white border-2 border-emerald-50 w-full rounded-[60px] shadow-[0_32px_128px_rgba(0,0,0,0.05)] relative z-10 overflow-hidden flex flex-col"
                  >
                    <div className="p-8 lg:p-14 flex-1 overflow-y-auto no-scrollbar flex flex-col">
                      <div className="flex justify-between items-start mb-10">
                          <div className="space-y-2 text-left">
                            <h3 className="text-5xl font-black tracking-tighter leading-none text-slate-900">
                              Active <span className="text-emerald-600">Nodes.</span>
                            </h3>
                            <p className="text-sm font-bold text-slate-400 max-w-sm leading-relaxed">
                              Real-time radar of operational NGO teams in your vicinity ready to assist.
                            </p>
                          </div>
                          <button type="button" onClick={() => setActiveView('DASHBOARD')} className="w-12 h-12 bg-slate-50 hover:bg-emerald-50 rounded-2xl flex items-center justify-center text-slate-300 hover:text-emerald-600 transition-all cursor-pointer shadow-sm border border-slate-100">
                            <X size={20}/>
                          </button>
                      </div>

                      {fetchingNgos ? (
                        <div className="flex-1 flex items-center justify-center text-emerald-600 font-black text-xl animate-pulse">Scanning area for humanitarian nodes...</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {ngos.length === 0 ? (
                              <div className="col-span-full h-64 flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[40px]">
                                 <AlertTriangle className="text-slate-200 mb-4" size={40} />
                                 <p className="text-slate-400 font-black">No active NGO nodes detected nearby.</p>
                              </div>
                           ) : (
                             ngos.map(ngo => (
                               <div key={ngo.id} className="bg-emerald-50/30 p-8 rounded-[35px] border-2 border-emerald-50 hover:border-emerald-100 transition-all flex flex-col items-center text-center group cursor-pointer">
                                  <div className="w-24 h-24 bg-white rounded-full p-2 shadow-xl mb-4 group-hover:scale-110 transition-transform">
                                     <img src={ngo.avatar_url || ngoIcon} className="w-full h-full object-contain drop-shadow-md" />
                                  </div>
                                  <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{ngo.full_name || 'Rescue Team'}</h4>
                                  <div className="mt-4 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black tracking-tight">Active Team</div>
                               </div>
                             ))
                           )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeView === 'CHAT' && (
                  <motion.div
                    key="chat-view"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 w-full h-full min-h-0"
                  >
                     <ResourceChat onBack={() => setActiveView('DASHBOARD')} />
                  </motion.div>
                )}
                {activeView === 'MEDICAL_CHAT' && (
                  <motion.div
                    key="medical-chat-view"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 w-full h-full min-h-0"
                  >
                     <MedicalChat onBack={() => setActiveView('DASHBOARD')} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
