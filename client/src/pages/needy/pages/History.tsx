import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock,
  ChevronRight,
  Stethoscope,
  Package,
  Box
} from 'lucide-react';

import { useAuthStore } from '../../../store/authStore';
import { supabase } from '../../../supabaseClient';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Skeleton = () => (
    <div className="flex items-center gap-6 p-8 rounded-[35px] border border-slate-200 bg-white animate-pulse relative overflow-hidden mb-4 shadow-sm">
      <div className="w-16 h-16 bg-slate-500/20 rounded-2xl"></div>
      <div className="flex-1 space-y-4">
        <div className="h-6 w-1/2 bg-slate-400/30 rounded-full"></div>
        <div className="h-3 w-1/4 bg-slate-200/40 rounded-full"></div>
      </div>
      <div className="w-14 h-14 bg-slate-100/30 rounded-2xl"></div>
    </div>
);

const HeaderSkeleton = () => (
    <div className="space-y-6 mb-12 animate-pulse px-2">
      <div className="h-16 w-[450px] bg-slate-500/20 rounded-3xl"></div>
      <div className="h-5 w-[350px] bg-slate-400/20 rounded-full"></div>
    </div>
);

export default function History() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [fetchingChat, setFetchingChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { session, user } = useAuthStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!selectedItem?.id) return;

    const channel = supabase
      .channel(`history-chat-${selectedItem.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'need_messages', 
        filter: `need_id=eq.${selectedItem.id}` 
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
  }, [selectedItem?.id]);

  const fetchHistory = async () => {
    try {
      const headers: Record<string, string> = {};
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
      if (user?.id) headers['x-test-user-id'] = user.id;

      const res = await axios.get(`${API_URL}/api/needs/my`, { headers });
      setHistory(res.data || []);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [session]);

  const viewChat = async (item: any) => {
    setSelectedItem(item);
    setFetchingChat(true);
    setMessages([]);
    try {
      const { data, error } = await supabase
        .from('need_messages')
        .select('*')
        .eq('need_id', item.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    } finally {
      setFetchingChat(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedItem || sending) return;

    setSending(true);
    try {
      // For History page, we send to the AI but it's registered as a user message
      // If it's medical aid, it goes to medicalChat, otherwise matchChat
      const endpoint = selectedItem.category === 'Medical' ? '/api/ai/medical_chat' : '/api/ai/chat';
      
      const headers: Record<string, string> = {};
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
      if (user?.id) headers['x-test-user-id'] = user.id;

      await axios.post(`${API_URL}${endpoint}`, {
        message: chatInput,
        need_id: selectedItem.id
      }, { headers });

      setChatInput('');
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setSending(false);
    }
  };

  const isClosed = (item: any) => ['completed', 'closed', 'fulfilled'].includes(item.status);

  return (
    <div className="h-full flex flex-col overflow-hidden w-full py-6 space-y-8 px-4">
      <AnimatePresence mode="wait">
        {loading ? (
             <motion.div 
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col gap-2"
             >
                <HeaderSkeleton />
                <div className="flex-1 px-4">
                    {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} />)}
                </div>
             </motion.div>
        ) : selectedItem ? (
          <motion.div 
            key="chat-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col gap-6"
          >
             <button 
               onClick={() => setSelectedItem(null)}
               className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-colors uppercase text-[10px] font-black tracking-widest bg-white w-fit px-6 py-3 rounded-full shadow-sm border border-slate-100"
             >
               <ChevronRight className="rotate-180" size={14} /> Back to Registry
             </button>

             <div className="flex-1 bg-white border-2 border-slate-50 shadow-2xl rounded-[50px] p-10 flex flex-col gap-8 overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                   <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 text-white rounded-2xl flex items-center justify-center shadow-lg ${selectedItem.category === 'Medical' ? 'bg-rose-600 shadow-rose-200' : 'bg-emerald-600 shadow-emerald-200'}`}>
                         {selectedItem.category === 'Medical' ? <Stethoscope size={32}/> : <Package size={32}/>}
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">{selectedItem.title}</h3>
                        <p className="text-xs font-bold text-slate-400 mt-2">{selectedItem.summary || selectedItem.description}</p>
                      </div>
                   </div>
                   <div className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase shadow-xl ${isClosed(selectedItem) ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}>
                      {selectedItem.status}
                   </div>
                </div>

                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto space-y-6 pr-4"
                >
                   {fetchingChat ? (
                     <div className="h-full flex flex-col items-center justify-center gap-4 opacity-50">
                        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black tracking-widest uppercase">Fetching Logs...</p>
                     </div>
                   ) : messages.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
                        <p className="text-sm font-black uppercase tracking-widest">No conversation records found</p>
                     </div>
                   ) : (
                     messages.map((msg, idx) => (
                       <div key={idx} className={`flex flex-col ${msg.sender_id === user?.id ? 'items-end' : 'items-start'} gap-2`}>
                          <div className={`max-w-[80%] p-6 rounded-[32px] ${msg.is_ai ? 'bg-blue-50 text-blue-900 border border-blue-100' : (msg.sender_id === user?.id ? (selectedItem.category === 'Medical' ? 'bg-rose-600 text-white shadow-xl shadow-rose-200' : 'bg-emerald-600 text-white shadow-xl shadow-emerald-200') : 'bg-slate-50 text-slate-800 border border-slate-100')}`}>
                             <div className="flex items-center gap-2 mb-2 opacity-50 text-[8px] font-black uppercase tracking-widest">
                                   {msg.is_ai ? 'AI Coordinator' : (msg.sender_id === user?.id ? 'You' : (selectedItem.category === 'Medical' ? 'Medical Staff' : 'Relief Agent'))}
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

                {!isClosed(selectedItem) && (
                  <div className="pt-6 border-t border-slate-100 flex gap-4">
                     <div className="flex-1 relative">
                        <input 
                           type="text"
                           value={chatInput}
                           onChange={(e) => setChatInput(e.target.value)}
                           onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                           placeholder="Type your response to the team..."
                           className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-[28px] px-8 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-emerald-500 outline-none transition-all shadow-inner"
                        />
                     </div>
                     <button 
                        onClick={handleSendMessage}
                        disabled={!chatInput.trim() || sending}
                        className={`h-16 px-10 rounded-[28px] text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-20 ${selectedItem.category === 'Medical' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}
                     >
                        {sending ? 'Sending...' : 'Transmit Response'} <ChevronRight size={14} />
                     </button>
                  </div>
                )}
             </div>
          </motion.div>
        ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col gap-8 overflow-hidden"
            >
              {/* Header Section */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 px-2">
                <div className="flex flex-col gap-2">
                  <h2 className="text-[52px] font-black text-slate-900 tracking-[-0.04em] leading-none">
                    Rescue <span className="text-emerald-600 font-black">History.</span>
                  </h2>
                  <p className="text-sm font-semibold text-slate-400 leading-relaxed tracking-tight border-l-4 border-emerald-600 pl-6 max-w-xl opacity-70">
                    A streamlined registry of all medical and resource aid engagements.
                  </p>
                </div>
                
                <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-100 p-4 rounded-[24px] shadow-sm self-end md:self-start">
                   <Clock className="text-emerald-500" size={20} />
                   <p className="text-xs font-black text-emerald-600 tracking-tight">System Refreshed: Just now</p>
                 </div>
              </div>

              {/* Registry List Only */}
              <div className="flex-1 flex flex-col gap-6 overflow-hidden min-h-0">
                    <div className="flex items-center justify-between px-4">
                      <div className="flex flex-col gap-2 relative">
                        <div className="absolute -left-6 top-0 w-1.5 h-full bg-emerald-600 rounded-full"></div>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Service Log</h3>
                        <p className="text-xs font-semibold text-slate-400 opacity-60">Listing all {history.length} interactions</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 bg-white border-2 border-slate-50 shadow-2xl shadow-slate-300/10 rounded-[50px] p-8 space-y-4 overflow-y-auto no-scrollbar mb-4">
                       {history.length === 0 ? (
                           <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-20">
                              <Box size={64} className="animate-bounce" />
                              <p className="font-black text-lg tracking-tight">No active signals detected in sector</p>
                           </div>
                       ) : (
                           history.map((item, i) => {
                             const isMedical = item.category === 'Medical' || item.title?.toLowerCase().includes('medical') || false;
                             const displayDate = new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                             return (
                             <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                key={item.id} 
                                onClick={() => viewChat(item)}
                                className="flex items-center gap-8 p-8 rounded-[45px] hover:bg-emerald-50/50 hover:border-emerald-100 border-2 border-transparent transition-all group cursor-pointer shadow-sm relative overflow-hidden shrink-0"
                             >
                                <div className={`w-16 h-16 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shrink-0 ${isMedical ? 'text-rose-500' : 'text-blue-500'}`}>
                                   {isMedical ? <Stethoscope size={28} /> : <Package size={28}/>}
                                </div>
                                <div className="flex-1 min-w-0">
                                   <div className="flex items-center justify-between gap-4 mb-2">
                                      <div className="flex flex-col">
                                        <h4 className="text-2xl font-black text-slate-900 tracking-tighter truncate group-hover:text-emerald-700 transition-colors uppercase">{item.title}</h4>
                                        <span className={`text-[10px] font-bold tracking-widest uppercase ${isMedical ? 'text-rose-500' : 'text-blue-600'}`}>{isMedical ? 'Medical Aid' : 'Resource Aid'}</span>
                                      </div>
                                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-wide capitalize ${item.status === 'completed' || item.status === 'delivered' || item.status === 'closed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                        {item.status}
                                      </div>
                                   </div>
                                    <p className="text-xs font-semibold text-slate-400 truncate opacity-60 leading-relaxed capitalize">{item.summary ? `Summary: ${item.summary}` : item.description}</p>
                                 </div>
                                <div className="flex flex-col items-end shrink-0 gap-1 pr-2">
                                   <span className="text-[10px] font-bold text-slate-300 uppercase">{displayDate}</span>
                                   <ChevronRight size={24} className="text-slate-100 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all"/>
                                </div>
                             </motion.div>
                           )})
                       )}
                    </div>
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
