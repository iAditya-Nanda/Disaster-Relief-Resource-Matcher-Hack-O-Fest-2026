import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Search, 
  Filter, 
  MoreVertical, 
  ShieldCheck, 
  Package, 
  Users,
  MapPin,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../../../supabaseClient';

export default function NGOManagement() {
  const [loading, setLoading] = useState(true);
  const [ngos, setNgos] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNGOs = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          volunteers(count),
          resources(count)
        `)
        .eq('role', 'NGO');

      if (error) throw error;
      
      // Add some mock data if empty for demo purposes
      if (!data || data.length === 0) {
        setNgos([
          { id: '1', full_name: 'Red Cross International', username: 'redcross', status: 'verified', resources: [{ count: 156 }], volunteers: [{ count: 42 }], lat_lng: '12.9716, 77.5946' },
          { id: '2', full_name: 'Relief Hub India', username: 'relief_hub', status: 'active', resources: [{ count: 89 }], volunteers: [{ count: 18 }], lat_lng: '19.0760, 72.8777' },
          { id: '3', full_name: 'Global Aid Network', username: 'globalaid', status: 'pending', resources: [{ count: 0 }], volunteers: [{ count: 5 }], lat_lng: '28.6139, 77.2090' },
        ]);
      } else {
        setNgos(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching NGOs:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNGOs();
  }, []);

  const filteredNgos = ngos.filter(ngo => 
    ngo.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ngo.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 leading-none">NGO Network</h2>
          <p className="text-slate-500 font-bold mt-3 tracking-wide">Manage and monitor registered relief organizations</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter NGO database..." 
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
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Organization</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Resources</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Volunteers</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
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
              ) : filteredNgos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-20 text-center">
                    <div className="max-w-xs mx-auto space-y-4">
                       <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                          < Globe size={40} />
                       </div>
                       <p className="font-black text-slate-400 uppercase tracking-widest text-sm">No organizations found</p>
                    </div>
                  </td>
                </tr>
              ) : filteredNgos.map((ngo) => (
                <motion.tr 
                  key={ngo.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group hover:bg-slate-50/80 transition-all"
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm group-hover:scale-110 transition-transform">
                        <Globe size={24} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 tracking-tight leading-none text-lg">
                          {ngo.full_name || 'Unnamed NGO'}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                           @{ngo.username || 'unknown'}
                           <span className="w-1 h-1 bg-slate-300 rounded-full" />
                           ID: {ngo.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      ngo.status === 'verified' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : ngo.status === 'active'
                        ? 'bg-blue-50 text-blue-600 border-blue-100'
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {ngo.status === 'verified' && <ShieldCheck size={12} />}
                      {ngo.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center text-slate-900 font-bold tracking-tight text-lg">
                    {ngo.resources?.[0]?.count || 0}
                    <Package className="inline-block ml-2 text-slate-300 group-hover:text-amber-500 transition-colors" size={16} />
                  </td>
                  <td className="px-10 py-8 text-center text-slate-900 font-bold tracking-tight text-lg">
                    {ngo.volunteers?.[0]?.count || 0}
                    <Users className="inline-block ml-2 text-slate-300 group-hover:text-blue-500 transition-colors" size={16} />
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                      <MapPin size={16} className="text-slate-300" />
                      {ngo.lat_lng ? 'Coordinates Saved' : 'N/A'}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all hover:shadow-lg">
                        <ExternalLink size={18} />
                      </button>
                      <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-amber-500 hover:border-amber-200 transition-all hover:shadow-lg">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
           <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Showing {filteredNgos.length} Organizations
           </p>
           <div className="flex gap-2">
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 disabled:opacity-50" disabled>
                 <ChevronRight className="rotate-180" size={16} />
              </button>
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 disabled:opacity-50" disabled>
                 <ChevronRight size={16} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
