import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../supabaseClient';
import axios from 'axios';
import { 
  Zap, 
  MapPin, 
  HelpCircle, 
  Activity, 
  LayoutDashboard, 
  Package, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Mail,
  X,
  Plus,
  ShieldCheck
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function NeedyDashboard() {
  const { user, signOut, session } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handlePostNeed = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const res = await axios.post(`${API_URL}/api/needs`, {
          title, description, lat, lng
        }, {
           headers: { Authorization: `Bearer ${session?.access_token}` }
        });

        if (res.status === 201) {
          setIsModalOpen(false);
          setTitle('');
          setDescription('');
          window.location.reload(); // Quick refresh
        }
      }, () => {
        alert("Please allow location access to submit a help request.");
        setLoading(false);
      });
    } catch (err: any) {
      console.error('Error posting need:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-rose-500/20">
      {/* Header */}
      <header className="h-24 bg-slate-900/80 backdrop-blur-md border-b border-white/5 flex justify-between items-center px-8 lg:px-16 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-900/30">
            <Zap className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Sahara SOS</h1>
            <p className="text-[10px] text-white/30 font-black tracking-widest mt-1.5 uppercase">Unified Relief Center</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <button onClick={signOut} className="p-3 text-white/40 hover:text-white transition-colors"><X size={24}/></button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 lg:px-16 py-12 space-y-16">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Live Status: Receiving Broadcasts</p>
             </div>
             <h2 className="text-6xl font-black tracking-tighter leading-none mb-4">Hello, <br/> {user?.user_metadata?.full_name?.split(' ')[0]}.</h2>
             <p className="text-xl text-white/40 font-medium max-w-lg">The network is active. We have detected 12 local NGO teams in your sector.</p>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="group relative px-10 py-6 bg-white text-slate-900 font-black uppercase text-sm tracking-[0.3em] rounded-[40px] shadow-2xl shadow-rose-600/10 hover:scale-105 active:scale-95 transition-all overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-24 h-24 bg-rose-600 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity"></div>
             <div className="flex items-center gap-4">
                <Plus size={24} />
                <span>Post Urgent Need</span>
             </div>
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black tracking-wide uppercase text-white/70 flex items-center gap-3">
                   <Clock className="text-rose-500" size={20} />
                   My Active Requests
                </h3>
             </div>

             <div className="grid gap-6">
                {[1, 2].map(i => (
                  <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[40px] hover:bg-white/[0.08] transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-3xl rounded-full translate-x-24 -translate-y-24 group-hover:scale-125 transition-transform duration-700"></div>
                    <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                       <div className="space-y-4">
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-blue-600 px-3 py-1 rounded-full">MATCHED</span>
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">2 hours ago</span>
                          </div>
                          <h4 className="text-3xl font-black uppercase tracking-tight">Winter Gear & Blankets</h4>
                          <p className="text-white/40 font-medium">Our camp in Sector 4 is experiencing severe cold. Need blankets and jackets for 12 children.</p>
                       </div>
                       <div className="flex flex-col justify-between items-end gap-6 shrink-0">
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white/40">
                                <Mail size={20} />
                             </div>
                             <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white/40">
                                <Activity size={20} />
                             </div>
                          </div>
                          <button className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-white/30 group-hover:text-white transition-colors">
                             View Timeline <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="space-y-10">
             <div className="space-y-6">
                <h3 className="text-xl font-black tracking-wide uppercase text-white/70 flex items-center gap-3">
                   <Package className="text-rose-500" size={20} />
                   Local Resource Radar
                </h3>
                <div className="bg-rose-600 rounded-[50px] p-10 text-white shadow-2xl shadow-rose-900/50 space-y-8 relative overflow-hidden group">
                   <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 animate-pulse blur-3xl rounded-full translate-x-32 translate-y-32"></div>
                   <div className="relative z-10">
                      <p className="text-8xl font-black tracking-tighter opacity-20 leading-none absolute -top-4 -left-4">12</p>
                      <div className="relative pt-12">
                         <h4 className="text-3xl font-black uppercase tracking-tight leading-none mb-4">NGOs Ready <br/> to respond.</h4>
                         <p className="text-rose-100/60 text-sm font-bold tracking-wide uppercase">In a 5KM radius of your location.</p>
                      </div>
                   </div>
                   <button className="relative z-10 w-full bg-white text-slate-900 font-black py-4 rounded-3xl text-xs uppercase tracking-[0.3em] shadow-xl transition-all hover:scale-105 active:scale-95">Open Live Map</button>
                </div>
             </div>

             <div className="bg-white/5 border border-white/10 p-10 rounded-[50px] space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/30">System Stats</h3>
                <div className="space-y-8">
                   <div className="flex justify-between items-end">
                      <div className="space-y-1">
                         <p className="text-2xl font-black tracking-tight uppercase">0.4s</p>
                         <p className="text-[10px] font-black uppercase tracking-widest text-white/20">AI LATENCY</p>
                      </div>
                      <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                         <div className="w-full h-full bg-emerald-500 origin-left scale-x-[0.85]"></div>
                      </div>
                   </div>
                   <div className="flex justify-between items-end">
                      <div className="space-y-1">
                         <p className="text-2xl font-black tracking-tight uppercase">Encrypted</p>
                         <p className="text-[10px] font-black uppercase tracking-widest text-white/20">SECURITY TYPE</p>
                      </div>
                      <ShieldCheck className="text-rose-500/50" size={24} />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Post Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 lg:p-12">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            ></motion.div>
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 40 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 40 }}
               className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[60px] shadow-[0_32px_128px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden"
            >
              <form onSubmit={handlePostNeed} className="p-10 lg:p-16 space-y-10">
                <div className="flex justify-between items-start">
                   <div className="space-y-3">
                      <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center">
                         <Zap className="text-white" size={24} />
                      </div>
                      <h3 className="text-3xl font-black tracking-tight uppercase leading-none">Broadcast SOS</h3>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="p-4 bg-white/5 rounded-full hover:bg-white/10 text-white transition-all"><X size={24}/></button>
                </div>

                <div className="space-y-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 px-1">Resource Blueprint (Title)</label>
                      <input 
                        type="text" 
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. URGENT: Food for 10 people" 
                        className="w-full bg-white/5 border border-white/5 focus:border-rose-500/50 focus:bg-white/[0.08] rounded-3xl py-6 px-8 text-xl font-bold transition-all outline-none" 
                      />
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 px-1">Operational Requirements (Description)</label>
                      <textarea 
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Explain the situation in detail..." 
                        rows={4}
                        className="w-full bg-white/5 border border-white/5 focus:border-rose-500/50 focus:bg-white/[0.08] rounded-3xl py-6 px-8 text-lg font-bold transition-all outline-none resize-none" 
                      />
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-white text-slate-900 font-black py-6 rounded-[32px] text-xs uppercase tracking-[0.4em] shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-4"
                >
                  {loading ? 'Transmitting...' : (
                    <>
                      <span>Transmit Signal</span>
                      <TrendingUp size={24} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
