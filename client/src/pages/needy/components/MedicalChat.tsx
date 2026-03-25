import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Bot, Sparkles, AlertCircle, Video } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../../store/authStore';
import { io, Socket } from 'socket.io-client';
import { supabase } from '../../../supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Message {
  id?: string;
  text: string;
  is_ai: boolean;
  created_at: string;
}

interface MedicalChatProps {
  onBack: () => void;
}

const PRESET_NEEDS = [
  { label: 'Chest Pain', icon: '🫀' },
  { label: 'Severe Bleeding', icon: '🩸' },
  { label: 'High Fever', icon: '🤒' },
  { label: 'Breathing Issue', icon: '🫁' }
];

export default function MedicalChat({ onBack }: MedicalChatProps) {
  const { session, user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [needId, setNeedId] = useState<string | null>(null);
  const [connectedDoctor, setConnectedDoctor] = useState(false);
  const [inCall, setInCall] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection for WebRTC signaling
    socketRef.current = io(API_URL);
    if (user?.id) {
       socketRef.current.emit('join_personal', user.id);
    }
    
    socketRef.current.on('video_offer', async () => {
        // Handle incoming video offer from Doctor
        const accept = window.confirm("Incoming Emergency Video Call from a Doctor. Accept?");
        if (accept) {
           setInCall(true);
           setConnectedDoctor(true);
        }
    });

    return () => {
       socketRef.current?.disconnect();
    };
  }, [user]);

  // Real-time subscription for doctor/AI messages
  useEffect(() => {
    if (!needId) return;

    // Fetch existing messages first
    const fetchMsgs = async () => {
       const { data } = await supabase
         .from('need_messages')
         .select('*')
         .eq('need_id', needId)
         .order('created_at', { ascending: true });
       if (data) setMessages(data);
    }
    fetchMsgs();

    const channel = supabase
      .channel(`medical-chat-${needId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'need_messages', 
        filter: `need_id=eq.${needId}` 
      }, (payload) => {
        setMessages((prev: Message[]) => {
          if (prev.find(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new as Message];
        });
        if (payload.new.sender_id !== user?.id) {
           setConnectedDoctor(true);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [needId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    setLoading(true);
    const userMsg: Message = { text, is_ai: false, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        await sendRequestToAI(text, pos.coords.latitude, pos.coords.longitude);
      }, async () => {
        await sendRequestToAI(text, null, null);
      });
    } catch (error) {
      setLoading(false);
    }
  };

  const sendRequestToAI = async (text: string, lat: number | null, lng: number | null) => {
      try {
        const headers: Record<string, string> = {};
        if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
        if (user?.id) headers['x-test-user-id'] = user.id;

        const response = await axios.post(`${API_URL}/api/ai/medical_chat`, {
          message: text,
          title: '[MEDICAL TRIAGE] Patient Symptom Check',
          need_id: needId,
          lat,
          lng
        }, { headers });

        const aiMsg: Message = {
          text: response.data.ai_response,
          is_ai: true,
          created_at: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, aiMsg]);
        setNeedId(response.data.need_id);
        
        if (response.data.connect_doctor) {
           setConnectedDoctor(true);
        }
      } catch (error) {
        console.error('Chat Error:', error);
        setMessages(prev => [...prev, {
          text: "Medical server unreachable. If this is a life-threatening emergency, please dial local emergency numbers immediately.",
          is_ai: true,
          created_at: new Date().toISOString()
        }]);
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="bg-white w-full h-full rounded-[40px] shadow-2xl relative z-10 flex flex-col border border-slate-100 overflow-hidden">
      {/* Header */}
            <div className={`p-6 border-b border-slate-50 flex justify-between items-center text-white transition-colors duration-500 ${connectedDoctor ? 'bg-rose-600' : 'bg-emerald-600'}`}>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                     {connectedDoctor ? <AlertCircle size={24} className="text-white" /> : <Bot size={24} className="text-white" />}
                  </div>
                  <div>
                    <h3 className="font-black tracking-tight text-xl">{connectedDoctor ? 'Doctor Assigned' : 'AI Medical Triage'}</h3>
                    <div className="flex items-center gap-2 opacity-80">
                       <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                       <span className="text-[10px] font-bold uppercase tracking-wider">{connectedDoctor ? 'Waiting for Doctor to join call...' : 'Analyzing symptoms'}</span>
                    </div>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                 {inCall && <span className="bg-rose-500 px-3 py-1 rounded-full text-xs font-black animate-pulse flex items-center gap-2"><Video size={14}/> LIVE</span>}
                 <button onClick={onBack} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl transition-all flex items-center justify-center">
                    <X size={20} />
                 </button>
               </div>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 no-scrollbar"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-10">
                   <div className="w-20 h-20 bg-emerald-50 rounded-[30px] flex items-center justify-center text-emerald-600 mb-2">
                      <Sparkles size={40} />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">AI Triage Active</h4>
                      <p className="text-slate-400 font-medium text-sm max-w-xs mx-auto">Please describe your symptoms. Our AI will analyze them and connect you to a doctor if urgent.</p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                      {PRESET_NEEDS.map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => handleSendMessage(`I am experiencing ${preset.label}`)}
                          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all text-left flex items-center gap-3 group"
                        >
                          <span className="text-2xl">{preset.icon}</span>
                          <span className="text-xs font-bold text-slate-600 group-hover:text-emerald-600 transition-colors">{preset.label}</span>
                        </button>
                      ))}
                   </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.is_ai ? 'justify-start' : 'justify-end'} gap-3`}
                >
                  {msg.is_ai && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 mt-1 shadow-lg ${connectedDoctor ? 'bg-rose-600 shadow-rose-100' : 'bg-emerald-600 shadow-emerald-100'}`}>
                       {connectedDoctor ? <AlertCircle size={14} /> : <Bot size={14} />}
                    </div>
                  )}
                  <div className={`max-w-[80%] p-5 rounded-[24px] shadow-sm ${
                    msg.is_ai 
                    ? 'bg-white text-slate-800 rounded-tl-none border border-slate-100' 
                    : 'bg-emerald-600 text-white rounded-tr-none'
                  }`}>
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                    <span className={`text-[10px] mt-2 block opacity-40 font-bold ${msg.is_ai ? 'text-slate-400' : 'text-white/70'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 mt-1">
                     <Bot size={14} />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1">
                     <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                     <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                     <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-50">
               <div className="relative flex items-center gap-3 bg-slate-50 rounded-[28px] p-2 pr-4 border border-slate-200 focus-within:border-emerald-300 focus-within:bg-white transition-all shadow-inner">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
                    placeholder="Type your medical symptoms here..."
                    className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm font-semibold text-slate-700 placeholder:text-slate-400"
                  />
                  <button 
                    onClick={() => handleSendMessage(input)}
                    disabled={!input.trim() || loading}
                    className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100 transition-all hover:scale-105 active:scale-95 disabled:grayscale disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
               </div>
             <p className="text-center text-[10px] text-slate-400 mt-4 font-bold tracking-tight uppercase">Medical interactions are encrypted and private</p>
          </div>
    </div>
  );
}
