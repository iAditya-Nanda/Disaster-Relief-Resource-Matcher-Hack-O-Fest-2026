import { motion, AnimatePresence } from 'framer-motion';

interface PortalLoaderProps {
  loading: boolean;
  selectedPortal: {
    role: string;
    icon: string;
    color: string;
    title: string;
  } | null;
}

const PortalLoader = ({ loading, selectedPortal }: PortalLoaderProps) => {
  if (!selectedPortal) return null;

  const getPortalDetails = (role: string) => {
    switch(role) {
      case 'NGO': return { 
        color: 'bg-blue-600', 
        textColor: 'text-blue-600', 
        blurColor: 'bg-blue-500', 
        layout: 'flex-col md:flex-row',
        imagePos: 'md:mr-20 mb-10 md:mb-0',
        textPos: 'md:text-left text-center'
      };
      case 'Needy': return { 
        color: 'bg-emerald-600', 
        textColor: 'text-emerald-600', 
        blurColor: 'bg-emerald-500', 
        layout: 'flex-col',
        imagePos: 'mb-12 scale-90',
        textPos: 'text-center'
      };
      case 'Doctor': return { 
        color: 'bg-rose-600', 
        textColor: 'text-rose-600', 
        blurColor: 'bg-rose-500', 
        layout: 'flex-col',
        imagePos: 'mb-20',
        textPos: 'text-center' 
      };
      case 'Admin': return { 
        color: 'bg-amber-600', 
        textColor: 'text-amber-600', 
        blurColor: 'bg-amber-500', 
        layout: 'flex-col md:flex-row-reverse',
        imagePos: 'md:ml-20 mb-10 md:mb-0',
        textPos: 'md:text-right text-center'
      };
      default: return { 
        color: 'bg-slate-900', 
        textColor: 'text-slate-900', 
        blurColor: 'bg-slate-500', 
        layout: 'flex-col',
        imagePos: 'mb-20',
        textPos: 'text-center'
      };
    }
  };

  const theme = getPortalDetails(selectedPortal.role);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 bg-white z-[100] flex items-center justify-center overflow-hidden p-12"
        >
          <div className={`flex ${theme.layout} items-center max-w-[1600px] w-full justify-center`}>
            
            {/* Logic for floating hero */}
            <div className={`relative ${theme.imagePos} shrink-0`}>
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.4, 0.1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute inset-0 ${theme.blurColor} rounded-full blur-[150px] opacity-20`}
                />
                <motion.div
                  animate={{ 
                    y: [-20, 20, -20],
                    rotate: selectedPortal.role === 'NGO' ? [-2, 2, -2] : [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10 w-[300px] h-[300px] lg:w-[480px] lg:h-[480px] flex items-center justify-center p-6"
                >
                  <img
                    src={selectedPortal.icon}
                    alt={selectedPortal.role}
                    className="w-full h-full object-contain filter drop-shadow-[0_60px_100px_rgba(0,0,0,0.1)]"
                  />
                </motion.div>
            </div>

            {/* Logic for Text Content */}
            <div className={`space-y-10 ${theme.textPos} max-w-4xl`}>
              <div className={`flex flex-wrap ${theme.textPos === 'text-center' ? 'justify-center' : theme.textPos === 'md:text-right text-center' ? 'md:justify-end justify-center' : 'justify-start'} gap-x-6 gap-y-2`}>
                {`Welcome to Sahayata-${selectedPortal.role}.`.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 40, filter: "blur(15px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.1 * i, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter"
                  >
                    {word.includes(`Sahayata-`) ? <span className={`${theme.textColor} italic`}>{word}</span> : word}
                  </motion.span>
                ))}
              </div>
              
              <motion.p 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 1.2 }} 
                className={`text-xl font-bold text-slate-400 tracking-[0.3em] italic uppercase flex items-center gap-6 ${theme.textPos === 'text-center' ? 'justify-center' : theme.textPos === 'md:text-right text-center' ? 'md:flex-row-reverse' : ''}`}
              >
                <span className={`w-16 h-1 ${theme.color} rounded-full`}></span>
                Authorising node access
                <span className={`w-16 h-1 ${theme.color} rounded-full`}></span>
              </motion.p>
            </div>
          </div>

          {/* Master Progress Strip */}
          <div className="absolute bottom-0 left-0 w-full h-4 bg-slate-50">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
              className={`h-full ${theme.color} relative overflow-hidden`}
            >
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PortalLoader;
