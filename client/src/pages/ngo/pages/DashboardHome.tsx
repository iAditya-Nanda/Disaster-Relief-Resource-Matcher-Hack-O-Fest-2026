import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap,
  TrendingUp,
  Shield,
  Layers,
  Search,
  MapPin
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    resources: 0,
    needs: 0,
    matches: 0,
    volunteers: 0,
    grid_integrity: 'SECURE'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await axios.get(`${API_URL}/api/stats/v1/dashboard`);
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching backend stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Aid Stock', value: stats.resources, icon: '/icons/NGO/inventory.png', trend: 'In Stock' },
    { label: 'Active Requests', value: stats.needs, icon: '/icons/NGO/needs.png', trend: 'Urgent' },
    { label: 'Successful Matches', value: stats.matches, icon: '/icons/NGO/dashboard.png', trend: 'Completed' },
    { label: 'Field Responders', value: stats.volunteers, icon: '/icons/NGO/volunteers.png', trend: 'On Duty' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-12 pb-20 px-2"
    >
      {/* Scaled Down Title */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex flex-col gap-4 max-w-xl">
          <h2 className="text-6xl font-black text-slate-900 tracking-[-0.04em] leading-tight">
            Relief Overview.
          </h2>
          <p className="text-lg font-medium text-slate-400 leading-relaxed tracking-tight border-l-4 border-[#2F5FE3] pl-6">
            Real-time logistical overview of disaster relief efforts. Monitor aid distribution and help requests across the region.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-[#2F5FE3]/5 border border-[#2F5FE3]/20 p-5 rounded-[30px] shadow-sm group">
           <Layers className="text-[#2F5FE3] animate-pulse" size={20} />
           <p className="text-xs font-black text-[#2F5FE3] tracking-widest uppercase">System Status: {stats.grid_integrity === 'SECURE' ? 'OPERATIONAL' : stats.grid_integrity}</p>
        </div>
      </div>

      {/* Scaled Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[40px] shadow-[0_12px_45_rgba(0,0,0,0.03)] hover:shadow-[0_45px_100px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 flex items-center justify-between group cursor-pointer border border-slate-50 relative overflow-hidden"
          >
            <div className="flex-1 space-y-2 relative z-10">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-[#2F5FE3] transition-colors">{stat.trend}</span>
              <p className="text-5xl font-black text-slate-900 tracking-tight leading-none">{loading ? '...' : stat.value}</p>
              <h4 className="text-base font-black text-slate-700 tracking-tight leading-none uppercase">{stat.label}</h4>
            </div>
            
            <div className="w-24 h-24 absolute -right-4 top-1/2 -translate-y-1/2 opacity-[0.03] grayscale group-hover:grayscale-0 group-hover:opacity-10 transition-all duration-1000 pointer-events-none">
              <img src={stat.icon} alt={stat.label} className="w-full h-full object-contain" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Relief Map & Operations */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
           <div className="flex flex-col gap-3 px-4 relative">
              <div className="absolute -left-2 top-0 w-1.5 h-12 bg-[#2F5FE3] rounded-full"></div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight italic">Active Relief Hubs.</h3>
              <p className="text-sm font-semibold text-slate-400">Geolocation of active humanitarian centers across relief sectors.</p>
           </div>
           
           <div className="h-[500px] w-full bg-white rounded-[50px] shadow-2xl overflow-hidden border-4 border-white relative group">
              <MapContainer 
                center={[31.1048, 77.1734]} 
                zoom={8} 
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <Marker position={[31.1048, 77.1734]}>
                  <Popup>Main Relief Center</Popup>
                </Marker>
                <Marker position={[32.2190, 76.3234]}>
                  <Popup>Regional Distribution Point</Popup>
                </Marker>
              </MapContainer>
              <div className="absolute top-6 right-6 z-[1000] flex gap-2">
                 <button className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-lg text-slate-400 hover:text-slate-900 transition-all"><Search size={20} /></button>
                 <button className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-lg text-slate-400 hover:text-slate-900 transition-all"><MapPin size={20} /></button>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 tracking-tight px-6 underline decoration-[#2F5FE3] decoration-4 underline-offset-4">Resource Allocation.</h3>
            <div className="bg-gradient-to-br from-[#2F5FE3] to-[#1A3BA3] p-10 rounded-[50px] text-white shadow-2xl shadow-blue-900/10 relative overflow-hidden group border-4 border-white">
              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10 text-[9px] font-black tracking-widest uppercase mb-2">
                    <Shield size={12} className="fill-white" />
                    Verified Hub
                  </div>
                  <h4 className="text-4xl font-black text-white tracking-tight leading-none">Smart Matching.</h4>
                  <p className="text-sm text-white/50 font-bold tracking-tight italic leading-relaxed">Instantly connect regional aid stock with the most urgent disaster needs.</p>
                </div>
                <button className="w-full bg-white text-[#2F5FE3] hover:translate-y-[-3px] py-6 rounded-[30px] text-sm font-black tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-4 active:scale-95 group/btn uppercase">
                  Match Resources <Zap size={20} className="fill-[#2F5FE3]" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[50px] border border-slate-50 shadow-sm space-y-6">
             <div className="flex justify-between items-center px-2">
               <p className="text-xl font-black text-slate-900 tracking-tight italic">Operations Log.</p>
               <TrendingUp size={24} className="text-[#2F5FE3]" />
             </div>
             <div className="space-y-5">
               {[1,2,3].map(i => (
                 <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-3 rounded-2xl transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-[2px] bg-slate-100 group-hover:bg-[#2F5FE3] transition-all duration-500"></div>
                      <span className="text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-all capitalize">Relief Hub #{i}</span>
                   </div>
                   <div className="w-1.5 h-1.5 rounded-full bg-[#2F5FE3]/20 group-hover:bg-[#2F5FE3] transition-all"></div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
