import React from 'react';
import { X, Bell, Info, ShieldAlert, AlertCircle } from 'lucide-react';

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPopup: React.FC<NotificationPopupProps> = ({ isOpen, onClose }) => {
  const notifications = [
    { 
        id: 1, 
        type: 'critical', 
        title: 'Emergency SOS: Kullu District', 
        time: '2m ago', 
        msg: 'A medical triage request has been initiated near your deployment zone.',
        icon: ShieldAlert,
        color: 'text-red-600 bg-red-50'
    },
    { 
        id: 2, 
        type: 'info', 
        title: 'Inventory Alert', 
        time: '14m ago', 
        msg: 'Blanket stock is below 10% in Shimla warehouse.',
        icon: AlertCircle,
        color: 'text-amber-600 bg-amber-50'
    },
    { 
        id: 3, 
        type: 'success', 
        title: 'Volunteer Match Found', 
        time: '1h ago', 
        msg: '3 new medical professionals joined your relief network.',
        icon: Info,
        color: 'text-teal-600 bg-teal-50'
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Click outside to close overlay */}
      <div className="fixed inset-0 z-[120]" onClick={onClose}></div>
      
      <div className="fixed top-24 right-6 md:right-10 w-full max-w-[380px] z-[130] animate-in slide-in-from-top-4 duration-300">
        <div className="clay-card bg-white p-6 shadow-2xl border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-500 to-amber-500"></div>
            
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Bell size={20} className="text-teal-600" />
                    <h3 className="text-lg font-black text-gray-950 tracking-tight italic">Resource Alerts</h3>
                </div>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400">
                    <X size={18} />
                </button>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {notifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                        <div key={notif.id} className="p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors border border-gray-100 group cursor-pointer relative overflow-hidden">
                            <div className="flex gap-4">
                                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${notif.color}`}>
                                    <Icon size={20} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className="text-sm font-black text-gray-900 leading-tight">{notif.title}</h4>
                                        <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{notif.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{notif.msg}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button className="w-full mt-6 py-3 bg-gray-50 hover:bg-teal-50 text-teal-700 font-black text-xs uppercase tracking-widest rounded-xl border border-gray-100 transition-all">
                Mark all as read
            </button>
        </div>
      </div>
    </>
  );
};
