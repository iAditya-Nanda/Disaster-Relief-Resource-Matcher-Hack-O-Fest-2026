import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Search, 
  Filter, 
  MessageSquare,
  Activity,
  User,
  Star,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../../../supabaseClient';

export default function DoctorManagement() {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          medical_consultations!medical_consultations_doctor_id_fkey(count)
        `)
        .eq('role', 'Doctor');

      if (error) throw error;
      
      if (!data || data.length === 0) {
        setDoctors([
          { id: '1', full_name: 'Dr. Sarah Connor', username: 'sarah_med', speciality: 'Trauma Specialist', medical_consultations: [{ count: 124 }], status: 'available', age: 38 },
          { id: '2', full_name: 'Dr. James Wilson', username: 'jwilson', speciality: 'General Physician', medical_consultations: [{ count: 86 }], status: 'busy', age: 45 },
          { id: '3', full_name: 'Dr. Elena Vance', username: 'evance', speciality: 'Psychiatrist', medical_consultations: [{ count: 210 }], status: 'offline', age: 32 },
        ]);
      } else {
        setDoctors(data.map(d => ({ ...d, speciality: 'Medical Professional' })));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor => 
    doctor.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 leading-none">Medical Board</h2>
          <p className="text-slate-500 font-bold mt-3 tracking-wide">Monitor registered medical professionals and consultation volumes</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search medical database..." 
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
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Practitioner</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Speciality</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Live Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Consultations</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Age/ID</th>
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
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-20 text-center">
                    <div className="max-w-xs mx-auto space-y-4">
                       <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                          <Stethoscope size={40} />
                       </div>
                       <p className="font-black text-slate-400 uppercase tracking-widest text-sm">No practitioners found</p>
                    </div>
                  </td>
                </tr>
              ) : filteredDoctors.map((doc) => (
                <motion.tr 
                  key={doc.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group hover:bg-slate-50/80 transition-all"
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-sm group-hover:scale-110 transition-transform relative overflow-hidden">
                        {doc.avatar_url ? (
                          <img src={doc.avatar_url} className="w-full h-full object-cover" />
                        ) : (
                          <User size={24} />
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500/30" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 tracking-tight leading-none text-lg">
                          {doc.full_name || 'Dr. Unknown'}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                           @{doc.username || 'unknown'}
                           <span className="w-1 h-1 bg-slate-300 rounded-full" />
                           MED-ID: {doc.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                          <Activity size={14} />
                       </div>
                       <span className="text-slate-700 font-bold text-sm">{doc.speciality}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] ${
                      doc.status === 'available' ? 'text-emerald-500' : doc.status === 'busy' ? 'text-amber-500' : 'text-slate-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        doc.status === 'available' ? 'bg-emerald-500 animate-pulse' : doc.status === 'busy' ? 'bg-amber-500' : 'bg-slate-300'
                      }`} />
                      {doc.status || 'OFFLINE'}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                     <div className="inline-flex flex-col items-center">
                        <span className="text-slate-900 font-black tracking-tight text-lg">{doc.medical_consultations?.[0]?.count || 0}</span>
                        <div className="flex gap-0.5 mt-0.5">
                           {[1, 2, 3].map(i => <Star key={i} size={8} className="fill-amber-400 text-amber-400" />)}
                           <Star size={8} className="text-slate-200" />
                        </div>
                     </div>
                  </td>
                  <td className="px-10 py-8">
                     <div className="flex items-center gap-3 text-slate-500 font-black text-[10px] uppercase tracking-widest">
                        <Clock size={16} className="text-slate-300" />
                        {doc.age || 'N/A'} Years
                     </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all hover:shadow-lg">
                        <MessageSquare size={18} />
                      </button>
                      <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-amber-500 hover:border-amber-200 transition-all hover:shadow-lg">
                        <ExternalLink size={18} />
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
              Total Board Capacity: {filteredDoctors.length} Practitioners
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
