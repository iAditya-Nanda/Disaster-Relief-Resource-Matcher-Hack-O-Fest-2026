import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartHandshake, 
  Search, 
  Filter, 
  AlertTriangle,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { supabase } from '../../../supabaseClient';

export default function NeedyManagement() {
  const [loading, setLoading] = useState(true);
  const [needys, setNeedys] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNeedys = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          needs(count, urgency, status)
        `)
        .eq('role', 'Needy');

      if (error) throw error;
      
      if (!data || data.length === 0) {
        setNeedys([
          { id: '1', full_name: 'Rahul Sharma', username: 'rahul_s', needs: [{ count: 12, urgency: 8, status: 'pending' }], location: 'Sector 4, Rohini', age: 24 },
          { id: '2', full_name: 'Anita Desai', username: 'anita_d', needs: [{ count: 5, urgency: 4, status: 'matched' }], location: 'Hauz Khas, Delhi', age: 31 },
          { id: '3', full_name: 'Prakash Raj', username: 'praj', needs: [{ count: 2, urgency: 10, status: 'urgent' }], location: 'Okhla, Delhi', age: 45 },
        ]);
      } else {
        setNeedys(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching needys:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNeedys();
  }, []);

  const filteredNeedys = needys.filter(needy => 
    needy.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    needy.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 leading-none">Relief Requestors</h2>
          <p className="text-slate-500 font-bold mt-3 tracking-wide">Track active needs and coordinate emergency assistance</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search requestor database..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 h-14 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all w-full lg:w-80 font-bold text-slate-700"
            />
          </div>
          <button className="h-14 w-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:text-amber-500 hover:bg-slate-50 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white border-2 border-slate-100 rounded-[40px] shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Requestor Profile</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Threat Level</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Active Requests</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Location</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Age / Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1, 2, 3, 4].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-10 py-8">
                       <div className="h-12 bg-slate-100 rounded-2xl w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredNeedys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-20 text-center">
                    <div className="max-w-xs mx-auto space-y-4">
                       <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                          <HeartHandshake size={40} />
                       </div>
                       <p className="font-black text-slate-400 uppercase tracking-widest text-sm">No active requestors in database</p>
                    </div>
                  </td>
                </tr>
              ) : filteredNeedys.map((needy) => {
                const maxUrgency = needy.needs?.reduce((max: number, n: any) => Math.max(max, n.urgency || 0), 0) || 0;
                return (
                <motion.tr 
                  key={needy.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group hover:bg-slate-50/80 transition-all"
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center border border-rose-100 shadow-sm group-hover:scale-110 transition-transform relative">
                        <HeartHandshake size={24} />
                        {maxUrgency > 7 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce shadow-lg shadow-rose-500/50">
                             <ShieldAlert size={10} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 tracking-tight leading-none text-lg">
                          {needy.full_name || 'Anonymous User'}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                           @{needy.username || 'unknown'}
                           <span className="w-1 h-1 bg-slate-300 rounded-full" />
                           NEEDY-ID: {needy.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col gap-1.5 min-w-[120px]">
                      <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-400">
                         <span>Emergency Rank</span>
                         <span className={maxUrgency > 7 ? 'text-rose-600' : 'text-slate-600'}>{maxUrgency}/10</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                         <div 
                          className={`h-full transition-all duration-1000 ${maxUrgency > 7 ? 'bg-rose-500' : maxUrgency > 4 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${maxUrgency * 10}%` }}
                         />
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                     <div className="flex items-center gap-3">
                        <div className="text-slate-900 font-black tracking-tight text-lg tabular-nums">
                          {needy.needs?.[0]?.count || 0}
                        </div>
                        <AlertTriangle size={16} className={needy.needs?.[0]?.count > 5 ? 'text-rose-500 animate-pulse' : 'text-slate-300'} />
                     </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2.5 text-slate-600 font-bold text-sm">
                      <div className="p-2 rounded-lg bg-slate-50 text-slate-400">
                        <MapPin size={14} />
                      </div>
                      <span className="truncate max-w-[150px]">{needy.location || 'Not Disclosed'}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col gap-1">
                       <span className="text-slate-900 font-black text-xs uppercase tracking-widest">{needy.age || '??'} Years</span>
                       <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          <Clock size={10} /> Needs Update
                       </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all hover:shadow-lg shadow-rose-200">
                        Dispatch
                      </button>
                      <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-amber-500 hover:border-amber-200 transition-all hover:shadow-lg">
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
           <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Emergency Queue: {filteredNeedys.length} Profiles
           </p>
           <div className="flex gap-2">
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 opacity-50"><ChevronRight className="rotate-180" size={16} /></button>
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 opacity-50"><ChevronRight size={16} /></button>
           </div>
        </div>
      </div>
    </div>
  );
}
