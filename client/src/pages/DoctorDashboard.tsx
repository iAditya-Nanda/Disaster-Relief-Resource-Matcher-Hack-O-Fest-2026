import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { LogOut, Activity, Phone, Video, Map } from 'lucide-react';
import doctorIcon from '../assets/doctor_icon.png';

export default function DoctorDashboard() {
  const { signOut } = useAuthStore();
  
  const [patients] = useState([
    { id: 1, name: "Critical Incident A", status: "Waiting", type: "Trauma", time: "2 min ago", risk: 'high' },
    { id: 2, name: "Incident B", status: "In Call", type: "Pediatric", time: "10 min ago", risk: 'med' }
  ]);

  return (
    <div className="min-h-screen bg-thiings-bg flex flex-col font-sans p-4 md:p-8">
      <nav className="glass-panel w-full max-w-7xl mx-auto rounded-full px-6 py-4 flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Activity className="text-blue-600" size={24} />
          <h2 className="m-0 text-xl font-heading font-bold text-blue-900">Command Center</h2>
        </div>
        <button 
          onClick={signOut} 
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <div className="w-full max-w-7xl mx-auto flex-1">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
          <img src={doctorIcon} alt="Medical" className="w-24 h-24 drop-shadow-xl" />
          <div>
            <h1 className="text-4xl font-heading font-extrabold text-slate-800 tracking-tight mb-2">Tele-Triage Queue</h1>
            <p className="text-slate-500 font-medium text-lg">Manage incoming disaster casualties via secure WebRTC rooms.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Patients Column */}
          <div className="lg:col-span-2 clay-card p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Active Waiting Room</h3>
            
            <div className="flex flex-col gap-4">
              {patients.map(p => (
                <div key={p.id} className={`rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:scale-[1.01] ${p.risk === 'high' ? 'bg-red-50 border border-red-200' : 'bg-slate-50 border border-slate-200'}`}>
                  <div>
                    <h4 className={`text-lg font-bold mb-1 ${p.risk === 'high' ? 'text-red-700' : 'text-slate-800'}`}>{p.name}</h4>
                    <span className="text-sm font-medium text-slate-500">{p.type} • {p.time}</span>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 bg-white text-blue-600 font-bold py-3 px-5 rounded-full shadow-sm hover:bg-slate-50 transition-colors">
                      <Phone size={18} /> Base
                    </button>
                    <button className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-full shadow-md shadow-blue-600/30 transition-colors">
                      <Video size={18} /> Triage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Widgets Column */}
          <div className="flex flex-col gap-6">
            <div className="clay-card bg-blue-50 border-blue-100 flex flex-col items-center justify-center py-10 text-center">
              <div className="bg-white p-5 rounded-full text-blue-600 shadow-sm mb-4">
                <Map size={32} />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Regional Heatmap</h3>
              <p className="text-blue-700/80 font-medium">Live cluster anomalies detected in Shimla district.</p>
            </div>

            <div className="clay-card bg-green-50 border-green-100 flex flex-col items-center justify-center py-10 text-center">
              <h1 className="text-7xl font-heading font-black text-green-700 mb-2 drop-shadow-sm">14</h1>
              <p className="text-green-800 font-bold text-lg uppercase tracking-wide">Blood Donors Local</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
