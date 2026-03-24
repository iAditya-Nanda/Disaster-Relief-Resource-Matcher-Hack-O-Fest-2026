import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../../supabaseClient';
import { useAuthStore } from '../../../store/authStore';
import axios from 'axios';
import { 
  Activity,
  X,
  Zap,
  Navigation,
  ArrowRight,
  Clock,
  Target
} from 'lucide-react';

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
      setLoading(false);
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
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20 px-4"
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="flex flex-col gap-4 flex-1">
          <h2 className="text-6xl font-black text-slate-900 tracking-[-0.04em] leading-tight">
            Relief Requests.
          </h2>
          <p className="text-lg font-medium text-slate-400 tracking-tight leading-relaxed max-w-xl border-l-4 border-blue-500 pl-6">
            Real-time monitoring of urgent needs from the field. Connect available resources with those who need them most.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-slate-100 shadow-sm overflow-hidden mb-2">
           {['Active Requests', 'History'].map((tab, i) => (
             <button 
               key={tab}
               className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-full transition-all cursor-pointer ${i === 0 ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Needs List - Horizontal Cards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-6">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-4 italic underline decoration-blue-500 decoration-2 underline-offset-4">
              <Activity className="text-blue-500" size={24} />
              Pending Help Requests.
            </h3>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{needs.length} Active</span>
          </div>

          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-3 no-scrollbar">
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : needs.length === 0 ? (
              <div className="p-16 text-center bg-white rounded-[40px] border border-slate-50 shadow-sm flex flex-col items-center">
                <h4 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">All clear.</h4>
                <p className="text-xs font-bold text-slate-400 max-w-xs leading-relaxed mt-2 uppercase tracking-widest opacity-60">No pending help requests at this time.</p>
              </div>
            ) : (
              needs.map(need => (
                <motion.div 
                  key={need.id}
                  onClick={() => findMatches(need)}
                  className={`bg-white group p-6 rounded-[35px] border-2 transition-all cursor-pointer relative overflow-hidden flex items-center gap-6 ${selectedNeed?.id === need.id ? 'border-blue-500 shadow-2xl shadow-blue-500/10 scale-[1.01]' : 'border-transparent shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-slate-100'}`}
                >
                  <div className={`shrink-0 w-16 h-16 rounded-[22px] flex flex-col items-center justify-center transition-all duration-500 ${selectedNeed?.id === need.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-50 text-slate-400 border border-slate-100 shadow-inner group-hover:bg-white group-hover:border-blue-100 group-hover:text-blue-600'}`}>
                    <span className="text-3xl font-black tracking-tighter leading-none">{need.urgency}</span>
                    <span className="text-[6px] font-black uppercase tracking-[0.2em] opacity-60">LEVEL</span>
                  </div>

                  <div className="flex-1 space-y-2 relative z-10">
                    <div className="flex items-center gap-3">
                       <span className={`text-[8px] font-black px-2 py-0.5 rounded-full tracking-widest uppercase border ${selectedNeed?.id === need.id ? 'bg-white/20 border-white/20 text-white' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>PRIORITY</span>
                       <Clock size={10} className="text-slate-300" />
                       <span className="text-[9px] font-bold text-slate-400 italic">{new Date(need.created_at).toLocaleTimeString()}</span>
                    </div>
                    <h4 className={`text-xl font-black tracking-tight leading-none uppercase ${selectedNeed?.id === need.id ? 'text-blue-700' : 'text-slate-900'}`}>{need.title}</h4>
                    <p className="text-[11px] text-slate-400 font-bold italic line-clamp-1">{need.description}</p>
                  </div>

                  <ArrowRight size={24} className={`transition-all ${selectedNeed?.id === need.id ? 'text-blue-600 translate-x-1' : 'text-slate-100 group-hover:text-slate-300'}`} />
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Selected Need Analysis */}
        <div className="space-y-6 sticky top-0 h-fit">
          <div className="flex items-center gap-4 px-6">
            <Target className="text-blue-500" size={24} />
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Resource Matching.</h3>
          </div>

          {!selectedNeed ? (
            <div className="h-[600px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[50px] border border-slate-50 shadow-inner group relative overflow-hidden">
               <Navigation className="text-slate-200 group-hover:text-blue-500 transition-all mb-8 animate-bounce" size={40} />
               <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic mb-2">Find Matches.</h3>
               <p className="text-sm font-bold text-slate-400 max-w-xs tracking-tight opacity-60">Select a help request to find available aid stock from nearby hubs.</p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 rounded-[50px] text-white flex flex-col h-[700px] shadow-2xl shadow-blue-900/15 overflow-hidden border-4 border-white"
            >
              <div className="p-10 pb-6 flex justify-between items-start bg-gradient-to-br from-blue-600 to-blue-700">
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-xl">
                       <Zap size={24} className="fill-blue-600" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-200 mb-1">Matching Analysis</p>
                      <h4 className="text-2xl font-black tracking-tight leading-none uppercase">{selectedNeed.title}</h4>
                    </div>
                 </div>
                 <button onClick={() => setSelectedNeed(null)} className="p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all">
                   <X size={24}/>
                 </button>
              </div>

              <div className="flex-1 p-10 overflow-y-auto no-scrollbar space-y-8">
                 <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                    <p className="text-base font-bold leading-relaxed text-blue-100/90 italic">
                      "{selectedNeed.description}"
                    </p>
                 </div>

                 {matching ? (
                   <div className="flex flex-col items-center gap-6 py-16">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400 animate-pulse">Finding matches...</p>
                   </div>
                 ) : (
                   <div className="space-y-6">
                      <div className="flex items-center justify-between px-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Suggested Supplies</p>
                        <span className="text-[8px] font-black uppercase tracking-widest text-blue-400">Match Rank</span>
                      </div>

                      <div className="space-y-3">
                        {matches.length === 0 ? (
                          <div className="p-10 text-center border-2 border-dashed border-white/5 rounded-3xl opacity-40">
                             <p className="text-[10px] font-black uppercase tracking-widest">No matching stock found</p>
                          </div>
                        ) : (
                          matches.map((match, i) => (
                            <motion.div 
                              key={match.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="bg-white/5 hover:bg-white/10 p-6 rounded-[35px] border border-white/5 hover:border-blue-400/50 transition-all flex items-center gap-6 group cursor-pointer"
                            >
                               <div className="w-14 h-14 rounded-2xl bg-white/5 flex flex-col items-center justify-center text-blue-400 border border-white/5 group-hover:scale-105 transition-all">
                                  <span className="text-2xl font-black leading-none">{match.match_score}</span>
                                  <span className="text-[6px] font-black uppercase tracking-widest mt-1 opacity-60">SCORE</span>
                                </div>
                               <div className="flex-1 space-y-1">
                                  <h5 className="font-black text-lg tracking-tight uppercase leading-none">{match.title}</h5>
                                  <div className="flex items-center gap-3">
                                     <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{(match.distance / 1000).toFixed(1)} KM Away</span>
                                     <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{match.quantity} {match.unit}</span>
                                  </div>
                               </div>
                               <ArrowRight size={20} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                            </motion.div>
                          ))
                        )}
                      </div>
                   </div>
                 )}
              </div>
              
              <div className="p-8 bg-black/20 backdrop-blur-xl border-t border-white/5">
                <button className="w-full bg-white text-blue-600 hover:bg-blue-50 py-6 rounded-full text-base font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 group">
                   Allocate Resources <Zap size={20} className="fill-blue-600" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
