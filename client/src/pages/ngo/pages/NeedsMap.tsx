import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../supabaseClient';
import { useAuthStore } from '../../../store/authStore';
import axios from 'axios';
import { 
  X,
  Zap,
  Navigation,
  Clock,
  Target,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { HeaderSkeleton, ItemCardSkeleton } from '../components/Skeleton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Need {
  id: string;
  title: string;
  description: string;
  urgency: number;
  category: string;
  location: any;
  status: string;
  created_at: string;
}

interface Match {
  id: string;
  title: string;
  match_score: number;
  distance: number;
  category: string;
  quantity: number;
  unit: string;
}

export default function NeedsMap() {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNeed, setSelectedNeed] = useState<Need | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matching, setMatching] = useState(false);
  
  const { session } = useAuthStore();

  useEffect(() => {
    fetchNeeds();
  }, []);

  const fetchNeeds = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('needs')
        .select('*')
        .eq('status', 'pending')
        .order('urgency', { ascending: false });
      
      if (error) throw error;
      setNeeds(data || []);
    } catch (err) {
      console.error('Error fetching needs:', err);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const findMatches = async (need: Need) => {
    setSelectedNeed(need);
    setMatching(true);
    setMatches([]);
    
    try {
      const res = await axios.get(`${API_URL}/api/matches/need/${need.id}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      setMatches(res.data || []);
    } catch (err) {
      console.error('Error finding matches:', err);
    } finally {
      setMatching(false);
    }
  };

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
            <div className="grid lg:grid-cols-2 gap-12">
               <div className="space-y-6">
                 {[1,2,3,4].map(i => <ItemCardSkeleton key={i} />)}
               </div>
               <div className="bg-slate-50 rounded-[60px] h-[750px] animate-pulse"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
              <div className="flex flex-col gap-4 flex-1">
                <h2 className="text-[64px] font-black text-slate-900 tracking-[-0.04em] leading-none whitespace-nowrap">
                  Need <span className="text-blue-600">Map.</span>
                </h2>
                <p className="text-lg font-medium text-slate-400 tracking-tight leading-relaxed max-w-xl border-l-4 border-blue-600 pl-6 text-xs opacity-80">
                  Real-time monitoring of urgent requests from the field
                </p>
              </div>
              
              <div className="flex items-center gap-2 bg-white p-2 rounded-[25px] border border-slate-100 shadow-sm overflow-hidden mb-2">
                 {['Active Requests', 'History'].map((tab, i) => (
                   <button 
                     key={tab}
                     className={`px-8 py-3 text-[10px] font-black tracking-tight rounded-[20px] transition-all cursor-pointer ${i === 0 ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'}`}
                   >
                     {tab}
                   </button>
                 ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Needs List */}
              <div className="space-y-8">
                <div className="flex items-center justify-between px-4">
                  <div className="flex flex-col gap-2 relative">
                    <div className="absolute -left-6 top-0 w-1.5 h-full bg-blue-600 rounded-full"></div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Pending Help.</h3>
                    <p className="text-sm font-semibold text-slate-400 tracking-tight leading-none">{needs.length} Active Nodes</p>
                  </div>
                </div>

                <div className="space-y-4 max-h-[750px] overflow-y-auto pr-4 no-scrollbar">
                  {needs.length === 0 ? (
                    <div className="p-20 text-center bg-white rounded-[60px] border border-slate-100 shadow-sm flex flex-col items-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mb-6 shadow-inner border border-white">
                        <ShieldCheck className="text-slate-200" size={32} />
                      </div>
                      <h4 className="text-3xl font-black text-slate-900 tracking-tight mb-2">All Clear.</h4>
                      <p className="text-[10px] font-black text-slate-400 max-w-xs leading-relaxed tracking-tight opacity-60">No pending requests in your sector.</p>
                    </div>
                  ) : (
                    needs.map((need, i) => (
                      <motion.div 
                        key={need.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => findMatches(need)}
                        className={`bg-white group p-8 rounded-[45px] border-4 transition-all cursor-pointer relative overflow-hidden flex items-center gap-8 ${selectedNeed?.id === need.id ? 'border-blue-600 shadow-2xl scale-[1.02]' : 'border-transparent shadow-[0_15px_45px_-15px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:border-slate-50'}`}
                      >
                        <div className={`shrink-0 w-20 h-20 rounded-[28px] flex flex-col items-center justify-center transition-all duration-700 ${selectedNeed?.id === need.id ? 'bg-blue-600 text-white shadow-xl rotate-6' : 'bg-slate-50 text-slate-400 border border-slate-100 shadow-inner group-hover:bg-white group-hover:text-blue-600 group-hover:-rotate-3'}`}>
                          <span className="text-4xl font-black tracking-tighter leading-none">{need.urgency}</span>
                          <span className="text-[8px] font-black tracking-tight opacity-60">Level</span>
                        </div>

                        <div className="flex-1 space-y-3 relative z-10">
                          <div className="flex items-center gap-4">
                             <span className={`text-[10px] font-black px-4 py-1.5 rounded-full tracking-tight border-2 ${selectedNeed?.id === need.id ? 'bg-white/20 border-white/20 text-blue-900' : 'bg-blue-50/50 border-blue-100 text-blue-600'}`}>Priority-{need.category}</span>
                             <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                               <Clock size={12}/>
                               <span className="text-[11px] font-black tracking-tight">{new Date(need.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                             </div>
                          </div>
                          <h4 className={`text-2xl font-black tracking-tight leading-none ${selectedNeed?.id === need.id ? 'text-slate-900' : 'text-slate-700'}`}>{need.title}</h4>
                          <p className="text-[12px] text-slate-400 font-bold tracking-tight line-clamp-1 opacity-70">"{need.description}"</p>
                        </div>

                        <ChevronRight size={28} className={`transition-all duration-500 ${selectedNeed?.id === need.id ? 'text-blue-600 translate-x-2' : 'text-slate-100 group-hover:text-slate-300'}`} />
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Matches Analysis */}
              <div className="space-y-8 sticky top-0 h-fit">
                <div className="flex items-center gap-4 px-4">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Match Intelligence.</h3>
                </div>

                <AnimatePresence mode="wait">
                  {!selectedNeed ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="h-[650px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[60px] border-4 border-white shadow-[0_30px_90px_-20px_rgba(0,0,0,0.05)] group relative overflow-hidden"
                    >
                       <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mb-10 shadow-inner group-hover:rotate-12 transition-transform duration-700">
                         <Navigation className="text-blue-600/30 group-hover:text-blue-600 transition-all active:scale-95" size={48} />
                       </div>
                       <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Initialize.</h3>
                       <p className="text-sm font-black text-slate-400 max-w-xs tracking-tight opacity-60 leading-relaxed italic">Select a help request from the map to analyze available aid stock nodes.</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key={selectedNeed.id}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="bg-slate-900 rounded-[60px] text-white flex flex-col h-[750px] shadow-2xl overflow-hidden border-8 border-white"
                    >
                      <div className="p-12 pb-8 flex justify-between items-start bg-gradient-to-br from-blue-700 to-blue-900 relative">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-32 -translate-y-32"></div>
                         <div className="flex items-center gap-6 relative z-10">
                            <div className="w-20 h-20 rounded-[28px] bg-white text-blue-600 flex items-center justify-center shadow-2xl shadow-blue-950/50 scale-110">
                               <Zap size={32} className="fill-blue-600 transition-transform group-hover:scale-125" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black tracking-tight text-blue-200/50">Neural Matcher v1</p>
                              <h4 className="text-3xl font-black tracking-tighter leading-none">{selectedNeed.title}</h4>
                            </div>
                         </div>
                         <button onClick={() => setSelectedNeed(null)} className="w-12 h-12 flex items-center justify-center text-white/30 hover:text-white bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                           <X size={24}/>
                         </button>
                      </div>

                      <div className="flex-1 p-12 overflow-y-auto no-scrollbar space-y-10">
                         <div className="bg-white/5 p-8 rounded-[35px] border border-white/5 shadow-inner">
                            <p className="text-lg font-black leading-relaxed text-blue-50/70 tracking-tight">
                              "{selectedNeed.description}"
                            </p>
                         </div>

                         {matching ? (
                           <div className="flex flex-col items-center gap-10 py-20">
                              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
                              <p className="text-[11px] font-black tracking-tight text-blue-400 animate-pulse">Syncing stock...</p>
                           </div>
                         ) : (
                           <div className="space-y-8">
                              <div className="flex items-center justify-between px-4">
                                <p className="text-[10px] font-black text-white/30">Supplies Catalog</p>
                                <span className="text-[10px] font-black text-blue-400">Core Rank</span>
                              </div>

                              <div className="space-y-4">
                                {matches.length === 0 ? (
                                  <div className="p-16 text-center border-4 border-dashed border-white/5 rounded-[40px] opacity-20">
                                     <p className="text-[11px] font-black tracking-tight">No match stock detected</p>
                                  </div>
                                ) : (
                                  matches.map((match, i) => (
                                    <motion.div 
                                      key={match.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: i * 0.1 }}
                                      className="bg-white/5 hover:bg-white/10 p-8 rounded-[40px] border border-white/5 hover:border-blue-400/50 transition-all flex items-center gap-8 group cursor-pointer relative overflow-hidden"
                                    >
                                       <div className="w-16 h-16 rounded-[22px] bg-slate-800 flex flex-col items-center justify-center text-blue-400 border border-white/5 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                                          <span className="text-3xl font-black leading-none">{match.match_score}</span>
                                          <span className="text-[8px] font-black mt-1 opacity-60">SR</span>
                                        </div>
                                       <div className="flex-1 space-y-2">
                                          <h5 className="font-black text-2xl tracking-tighter leading-none group-hover:translate-x-1 transition-transform">{match.title}</h5>
                                          <div className="flex items-center gap-6">
                                             <div className="flex items-center gap-2">
                                                <Target size={12} className="text-blue-500" />
                                                <span className="text-[11px] font-black text-white/30">{(match.distance / 1000).toFixed(1)} km</span>
                                             </div>
                                             <div className="flex items-center gap-2">
                                                <ShieldCheck size={12} className="text-blue-500" />
                                                <span className="text-[11px] font-black text-white/30">{match.quantity} {match.unit}</span>
                                             </div>
                                          </div>
                                       </div>
                                        <ChevronRight size={24} className="text-blue-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                                    </motion.div>
                                  ))
                                )}
                              </div>
                           </div>
                         )}
                      </div>
                      
                      <div className="p-10 bg-black/40 backdrop-blur-2xl border-t border-white/5 relative z-20">
                        <button className="w-full bg-white text-slate-900 hover:bg-blue-600 hover:text-white py-8 rounded-[35px] text-lg font-black tracking-tight shadow-[0_25px_60px_-15px_rgba(255,255,255,0.1)] transition-all active:scale-95 flex items-center justify-center gap-6 group">
                           Initialize Drop <Zap size={24} className="fill-current" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
