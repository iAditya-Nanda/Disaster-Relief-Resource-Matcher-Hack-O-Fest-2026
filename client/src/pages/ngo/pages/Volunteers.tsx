import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../../supabaseClient';
import { 
  Users, 
  Mail, 
  MapPin, 
  Award,
  Search,
  Zap,
  Phone
} from 'lucide-react';

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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'NGO') // Listing NGO coordinators/volunteers
        .order('full_name', { ascending: true });
      
      if (!error) setVolunteers(data || []);
      setLoading(false);
    }
    fetchVolunteers();
  }, []);

  const filtered = volunteers.filter(v => 
    v.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20 px-4"
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="flex flex-col gap-4 flex-1">
          <h2 className="text-6xl font-black text-slate-900 tracking-[-0.04em] leading-tight uppercase">
            Responders.
          </h2>
          <p className="text-lg font-medium text-slate-400 tracking-tight leading-relaxed max-w-xl border-l-4 border-blue-500 pl-6">
            Network of certified humanitarian responders and coordinators dedicated to the relief mission.
          </p>
        </div>
        
        <div className="relative group w-full md:w-96 mb-2">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
           <input 
             type="text" 
             placeholder="Search by name or email..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-white border border-slate-100 focus:border-blue-200 focus:ring-[8px] focus:ring-blue-500/5 rounded-full py-4 pl-14 pr-6 text-sm font-semibold transition-all outline-none"
           />
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((v, i) => (
            <motion.div 
              key={v.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[45px] p-8 border border-transparent hover:border-blue-100 hover:shadow-2xl transition-all duration-700 relative overflow-hidden group cursor-pointer"
            >
               <div className="flex items-center gap-6 relative z-10">
                 <div className="w-16 h-16 rounded-[22px] bg-slate-100 p-1 border-2 border-white shadow-md overflow-hidden shrink-0 group-hover:rotate-6 transition-transform">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${v.email}`} 
                      alt={v.full_name} 
                      className="w-full h-full object-cover"
                    />
                 </div>
                 <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <span className="text-[8px] font-black uppercase text-blue-600 tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">Verified</span>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">{v.full_name || 'Anonymous'}</h4>
                    <div className="flex items-center gap-1.5 opacity-40">
                       <Mail size={10} />
                       <span className="text-[10px] font-bold tracking-tight">{v.email}</span>
                    </div>
                 </div>
               </div>

               <div className="mt-8 pt-8 border-t border-slate-50 relative z-10 space-y-4">
                  <div className="flex items-center justify-between text-slate-400">
                     <div className="flex items-center gap-3">
                        <MapPin size={14} />
                        <span className="text-xs font-bold">{v.location || 'Regional Hub'}</span>
                     </div>
                     <Award size={16} className="text-blue-500" />
                  </div>
                  <div className="flex gap-2">
                     <button className="flex-1 bg-slate-50 hover:bg-black hover:text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn">
                        <Phone size={12} /> Contact
                     </button>
                     <button className="w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
                        <Zap size={16} />
                     </button>
                  </div>
               </div>

               {/* Absolute Watermark Icon */}
               <div className="absolute right-0 top-0 opacity-[0.03] grayscale transition-opacity p-8 translate-x-10 -translate-y-10 group-hover:opacity-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-1000">
                  <Users size={120} strokeWidth={1} />
               </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
