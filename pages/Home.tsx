
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { REVIEWS } from '../constants';
import { db } from '../services/mockDb'; // Import db
import { Space } from '../types';
import AdSpace from '../components/AdSpace';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1920&auto=format&fit=crop', // Indian Corporate Team
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1920&auto=format&fit=crop', // Modern Office India
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1920&auto=format&fit=crop', // Business Woman
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1920&auto=format&fit=crop'  // Coworking Space
];

const Home: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [recentSpaces, setRecentSpaces] = useState<Space[]>([]);

  useEffect(() => {
    // Fetch all spaces, sort by ID (assuming ID is timestamp based for new ones) to show newest first
    // For the mock data which has simple IDs '1', '2', we might need to handle string comparison carefully
    // or just rely on the fact that Date.now() IDs will be larger than '1'.
    const allSpaces = db.getAllSpaces();
    
    // Sort descending. If ID is numeric-ish string from Date.now(), this puts newest on top.
    const sorted = [...allSpaces].sort((a, b) => {
        if(a.id.length > 5 && b.id.length <= 5) return -1; // a is timestamp, b is static
        if(b.id.length > 5 && a.id.length <= 5) return 1;
        return b.id.localeCompare(a.id);
    });

    setRecentSpaces(sorted.slice(0, 3));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overflow-hidden flex flex-col items-center w-full">
      {/* Hero Section - Full Width */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black w-full">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={HERO_IMAGES[currentImageIndex]} 
              alt="Modern Indian Corporate Space" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-corporate-900/80 via-black/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
              Find Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-corporate-400 to-white">Perfect Space</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg drop-shadow-md">
              Unlock premium workspaces, event venues, and creative studios across India. Curated for professionals who demand excellence.
            </p>
            <div className="flex space-x-4">
              <Link 
                to="/spaces" 
                className="px-8 py-4 bg-white text-corporate-900 rounded-full font-semibold hover:bg-corporate-500 hover:text-white hover:scale-105 transition-all duration-300 flex items-center shadow-lg shadow-corporate-500/20"
              >
                Browse Spaces <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Horizontal Ad Below Hero */}
      <div className="w-full max-w-7xl px-6 mt-8">
        <AdSpace type="horizontal" />
      </div>

      {/* Recently Added Section */}
      <section className="py-24 bg-white dark:bg-gray-950 w-full">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Recently Added in India</h2>
            <p className="text-gray-500 dark:text-gray-400">Discover the latest gems in Mumbai, Delhi, and Bangalore.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {recentSpaces.map((space, index) => (
              <motion.div 
                key={space.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-corporate-200/50 dark:hover:shadow-corporate-900/30 transition-shadow duration-300 flex flex-col h-full"
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={space.imageUrl} 
                    alt={space.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 dark:text-white">
                     ₹{space.price.toLocaleString('en-IN')}/{space.period}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-corporate-600 bg-corporate-100 dark:bg-corporate-900/30 dark:text-corporate-400 px-3 py-1 rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-full inline-block">
                        {space.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{space.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm line-clamp-2 flex-grow">{space.description}</p>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{space.location}</span>
                    <Link to="/spaces" className="text-sm font-medium text-corporate-600 dark:text-corporate-400 hover:underline">View Details</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 w-full">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid md:grid-cols-2 gap-16 items-center">
             <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
             >
               <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Why Choose NearbySpace?</h2>
               <div className="space-y-6">
                 {[
                   { title: 'Verified Listings', desc: 'Every space is personally vetted by our team.' },
                   { title: 'Direct Communication', desc: 'Chat instantly with owners via WhatsApp.' },
                   { title: 'Secure Booking', desc: 'Transparent pricing with no hidden fees.' }
                 ].map((item, idx) => (
                   <div key={idx} className="flex items-start">
                     <div className="flex-shrink-0 p-2 bg-corporate-100 dark:bg-corporate-900/30 rounded-lg text-corporate-600 dark:text-corporate-400">
                       <CheckCircle size={24} />
                     </div>
                     <div className="ml-4">
                       <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                       <p className="mt-1 text-gray-500 dark:text-gray-400">{item.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </motion.div>
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="grid grid-cols-2 gap-4"
             >
                <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=400&h=500&fit=crop" className="rounded-2xl shadow-lg mt-8" alt="Feature 1" />
                <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400&h=500&fit=crop" className="rounded-2xl shadow-lg" alt="Feature 2" />
             </motion.div>
           </div>
        </div>
      </section>

      {/* Reviews Carousel */}
      <section className="py-24 bg-white dark:bg-gray-950 overflow-hidden w-full">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Trusted by Indian Professionals</h2>
        </div>
        
        <div className="flex space-x-6 animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused] w-max">
           {/* Duplicate array for infinite loop illusion */}
           {[...REVIEWS, ...REVIEWS, ...REVIEWS].map((review, idx) => (
             <div key={`${review.id}-${idx}`} className="w-[400px] p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex-shrink-0">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={`${i < review.rating ? 'text-corporate-500 fill-corporate-500' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic mb-6">"{review.content}"</p>
                <div className="flex items-center">
                  <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full mr-4" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{review.name}</h4>
                    <p className="text-xs text-gray-500">{review.role}, {review.company}</p>
                  </div>
                </div>
             </div>
           ))}
        </div>
      </section>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default Home;
