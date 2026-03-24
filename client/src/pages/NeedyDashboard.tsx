import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuthStore } from '../store/authStore';
import { LogOut, BellRing, Navigation, Clock } from 'lucide-react';
import sosIcon from '../assets/sos_icon.png';

interface ActiveRequest {
  id: string;
  title: string;
  description: string;
  urgency: number;
  status: string;
}

export default function NeedyDashboard() {
  const { signOut } = useAuthStore();
  const [activeRequest, setActiveRequest] = useState<ActiveRequest | null>(null);

  useEffect(() => {
    fetchActiveRequests();
  }, []);

  const fetchActiveRequests = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('needs')
      .select('*')
      .eq('requester_id', user.id)
      .limit(1)
      .single();
    
    if (data) setActiveRequest(data as ActiveRequest);
  };

  return (
    <div className="min-h-screen bg-thiings-bg flex flex-col font-sans p-4 md:p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <nav className="glass-panel w-full max-w-4xl mx-auto rounded-full px-6 py-4 flex justify-between items-center mb-10 z-10 relative">
        <h2 className="m-0 text-xl font-heading font-bold text-red-700 tracking-tight">Emergency Portal</h2>
        <button 
          onClick={signOut} 
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <div className="w-full max-w-4xl mx-auto flex-1 z-10 relative">
        <div className="text-center mb-12">
          <img src={sosIcon} alt="SOS Dashboard" className="w-32 h-32 mx-auto drop-shadow-xl mb-4 hover:scale-105 transition-transform" />
          <h1 className="text-5xl font-heading font-extrabold text-gray-900 tracking-tight mb-2">Need Assistance?</h1>
          <p className="text-gray-600 text-lg max-w-lg mx-auto font-medium">Your location is securely tracked to match you with the nearest relief organizations instantly.</p>
        </div>

        <div className="w-full">
          {!activeRequest ? (
            <div className="clay-card text-center py-16 px-6">
              <button className="group inline-flex items-center gap-3 bg-red-500 hover:bg-red-600 outline outline-4 outline-red-500/30 text-white text-2xl font-bold py-6 px-10 rounded-full shadow-[0_20px_40px_rgba(239,68,68,0.4)] inset-shadow-[inset_2px_2px_10px_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all">
                <BellRing size={28} className="group-hover:animate-bounce" /> Broadcast SOS
              </button>
            </div>
          ) : (
            <div className="clay-card bg-orange-50/50 border-orange-200">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold text-red-600 bg-white border border-red-200 mb-4 animate-pulse-ring">
                    Urgency: {activeRequest.urgency}/10
                  </div>
                  <h3 className="text-3xl font-heading font-bold text-orange-900 mb-2">{activeRequest.title}</h3>
                  <p className="text-orange-700 text-lg font-medium">{activeRequest.description}</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-full text-xl font-black text-red-600 shadow-sm border border-orange-100">
                  {activeRequest.status.toUpperCase()}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <button className="flex-1 inline-flex justify-center items-center gap-2 bg-white hover:bg-gray-50 text-red-600 font-bold py-4 px-6 rounded-full transition-colors border border-red-100 shadow-sm">
                  <Clock size={20} /> Request History
                </button>
                <button className="flex-1 inline-flex justify-center items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 font-bold py-4 px-6 rounded-full transition-colors border border-green-200 shadow-sm">
                  <Navigation size={20} /> Track Relief Arrival
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
