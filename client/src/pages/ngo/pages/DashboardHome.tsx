import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp,
  Search,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { StatCardSkeleton, MapSkeleton } from '../components/Skeleton';

export default function DashboardHome() {
  const [stats] = useState({
    resources: 1240,
    needs: 84,
    matches: 412,
    volunteers: 56,
    grid_integrity: 'Secure'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
        setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const statCards = [
    { label: 'Aid Stock', value: stats.resources, image: '/icons/NGO/inventory.png', trend: 'In Stock', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Needed items', value: stats.needs, image: '/icons/NGO/needs.png', trend: 'Urgent', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Matches made', value: stats.matches, image: '/icons/NGO/dashboard.png', trend: 'Completed', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Volunteers', value: stats.volunteers, image: '/icons/NGO/volunteers.png', trend: 'On Duty', color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key="content"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="space-y-12 pb-20 px-2"
      >
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-[64px] font-black text-slate-900 tracking-[-0.04em] leading-none whitespace-nowrap">
              Logistics <span className="text-blue-600">Hub.</span>
            </h2>
            <p className="text-lg font-medium text-slate-400 leading-relaxed tracking-tight border-l-4 border-blue-600 pl-6 max-w-2xl text-xs opacity-70">
              Real-time monitoring of humanitarian nodes. Track aid stocks and manage help requests globally.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white border border-slate-100 p-5 rounded-[30px] shadow-sm group">
             <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center p-2">
                <img src="/icons/NGO/logo.png" alt="Status" className="w-full h-full object-contain animate-pulse" />
             </div>
             <p className="text-xs font-black text-blue-600 tracking-tight">System Status: {stats.grid_integrity}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
             [1,2,3,4].map(i => <StatCardSkeleton key={i} />)
          ) : (
            statCards.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[45px] shadow-[0_12px_45px_-12px_rgba(0,0,0,0.03)] hover:shadow-[0_45px_100px_-20px_rgba(37,99,235,0.08)] transition-all duration-700 flex items-center justify-between group cursor-pointer border-2 border-transparent hover:border-blue-50 relative overflow-hidden"
              >
                <div className="flex-1 space-y-2 relative z-10">
                  <span className="text-[10px] font-black tracking-tight text-slate-400 group-hover:text-blue-600 transition-colors">Live Info</span>
                  <p className="text-5xl font-black text-slate-900 tracking-tight leading-none">{stat.value}</p>
                  <h4 className="text-base font-black text-slate-700 tracking-tight leading-none">{stat.label}</h4>
                </div>
                <div className={`w-20 h-20 ${stat.bg} rounded-[28px] flex items-center justify-center p-4 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-700 shadow-inner group-hover:shadow-xl`}>
                   <img src={stat.image} alt={stat.label} className="w-full h-full object-contain group-hover:brightness-110" />
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
             <div className="flex flex-col gap-2 relative px-4">
                <div className="absolute -left-2 top-0 w-1.5 h-full bg-blue-600 rounded-full"></div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Relief Mapping.</h3>
                <p className="text-sm font-semibold text-slate-400 tracking-tight leading-none">Live location of active aid nodes</p>
             </div>
             
             {loading ? <MapSkeleton /> : (
               <div className="h-[550px] w-full bg-white rounded-[60px] shadow-2xl overflow-hidden border-8 border-white relative group">
                  <MapContainer 
                    center={[31.1048, 77.1734]} 
                    zoom={8} 
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                  >
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    <Marker position={[31.1048, 77.1734]}>
                      <Popup>Main Center</Popup>
                    </Marker>
                  </MapContainer>
                  <div className="absolute top-8 right-8 z-[1000] flex gap-3">
                     <button className="bg-white/80 backdrop-blur-md p-5 rounded-[25px] border border-white shadow-xl text-slate-400 hover:text-blue-600 transition-all active:scale-90"><Search size={22} /></button>
                     <button className="bg-white/80 backdrop-blur-md p-5 rounded-[25px] border border-white shadow-xl text-slate-400 hover:text-blue-600 transition-all active:scale-90"><MapPin size={22} /></button>
                  </div>
               </div>
             )}
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 rounded-[50px] p-10 text-white relative overflow-hidden group shadow-2xl border-4 border-slate-800">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-3xl rounded-full -translate-y-40 translate-x-40 transition-transform duration-1000 group-hover:scale-150"></div>
              <div className="relative z-10 space-y-10">
                 <div className="space-y-4">
                    <div className="w-20 h-20 bg-blue-600 rounded-[24px] shadow-lg shadow-blue-900/50 flex items-center justify-center p-4">
                       <img src="/icons/NGO/logo.png" alt="Match" className="w-full h-full object-contain invert" />
                    </div>
                    <h3 className="text-4xl font-black text-white tracking-tight leading-none">Smart Intelligence.</h3>
                    <p className="text-white/40 text-sm font-bold tracking-tight leading-relaxed">AI-driven synchronization of aid stock with field-level requirements.</p>
                 </div>
                 <button className="w-full bg-white text-slate-900 hover:bg-blue-600 hover:text-white py-6 rounded-3xl text-sm font-black tracking-tight shadow-xl transition-all flex items-center justify-center gap-4 active:scale-95 group/btn relative overflow-hidden">
                    Begin Auto Sync
                 </button>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[50px] border-2 border-slate-50 shadow-sm space-y-8">
               <div className="flex justify-between items-center px-2">
                 <p className="text-xl font-black text-slate-900 tracking-tight">Operations.</p>
                 <TrendingUp size={24} className="text-blue-600" />
               </div>
               <div className="space-y-4 max-h-[280px] overflow-y-auto no-scrollbar pr-2">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-blue-50 p-6 rounded-[30px] transition-all border border-transparent hover:border-blue-100 bg-slate-50 shadow-inner">
                     <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm p-3">
                           <img src="/icons/NGO/logo.png" alt="Node" className={`w-full h-full object-contain ${i%2 === 0 ? 'opacity-40' : ''}`} />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-slate-900 tracking-tight">Hub Sector-0{i}</span>
                           <span className="text-[10px] font-bold text-slate-400 tracking-tight opacity-60">Status Active</span>
                        </div>
                     </div>
                     <ChevronRight size={20} className="text-slate-100 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
