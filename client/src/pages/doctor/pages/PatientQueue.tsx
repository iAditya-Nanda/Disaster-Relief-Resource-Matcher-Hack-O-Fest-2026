import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronRight, 
  Clock, 
  User, 
  Activity,
  Video
} from 'lucide-react';
import { HeaderSkeleton, TriageItemSkeleton } from '../components/Skeleton';
import { supabase } from '../../../supabaseClient';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../../../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface PatientNeed {
  id: string;
  title: string;
  description: string;
  urgency: number;
  category: string;
  status: string;
  created_at: string;
  requester_id: string;
  profiles: {
    full_name: string;
    age?: number;
  }
}

export default function PatientQueue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<PatientNeed[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientNeed | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [sending, setSending] = useState(false);
  
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    socketRef.current = io(API_URL);
    if (user?.id) {
        socketRef.current.emit('join_personal', user.id);
    }
    fetchPatients();

    return () => {
       socketRef.current?.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!selectedPatient?.id) return;

    const channel = supabase
      .channel(`doctor-chat-${selectedPatient.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'need_messages', 
        filter: `need_id=eq.${selectedPatient.id}` 
      }, (payload) => {
        setMessages(prev => {
          if (prev.find(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedPatient?.id]);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('needs')
        .select(`*, profiles:requester_id (full_name, age)`)
        .eq('category', 'Medical')
        .in('status', ['opened', 'pending', 'in_progress'])
        .order('urgency', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChat = async (patient: PatientNeed) => {
    setSelectedPatient(patient);
    setMessages([]);
    try {
      const { data, error } = await supabase
        .from('need_messages')
        .select('*')
        .eq('need_id', patient.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedPatient || !user || sending) return;

    setSending(true);
    try {
      const { error } = await supabase.from('need_messages').insert([{
        need_id: selectedPatient.id,
        sender_id: user.id,
        text: chatInput,
        is_ai: false
      }]);

      if (error) throw error;
      setChatInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleVideoCall = (targetUserId: string) => {
     // Notify the user about video offer
     socketRef.current?.emit('video_offer', {
        targetUserId,
        offer: { type: 'offer', sdp: 'GENERIC_RTC_SIGNAL' } 
     });
     alert('Video consultation signal transmitted to patient device!');
  };

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div 
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-10 pb-20 px-4"
        >
          <HeaderSkeleton />
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => <TriageItemSkeleton key={i} />)}
          </div>
        </motion.div>
      ) : selectedPatient ? (
        <motion.div 
          key="chat-view"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="h-full flex flex-col gap-6"
        >
           <button 
             onClick={() => setSelectedPatient(null)}
             className="flex items-center gap-3 text-slate-400 hover:text-rose-600 transition-colors uppercase text-[10px] font-black tracking-widest bg-white w-fit px-8 py-4 rounded-full shadow-sm border border-slate-100 mb-4"
           >
             <ChevronRight className="rotate-180" size={14} /> Back to Emergency Queue
           </button>

           <div className="flex-1 bg-white border-2 border-slate-50 shadow-2xl rounded-[50px] p-10 flex flex-col gap-8 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
                       <Activity size={32}/>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase italic">{selectedPatient.profiles?.full_name || 'Patient'}</h3>
                      <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest leading-none">Status: {selectedPatient.status} | Urgency: {selectedPatient.urgency}</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => handleVideoCall(selectedPatient.requester_id)}
                      className="px-8 py-4 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100 flex items-center gap-2"
                    >
                       <Video size={16}/> Start Video
                    </button>
                    <div className="px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-xl">
                       Active Consultation
                    </div>
                 </div>
              </div>

              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto no-scrollbar space-y-6 pr-4"
              >
                 {messages.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
                      <p className="text-sm font-black uppercase tracking-widest">Awaiting intake record history...</p>
                   </div>
                 ) : (
                   messages.map((msg, idx) => (
                     <div key={idx} className={`flex flex-col ${msg.sender_id === user?.id ? 'items-end' : 'items-start'} gap-2`}>
                        <div className={`max-w-[80%] p-6 rounded-[32px] ${msg.is_ai ? 'bg-blue-50 text-blue-900 border border-blue-100' : (msg.sender_id === user?.id ? 'bg-rose-600 text-white shadow-xl shadow-rose-200' : 'bg-slate-50 text-slate-800 border border-slate-100')}`}>
                           <div className="flex items-center gap-2 mb-2 opacity-50 text-[8px] font-black uppercase tracking-widest">
                                 {msg.is_ai ? 'Triage AI' : (msg.sender_id === user?.id ? 'Dr. ' + (user?.full_name || 'Medical Officer') : 'Patient')}
                           </div>
                           <p className="text-[13px] font-medium leading-relaxed">{msg.text}</p>
                        </div>
                        <span className="text-[8px] font-bold text-slate-300 px-4">
                           {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                     </div>
                   ))
                 )}
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-4">
                 <div className="flex-1 relative">
                    <input 
                       type="text"
                       value={chatInput}
                       onChange={(e) => setChatInput(e.target.value)}
                       onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                       placeholder="Enter clinical assessment or patient advice..."
                       className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-[28px] px-8 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-rose-500 outline-none transition-all shadow-inner"
                    />
                 </div>
                 <button 
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || sending}
                    className="h-16 px-10 rounded-[28px] bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-20"
                 >
                    {sending ? 'Processing...' : 'Secure Send'} <ChevronRight size={14} strokeWidth={3} />
                 </button>
              </div>
           </div>
        </motion.div>
      ) : (
        <motion.div 
          key="content"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-10 pb-20 px-2"
        >
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div className="space-y-2">
              <h2 className="text-[64px] font-black text-slate-900 tracking-[-0.04em] leading-none whitespace-nowrap">
                Emergency <span className="text-rose-600">Queue.</span>
              </h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest border-l-4 border-rose-600 pl-4 mt-2">Live Patient Intake Command</p>
            </div>
            
            <div className="flex gap-4">
              <div className="relative border-b-2 border-rose-100 focus-within:border-rose-600 transition-colors pb-2">
                 <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                 <input 
                   type="text" 
                   placeholder="Filter by name..."
                   className="pl-8 bg-transparent text-xs font-bold outline-none w-48 uppercase tracking-widest"
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2 h-[600px] no-scrollbar">
            {patients.length === 0 ? (
               <div className="p-16 text-center bg-white border border-slate-100 rounded-[40px] shadow-sm flex flex-col items-center">
                  <Activity size={48} className="text-slate-200 mb-6" />
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">No Active Emergencies</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">The queue is completely clear.</p>
               </div>
            ) : (
               patients.filter(p => p.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.title.toLowerCase().includes(searchTerm.toLowerCase())).map((patient, i) => {
              const urgencyLabel = patient.urgency >= 8 ? 'CRITICAL' : patient.urgency >= 5 ? 'MODERATE' : 'STABLE';
              
              return (
              <motion.div 
                key={patient.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-sm hover:shadow-xl hover:shadow-rose-100/30 transition-all group flex flex-col md:flex-row items-start md:items-center gap-8 relative overflow-hidden"
              >
                 <div className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center shadow-inner relative z-10 transition-all duration-700 shrink-0 ${urgencyLabel === 'CRITICAL' ? 'bg-rose-600 text-white rotate-6' : 'bg-slate-50 text-slate-400 group-hover:bg-rose-50'}`}>
                    <Activity size={32} strokeWidth={2.5} className={urgencyLabel === 'CRITICAL' ? 'animate-pulse' : ''}/>
                 </div>

                 <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                       <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none italic group-hover:text-rose-600 transition-colors">{patient.profiles?.full_name || 'Unknown Patient'}</h3>
                       <div className={`px-4 py-1 rounded-full text-[8px] font-black tracking-widest uppercase border-2 ${urgencyLabel === 'CRITICAL' ? 'bg-rose-600 text-white border-rose-600 shadow-lg' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                          {urgencyLabel} ({patient.urgency})
                       </div>
                    </div>
                    <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic opacity-60">
                       <span className="flex items-center gap-1.5"><Clock size={12}/> {new Date(patient.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                       <span className="flex items-center gap-1.5"><User size={12}/> Age: {patient.profiles?.age || 'N/A'}</span>
                    </div>
                    <p className="text-sm font-black text-slate-700 tracking-tight uppercase italic opacity-80 mt-2">{patient.title}</p>
                    <p className="text-[12px] font-medium text-slate-500 line-clamp-2">Desc: {patient.description}</p>
                 </div>

                 <div className="flex gap-3 relative z-10 mt-4 md:mt-0">
                    <button 
                      onClick={() => handleVideoCall(patient.requester_id)}
                      className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center shadow-sm relative group/btn active:scale-90"
                    >
                       <Video size={24}/>
                    </button>
                    <button 
                      onClick={() => handleJoinChat(patient)}
                      className="px-10 h-16 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-rose-600 shadow-xl transition-all flex items-center justify-center gap-4 group active:scale-95 italic border-4 border-white"
                    >
                       Join Chat <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                 </div>

                 <div className="absolute right-[-20px] top-[-20px] opacity-[0.01] group-hover:opacity-[0.05] transition-all duration-1000 rotate-12 group-hover:rotate-0 pointer-events-none scale-150">
                    <Activity size={200} strokeWidth={1} />
                 </div>
              </motion.div>
            )}))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
