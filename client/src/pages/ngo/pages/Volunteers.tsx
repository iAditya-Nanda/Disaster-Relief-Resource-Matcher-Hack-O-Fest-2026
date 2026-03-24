import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../supabaseClient';
import { 
  Users, 
  Mail, 
  MapPin, 
  Search,
  Zap,
  Phone,
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import { HeaderSkeleton, ItemCardSkeleton } from '../components/Skeleton';

interface Volunteer {
  id: string;
  full_name: string;
  email: string;
  role: string;
  location?: string;
}

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchVolunteers() {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'NGO')
        .order('full_name', { ascending: true });
      
      if (!error) setVolunteers(data || []);
      setTimeout(() => setLoading(false), 900);
    }
    fetchVolunteers();
  }, []);

  const filtered = volunteers.filter(v => 
    v.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => <ItemCardSkeleton key={i} />)}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
              <div className="flex flex-col gap-4 flex-1">
                <h2 className="text-[64px] font-black text-slate-900 tracking-[-0.04em] leading-none whitespace-nowrap">
                  Volunteer <span className="text-blue-600">Force.</span>
                </h2>
                <p className="text-lg font-medium text-slate-400 tracking-tight leading-relaxed max-w-xl border-l-4 border-blue-600 pl-6 text-xs opacity-80">
                  Network of certified humanitarian responders across the region
                </p>
              </div>
              
              <div className="relative group w-full md:w-96 mb-2 border-b-2 border-slate-200 focus-within:border-blue-600 transition-colors pb-2">
                 <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                 <input 
                   type="text" 
                   placeholder="Filter responders..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full bg-transparent pl-8 pr-4 text-xs font-black tracking-tight outline-none placeholder:text-slate-200"
                 />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="p-20 text-center bg-white rounded-[60px] border border-slate-100 shadow-sm flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mb-6 shadow-inner border border-white">
                  <Users className="text-slate-200" size={32} />
                </div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tight mb-2">No Active Force.</h4>
                <p className="text-[10px] font-black text-slate-400 max-w-xs leading-relaxed tracking-tight opacity-60">No responders found matching your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((v, i) => (
                  <motion.div 
                    key={v.id}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-[55px] p-10 border-4 border-transparent hover:border-blue-50 hover:shadow-[0_45px_100px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 relative overflow-hidden group cursor-pointer shadow-[0_15px_45px_-15px_rgba(0,0,0,0.05)]"
                  >
                     <div className="flex items-center gap-8 relative z-10">
                       <div className="w-20 h-20 rounded-[30px] bg-slate-50 p-1 border-2 border-white shadow-xl overflow-hidden shrink-0 group-hover:rotate-6 transition-transform duration-500 scale-110">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${v.email}`} 
                            alt={v.full_name} 
                            className="w-full h-full object-cover rounded-[25px]"
                          />
                       </div>
                       <div className="space-y-2">
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-black text-blue-600 bg-blue-50/50 px-4 py-1 rounded-full border border-blue-100 tracking-tight">Verified</span>
                             <Star size={10} className="text-amber-400 fill-amber-400" />
                          </div>
                          <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-blue-600 transition-colors">{v.full_name || 'Responder'}</h4>
                          <div className="flex items-center gap-2 opacity-50">
                             <Mail size={12} className="text-slate-400" />
                             <span className="text-[11px] font-bold tracking-tight text-slate-500 truncate max-w-[120px]">{v.email}</span>
                          </div>
                       </div>
                     </div>

                     <div className="mt-10 pt-10 border-t border-slate-50 relative z-10 space-y-6">
                        <div className="flex items-center justify-between text-slate-400">
                           <div className="flex items-center gap-3">
                              <MapPin size={14} className="text-blue-600" />
                              <span className="text-xs font-black tracking-tight text-slate-500">{v.location || 'Himalayan Hub'}</span>
                           </div>
                           <ShieldCheck size={20} className="text-blue-500" />
                        </div>
                        
                        <div className="flex gap-4">
                           <button className="flex-1 bg-slate-900 text-white hover:bg-blue-600 py-5 rounded-[22px] text-[11px] font-black tracking-tight transition-all flex items-center justify-center gap-3 group/btn shadow-lg active:scale-95">
                              <Phone size={14} /> Contact
                           </button>
                           <button className="w-14 h-14 bg-blue-50 text-blue-600 flex items-center justify-center rounded-[22px] hover:bg-blue-600 hover:text-white transition-all border border-blue-100 shadow-inner group-hover:rotate-12 active:scale-90">
                              <Zap size={20} className="fill-current" />
                           </button>
                        </div>
                     </div>

                     <div className="absolute right-[-20px] top-[-20px] opacity-[0.01] group-hover:opacity-[0.06] transition-all duration-1000 rotate-12 group-hover:rotate-0 group-hover:scale-110 pointer-events-none">
                       <Users size={240} strokeWidth={1} />
                    </div>
                     
                     <div className="absolute top-8 right-8 text-blue-100/50 group-hover:text-blue-600 transition-colors">
                        <ChevronRight size={24} />
                     </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
