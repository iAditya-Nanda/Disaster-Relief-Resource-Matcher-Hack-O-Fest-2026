import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Map, 
  Activity, 
  HeartHandshake, 
  Stethoscope, 
  ChevronRight,
  Globe,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden selection:bg-blue-200 selection:text-blue-900">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Globe className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-900 to-slate-700 bg-clip-text text-transparent">
                Himachal-Sahayata
              </span>
            </div>
            <div>
              <button 
                onClick={() => navigate('/auth')}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-xl active:scale-95"
              >
                Access Portal
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative min-h-[95vh] flex items-center pt-24 pb-12 overflow-hidden bg-gradient-to-b from-blue-50/50 to-white"
      >
        {/* Colorful Background Decorative Blobs (Blue, Pink, Purple) */}
        <div 
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          <div className="absolute top-[10%] -right-[10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] mix-blend-multiply" />
          <div className="absolute top-[30%] -left-[10%] w-[500px] h-[500px] bg-pink-400/20 rounded-full blur-[120px] mix-blend-multiply" />
          <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[800px] bg-indigo-400/15 rounded-full blur-[150px] mix-blend-multiply" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Hero Text */}
            <div 
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold mb-6 border border-blue-200">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm">AI for a Better World</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
                Himachal-Sahayata <br/>
                <span className="text-3xl md:text-4xl font-semibold text-slate-500 mt-4 block">
                  Disaster Relief Resource Matcher
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-lg font-medium">
                During disasters, resources often accumulate in some areas while others face shortages. We use AI to instantly match available supplies with specific, location-based requests.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/auth')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 active:translate-y-0 flex items-center gap-2"
                >
                  Enter the Platform <ArrowRight className="w-5 h-5" />
                </button>
                <a href="#the-solution" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-sm hover:shadow-md">
                  Discover the Impact
                </a>
              </div>
            </div>

            {/* Hero Illustration */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/40 via-purple-200/40 to-transparent rounded-full blur-[80px]" />
              <img 
                src="/icons/landing-hero.png" 
                alt="Emergency Drone dropping supplies" 
                className="w-full max-w-[550px] h-auto object-contain mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-700" 
                style={{
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))'
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Problem & Solution Section (Red & Green accents) */}
      <section id="the-solution" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-indigo-900/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-3xl"
            >
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-6 border border-red-500/30">
                <Activity className="text-red-400 w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-white">The Challenge</h3>
              <p className="text-slate-300 text-lg leading-relaxed">
                When crisis strikes, coordination breaks down. Organizations cannot easily match available supplies with specific, urgent location-based requests—resulting in critical shortages where they are needed most and excess elsewhere.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-3xl relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/20 rounded-full blur-[60px]" />
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6 border border-green-500/30">
                <ShieldCheck className="text-green-400 w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-white">Why it Matters</h3>
              <p className="text-slate-300 text-lg leading-relaxed">
                Our platform uses intelligent keyword and location matching alongside priority scoring to connect needs with resources. Improved matching makes disaster response drastically more efficient with the exact same amount of aid.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Unified Platform Overview (Using vibrant colors) */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">An Ecosystem Built to Save Lives</h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              We connect affected people, field workers, large organizations, and medical professionals into one unified, real-time map and list view.
            </p>
          </div>

          <div className="space-y-36">
            
            {/* Feature 1: Needy / Pink Accent */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="order-2 md:order-1 relative group">
                 <div className="absolute inset-0 bg-pink-100/60 rounded-[3rem] blur-[50px] group-hover:bg-pink-200/60 transition-colors duration-500" />
                 <img src="/icons/landing-needy.png" alt="Person sending SOS" className="w-[85%] mx-auto relative z-10 drop-shadow-2xl" />
              </div>
              <div className="order-1 md:order-2 md:pl-8">
                <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-6">
                  <Activity className="text-pink-600 w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Requesting Assistance</h3>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  Affected individuals and localized field workers can instantly post “needs” detailing required resources, precise location, and urgency status for immediate visibility.
                </p>
                <ul className="space-y-4">
                  {['One-tap distress signal transmission', 'Live location tracking', 'Specify urgency and resource type'].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-slate-700 font-medium">
                      <div className="w-6 h-6 rounded-full bg-pink-50 flex items-center justify-center border border-pink-100">
                        <ChevronRight className="w-3 h-3 text-pink-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Feature 2: NGO / Volunteers / Green Accent */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="md:pr-8">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <HeartHandshake className="text-green-600 w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">NGOs & Donors</h3>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  Organizations post available resources along with quantity and distribution centers. Our algorithm automatically suggests the best matches for coordinators based on geographic mapping.
                </p>
                <ul className="space-y-4">
                  {['Resource inventory management', 'Map & List view for crisis coordinators', 'Automated matching suggestions'].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-slate-700 font-medium">
                      <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                        <ChevronRight className="w-3 h-3 text-green-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative group">
                 <div className="absolute inset-0 bg-green-100/60 rounded-[3rem] blur-[50px] group-hover:bg-green-200/60 transition-colors duration-500" />
                 <img src="/icons/landing-ngo.png" alt="Volunteer managing supplies" className="w-[85%] mx-auto relative z-10 drop-shadow-2xl" />
              </div>
            </motion.div>

            {/* Feature 3: Doctor / Red Accent */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="order-2 md:order-1 relative group">
                 <div className="absolute inset-0 bg-red-100/60 rounded-[3rem] blur-[50px] group-hover:bg-red-200/60 transition-colors duration-500" />
                 <img src="/icons/landing-doctor.png" alt="Telemedicine Interface" className="w-[85%] mx-auto relative z-10 drop-shadow-2xl" />
              </div>
              <div className="order-1 md:order-2 md:pl-8">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                  <Stethoscope className="text-red-600 w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Telemedicine Triage</h3>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  In tandem with physical supplies, specialized medical requests are routed to available doctors. Triage bots handle initial diagnostics so doctors can focus strictly on care.
                </p>
                <ul className="space-y-4">
                  {['Secure video communication', 'AI symptom extraction', 'Instant medical prescription sharing'].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-slate-700 font-medium">
                      <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                        <ChevronRight className="w-3 h-3 text-red-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Feature 4: Admin / Purple Accent */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="md:pr-8">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <Map className="text-purple-600 w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Command Center</h3>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  Admins have a bird's-eye view of all ongoing operations. With advanced mapping and scoring analytics, coordinators can enforce seamless distribution across the hardest hit regions.
                </p>
                <ul className="space-y-4">
                  {['Global supply line monitoring', 'System health & scoring algorithms', 'Role-based access control'].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-slate-700 font-medium">
                      <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100">
                        <ChevronRight className="w-3 h-3 text-purple-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative group">
                 <div className="absolute inset-0 bg-purple-100/60 rounded-[3rem] blur-[50px] group-hover:bg-purple-200/60 transition-colors duration-500" />
                 <img src="/icons/landing-admin.png" alt="Admin Dashboard Server" className="w-[85%] mx-auto relative z-10 drop-shadow-2xl" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-700 to-indigo-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px]" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Help Make Responses Efficient
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            By connecting location-based needs directly with available supply chains, we ensure not a single resource goes unused.
          </p>
          <button 
            onClick={() => navigate('/auth')}
            className="bg-white hover:bg-slate-50 text-blue-800 px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-white/20 hover:-translate-y-1"
          >
            Access Himachal-Sahayata Dashboard
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="text-blue-500 w-5 h-5" />
            <span className="text-lg font-bold text-slate-800">
              Himachal-Sahayata
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            Disaster Relief Resource Matcher • AI for a Better World
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
