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
  ChevronRight,
  ShieldCheck,
  Send,
  Sparkles
} from 'lucide-react';
import { ItemCardSkeleton, MapSkeleton } from '../components/Skeleton';

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
  summary?: string;
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
  const [needChat, setNeedChat] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  
  const { session, user } = useAuthStore();

  useEffect(() => {
    fetchNeeds();
  }, [activeTab]);

  useEffect(() => {
    // Real-time: New Needs Subscription
    const needsChannel = supabase
      .channel('needs-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'needs' }, () => {
        fetchNeeds();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(needsChannel);
    };
  }, [activeTab]);

  useEffect(() => {
    if (!selectedNeed) return;

    // Real-time: Chat Subscription
    const chatChannel = supabase
      .channel(`chat-${selectedNeed.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'need_messages', 
        filter: `need_id=eq.${selectedNeed.id}` 
      }, (payload) => {
        setNeedChat(prev => {
           // Skip if message already exists locally
           if (prev.find(m => m.id === payload.new.id)) return prev;
           return [...prev, payload.new];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [selectedNeed?.id]);

  const fetchNeeds = async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
      if (user?.id) headers['x-test-user-id'] = user.id;

      const res = await axios.get(`${API_URL}/api/needs/my`, { headers });
      
      const filtered = (res.data || []).filter((n: any) => 
        n.category !== 'Medical' && 
        (activeTab === 'active' 
          ? ['pending', 'created', 'opened', 'in_progress'].includes(n.status)
          : ['completed', 'fulfilled', 'closed'].includes(n.status))
      );
      setNeeds(filtered);
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
    setNeedChat([]);
    
    try {
      // 1. Fetch Matches
      const headers: Record<string, string> = {};
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
      if (user?.id) headers['x-test-user-id'] = user.id;

      const res = await axios.get(`${API_URL}/api/matches/need/${need.id}`, { headers });
      setMatches(res.data || []);

      // 2. Fetch Chat History
      const chatRes = await supabase
        .from('need_messages')
        .select('*')
        .eq('need_id', need.id)
        .order('created_at', { ascending: true });
      
      setNeedChat(chatRes.data || []);
    } catch (err) {
      console.error('Error finding matches/chat:', err);
    } finally {
      setMatching(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedNeed || sending) return;

    setSending(true);
    try {
      const { data, error } = await supabase.from('need_messages').insert([{
        need_id: selectedNeed.id,
        sender_id: user?.id || 'bb89335a-ddbb-4030-92e7-6681240c20a8', // POC Fallback
        text: chatInput,
        is_ai: false
      }]).select().single();

      if (error) throw error;
      setChatInput('');
      setNeedChat(prev => [...prev, data]);
    } catch (err) {
      console.error('Message failed:', err);
    } finally {
      setSending(false);
    }
  };

  const handleInitializeDrop = async () => {
    if (!selectedNeed || updating) return;

    setUpdating(true);
    try {
      const headers: Record<string, string> = {};
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
      if (user?.id) headers['x-test-user-id'] = user.id;

      await axios.patch(`${API_URL}/api/needs/${selectedNeed.id}/status`, {
        status: 'in_progress',
        resource_id: selectedMatchId
      }, { headers });
      
      // Update locally
      setSelectedNeed(prev => prev ? { ...prev, status: 'in_progress' } : null);
      fetchNeeds();
    } catch (err) {
      console.error('Drop initialization failed:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleResolveTicket = async () => {
    if (!selectedNeed || updating) return;
    setUpdating(true);
    try {
      const headers: Record<string, string> = {};
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
      if (user?.id) headers['x-test-user-id'] = user.id;

      await axios.patch(`${API_URL}/api/needs/${selectedNeed.id}/status`, {
        status: 'closed'
      }, { headers });
      
      setSelectedNeed(null);
      fetchNeeds();
    } catch (e) {
      console.error('Resolve failed:', e);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key="main-container"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="h-full flex flex-col gap-6 overflow-hidden pr-2"
      >
        {/* TOP BAR / NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-white/40 p-10 rounded-[45px] border border-white shadow-sm backdrop-blur-md">
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <Navigation className="text-white fill-white" size={20} />
                  </div>
                  <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
                    Field <span className="text-blue-600">Ops.</span>
                  </h2>
                </div>
                <p className="text-xs font-black text-slate-400 tracking-[0.3em] uppercase opacity-70 border-l-4 border-blue-600 pl-6">Sector Command Center v4.0</p>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/5 p-1.5 rounded-2xl border border-slate-900/5">
                {[
                  { id: 'active', label: 'Monitor' },
                  { id: 'history', label: 'History' }
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-8 py-3 text-[10px] font-black tracking-widest rounded-xl transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl scale-105' : 'text-slate-400 hover:text-slate-900'}`}
                  >
                    {tab.label.toUpperCase()}
                  </button>
                ))}
            </div>
        </div>

        {/* MAIN WORKSPACE */}
        {loading ? (
          <div className="flex-1 grid lg:grid-cols-[1fr_480px] gap-8 overflow-hidden">
             <div className="space-y-6 overflow-hidden scroll-container px-2">
                {[1,2,3].map(i => <ItemCardSkeleton key={i} />)}
             </div>
             <MapSkeleton />
          </div>
        ) : (
          <div className="flex-1 grid lg:grid-cols-[1fr_480px] gap-8 overflow-hidden min-h-0">
             {/* LEFT: SIGNAL FEED */}
             <div className="flex flex-col gap-6 min-h-0">
                <div className="flex items-center justify-between px-6">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">SIGNAL FEED</h3>
                   </div>
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{needs.length} NODES ONLINE</span>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar pr-2 space-y-4 pb-10">
                   {needs.length === 0 ? (
                     <div className="h-[300px] flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-slate-200 rounded-[40px]">
                        <ShieldCheck size={48} className="mb-4" />
                        <p className="font-black text-xs tracking-widest uppercase">Signal Clear</p>
                     </div>
                   ) : (
                     needs.map((need, i) => (
                        <motion.div
                          key={need.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => findMatches(need)}
                          className={`group p-8 rounded-[40px] border-4 transition-all cursor-pointer relative overflow-hidden flex items-center gap-8 ${selectedNeed?.id === need.id ? 'bg-white border-blue-600 shadow-[0_30px_60px_-15px_rgba(37,99,235,0.15)] z-10 scale-[1.01]' : 'bg-white border-transparent hover:border-slate-100 hover:shadow-xl opacity-80 hover:opacity-100'}`}
                        >
                           <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all ${selectedNeed?.id === need.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                              <span className="text-2xl font-black leading-none">{need.urgency}</span>
                              <span className="text-[7px] font-black uppercase tracking-tighter opacity-60">Level</span>
                           </div>

                           <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                 <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${need.status === 'in_progress' ? 'bg-emerald-100 text-emerald-600' : (need.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600')}`}>{need.status}</span>
                                 <span className="text-[9px] font-bold text-slate-300">{new Date(need.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <h4 className="text-xl font-black text-slate-900 truncate uppercase tracking-tight">{need.title}</h4>
                              <p className="text-xs font-medium text-slate-400 truncate mt-1 opacity-70 italic">
                                {need.summary ? `Summary: ${need.summary}` : `"${need.description}"`}
                              </p>
                           </div>

                           <ChevronRight className={`transition-all duration-500 ${selectedNeed?.id === need.id ? 'text-blue-600 translate-x-2' : 'text-slate-100 group-hover:text-slate-300'}`} size={24} />
                        </motion.div>
                     ))
                   )}
                </div>
             </div>

             {/* RIGHT: COMMAND CONSOLE */}
             <div className="flex flex-col min-h-0 bg-white rounded-[50px] border-2 border-slate-100 shadow-2xl overflow-hidden relative">
                <AnimatePresence mode="wait">
                   {!selectedNeed ? (
                     <motion.div 
                        key="console-empty"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40 bg-slate-50/50"
                     >
                        <Zap className="mb-6 text-slate-200" size={64} />
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Enter Command.</h4>
                        <p className="text-[10px] font-black tracking-widest uppercase mt-2">Awaiting Signal Intersection</p>
                     </motion.div>
                   ) : (
                     <motion.div 
                        key={selectedNeed.id}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col min-h-0"
                     >
                        {/* Define a constant to ensure TS doesn't complain about nullability */}
                        {(() => {
                            const currentNeed = selectedNeed!;
                            return (
                                <>
                                    {/* PANEL HEADER */}
                                    <div className="p-10 bg-slate-900 text-white flex justify-between items-start relative overflow-hidden">
                                       <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full"></div>
                                       <div className="flex items-center gap-6 relative z-10">
                                          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                             <Zap size={24} className="fill-white" />
                                          </div>
                                          <div>
                                             <p className="text-[8px] font-black tracking-[0.4em] text-white/30 uppercase mb-1">Deployment Node</p>
                                             <h4 className="text-2xl font-black tracking-tight uppercase leading-none">{currentNeed.title}</h4>
                                          </div>
                                       </div>
                                       <button onClick={() => setSelectedNeed(null)} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-all relative z-10 group">
                                          <X size={20} className="text-white/40 group-hover:text-white" />
                                       </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto no-scrollbar p-10 space-y-10">
                           <div className="bg-slate-50 p-8 rounded-[35px] border border-slate-100 shadow-inner space-y-4">
                              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Understood Need</p>
                              <p className="text-xl font-black text-slate-900 leading-tight tracking-tight">
                                {currentNeed.summary || "Extracting situational summary..."}
                              </p>
                              <div className="h-0.5 bg-slate-100 w-full rounded-full"></div>
                              <p className="text-xs font-bold text-slate-400 leading-relaxed italic opacity-80">
                                First Signal: "{currentNeed.description}"
                              </p>
                           </div>

                           {/* CHAT LOG */}
                           <div className="space-y-4">
                              <p className="text-[10px] font-black text-slate-300 tracking-widest uppercase px-2">MISSION LOG</p>
                              <div className="space-y-3 max-h-[180px] overflow-y-auto no-scrollbar pr-2">
                                 {needChat.length === 0 ? (
                                   <div className="h-20 flex items-center justify-center border-2 border-dashed border-slate-50 rounded-3xl opacity-30">
                                      <p className="text-[8px] font-black uppercase tracking-widest">No entries documented</p>
                                   </div>
                                 ) : (
                                   needChat.map((msg, i) => (
                                     <div key={i} className={`p-5 rounded-[28px] ${msg.is_ai ? 'bg-blue-50 border border-blue-100' : (msg.sender_id === user?.id ? 'bg-slate-900 text-white ml-8 shadow-lg' : 'bg-slate-50 border border-slate-200 mr-8')}`}>
                                        <div className="flex items-center gap-2 mb-2 opacity-50">
                                           <span className="text-[7px] font-black uppercase tracking-widest">{msg.is_ai ? 'AI' : (msg.sender_id === user?.id ? 'NGO' : 'USER')}</span>
                                           <span className="text-[7px] font-bold">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className={`text-xs font-semibold leading-relaxed ${msg.sender_id === user?.id ? 'text-white' : 'text-slate-600'}`}>{msg.text}</p>
                                     </div>
                                   ))
                                 )}
                              </div>
                              <div className="flex gap-2 bg-slate-50 p-2 rounded-3xl border border-slate-100 mt-4">
                                 <input 
                                   type="text"
                                   value={chatInput}
                                   onChange={(e) => setChatInput(e.target.value)}
                                   onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                   placeholder="Secure response feed..."
                                   className="flex-1 bg-transparent border-none outline-none px-6 text-xs font-black text-slate-700 placeholder:text-slate-300"
                                 />
                                 <button 
                                   onClick={handleSendMessage}
                                   disabled={!chatInput.trim() || sending}
                                   className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-20 shadow-lg transition-all"
                                 >
                                    <Send size={16} />
                                 </button>
                              </div>
                           </div>

                           {/* STOCK NODES */}
                           <div className="space-y-4">
                              <div className="flex items-center justify-between px-2">
                                 <p className="text-[10px] font-black text-slate-300 tracking-widest uppercase">STOCK INTERSECTIONS</p>
                                 <span className="text-[10px] font-black text-blue-600 uppercase">CORE INDEX</span>
                              </div>
                              <div className="grid gap-3">
                                 {matching ? (
                                   <div className="h-40 flex flex-col items-center justify-center opacity-30">
                                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                                      <span className="text-[8px] font-black uppercase tracking-widest">Scanning Networks</span>
                                   </div>
                                 ) : matches.length === 0 ? (
                                   <div className="p-10 text-center border-2 border-dashed border-slate-50 rounded-[40px] opacity-20">
                                      <p className="text-[10px] font-black uppercase">No intersections found</p>
                                   </div>
                                 ) : (
                                   matches.map(match => (
                                     <div 
                                       key={match.id}
                                       onClick={() => setSelectedMatchId(match.id)}
                                       className={`p-6 rounded-[35px] border-2 transition-all cursor-pointer flex items-center gap-6 ${selectedMatchId === match.id ? 'bg-blue-50 border-blue-600 shadow-xl' : 'bg-white border-slate-50 hover:border-slate-100'}`}
                                     >
                                        <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black ${selectedMatchId === match.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-400'}`}>
                                           <span className="text-xl leading-none">{match.match_score}</span>
                                           <span className="text-[6px] uppercase tracking-tighter">INDEX</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                           <h5 className="text-[14px] font-black text-slate-900 uppercase truncate tracking-tight">{match.title}</h5>
                                           <div className="flex items-center gap-4 mt-1 opacity-50">
                                              <div className="flex items-center gap-1">
                                                 <Navigation size={10} className="text-blue-500" />
                                                 <span className="text-[9px] font-bold">{(match.distance / 1000).toFixed(1)}KM</span>
                                              </div>
                                              <div className="flex items-center gap-1">
                                                 <ShieldCheck size={10} className="text-emerald-500" />
                                                 <span className="text-[9px] font-bold">{match.quantity} {match.unit}</span>
                                              </div>
                                           </div>
                                        </div>
                                     </div>
                                   ))
                                 )}
                              </div>
                           </div>
                        </div>

                        {/* MASTER ACTION */}
                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                           {currentNeed.status === 'in_progress' ? (
                             <button
                               onClick={handleResolveTicket}
                               disabled={updating}
                               className="flex-1 h-20 bg-emerald-600 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-4"
                             >
                                {updating ? 'Syncing...' : 'Complete Operation'} <ShieldCheck size={20} />
                             </button>
                           ) : (
                             <button
                               onClick={handleInitializeDrop}
                               disabled={!selectedMatchId || updating}
                               className="flex-1 h-20 bg-blue-600 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-4"
                             >
                                {updating ? 'Initializing...' : 'Commit Resource'} <Zap size={20} className="fill-white" />
                             </button>
                           )}
                           <button onClick={() => setSelectedNeed(null)} className="w-20 h-20 bg-white border-2 border-slate-100 rounded-[28px] flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all shadow-sm">
                              <X size={24} />
                           </button>
                        </div>
                                </>
                            );
                        })()}
                     </motion.div>
                   )}
                </AnimatePresence>
             </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
