
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, X, Filter, MessageCircle, Sparkles, User, Send, CheckCircle, Search, Crosshair, Navigation, Loader2 } from 'lucide-react';
import { db } from '../services/mockDb';
import { Space } from '../types';
import { generateSpaceSummary } from '../services/geminiService';
import AdSpace from '../components/AdSpace';

const Spaces: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [spaces, setSpaces] = useState<Space[]>([]);
  
  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch spaces dynamically to include user added ones
    setSpaces(db.getAllSpaces());
  }, []);

  const categories = [
    'All',
    'Hot Desk',
    'Dedicated Desk',
    'Private Cabin / Private Office',
    'Meeting Rooms',
    'Conference / Training Rooms',
    'Virtual Office',
    'Day Pass / Hourly Pass Areas',
    'Event Spaces',
    'Creator / Studio Rooms',
    'Phone Booths / Quiet Pods',
    'Flexi Zones',
    'Dedicated Team Suites',
    'Pantry / Café Zones',
    'Breakout Spaces',
    'Storage / Locker Zones',
    'Parking Slots',
    'Outdoor Working Spaces',
    'Utility / Service Rooms',
    'Managed Office',
    'Enterprise Suites'
  ];

  // Haversine Distance Calculation (km)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };
  
  const handleLocateMe = () => {
    // If location is already active, toggle it off
    if (userLocation) {
        setUserLocation(null);
        return;
    }

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
            setIsLocating(false);
        }, 
        (error) => {
            console.error("Error getting location", error);
            setIsLocating(false);
            let msg = "Could not retrieve your location.";
            if (error.code === 1) msg = "Location permission denied. Please enable location access in your browser settings.";
            else if (error.code === 2) msg = "Location unavailable.";
            else if (error.code === 3) msg = "Location request timed out.";
            alert(msg);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const getFilteredSpaces = () => {
    let filtered = spaces;

    // 1. Category Filter
    if (filter !== 'All') {
        filtered = filtered.filter(s => s.category === filter);
    }

    // 2. Search Query Filter (City or Name)
    if (searchQuery.trim()) {
        const lowerQ = searchQuery.toLowerCase();
        filtered = filtered.filter(s => 
            s.title.toLowerCase().includes(lowerQ) || 
            s.location.toLowerCase().includes(lowerQ) ||
            s.address.toLowerCase().includes(lowerQ)
        );
    }

    // 3. Geolocation Sort
    if (userLocation) {
        // Calculate distance for all spaces that have lat/lng
        const withDist = filtered.map(s => {
            const dist = (s.latitude && s.longitude) 
                ? calculateDistance(userLocation.lat, userLocation.lng, s.latitude, s.longitude)
                : undefined; 
            return { ...s, distance: dist };
        });
        
        // Sort: Spaces with distance (closest first), then spaces without distance
        withDist.sort((a, b) => {
            const distA = a.distance ?? 999999;
            const distB = b.distance ?? 999999;
            return distA - distB;
        });
        
        filtered = withDist;
    }

    return filtered;
  };

  const filteredSpaces = getFilteredSpaces();

  const handleOpenModal = (space: Space) => {
    setSelectedSpace(space);
    setAiSummary(''); 
  };

  const handleGenerateSummary = async () => {
    if (!selectedSpace) return;
    setLoadingAi(true);
    const summary = await generateSpaceSummary(selectedSpace);
    setAiSummary(summary);
    setLoadingAi(false);
  };

  const handleThumbnailClick = (index: number) => {
    if (galleryRef.current) {
        const imageWidth = galleryRef.current.clientWidth;
        galleryRef.current.scrollTo({
            left: index * imageWidth,
            behavior: 'smooth'
        });
    }
  };

  const whatsappLink = (phone: string, title: string) => 
    `https://wa.me/${phone}?text=${encodeURIComponent(`Hi, I'm interested in booking "${title}" listed on NearbySpace.App.`)}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-6 py-12 flex flex-col items-center">
      {/* Top Ad */}
      <div className="w-full max-w-7xl mb-8">
        <AdSpace type="horizontal" />
      </div>

      <div className="max-w-7xl mx-auto w-full">
        {/* Header & Search */}
        <div className="mb-12">
           <motion.div
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-center mb-8"
           >
             <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Available Spaces</h1>
             <p className="text-gray-500 dark:text-gray-400 mt-2">Find your perfect workspace across India</p>
           </motion.div>

           {/* Search Bar Container */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto"
           >
             {/* Text Search */}
             <div className="flex-grow relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text"
                  placeholder="Search by City, Area, or Property Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-corporate-500 dark:text-white transition-all"
                />
             </div>
             
             {/* Near Me Button */}
             <button
               onClick={handleLocateMe}
               disabled={isLocating}
               className={`flex items-center justify-center px-6 py-3 rounded-xl font-bold transition-all shadow-md whitespace-nowrap min-w-[140px] ${
                 userLocation 
                   ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800' 
                   : 'bg-corporate-50 text-corporate-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-corporate-100 dark:hover:bg-gray-600'
               }`}
             >
               {isLocating ? (
                  <Loader2 size={18} className="animate-spin mr-2" />
               ) : userLocation ? (
                  <Navigation size={18} className="mr-2 fill-current" />
               ) : (
                  <Crosshair size={18} className="mr-2" />
               )}
               {isLocating ? 'Locating...' : userLocation ? 'Near Me: On' : 'Near Me'}
             </button>
           </motion.div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="w-full overflow-x-auto pb-4 no-scrollbar">
            <div className="flex space-x-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                    filter === cat 
                      ? 'bg-corporate-900 dark:bg-white text-white dark:text-corporate-900 shadow-md' 
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredSpaces.map((space) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={space.id}
                onClick={() => handleOpenModal(space)}
                className="group cursor-pointer bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
              >
                <div className="relative h-64 overflow-hidden">
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
                   <img src={space.imageUrl} alt={space.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                   <div className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 dark:text-white">
                     ₹{space.price.toLocaleString('en-IN')}/{space.period}
                   </div>
                   {/* Distance Badge */}
                   {userLocation && space.distance !== undefined && space.distance < 99999 && (
                       <div className="absolute bottom-4 left-4 z-20 bg-green-500/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white flex items-center shadow-sm">
                           <Navigation size={10} className="mr-1 fill-white" /> {space.distance < 1 ? `${Math.round(space.distance * 1000)} m` : `${space.distance.toFixed(1)} km`}
                       </div>
                   )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-corporate-500 transition-colors">{space.title}</h3>
                  <div className="flex items-center mt-2 text-gray-500 dark:text-gray-400 text-sm">
                    <MapPin size={16} className="mr-1 flex-shrink-0" />
                    <span className="truncate">{space.location}</span>
                  </div>
                   <div className="mt-3">
                     <span className="text-xs font-semibold text-corporate-600 bg-corporate-50 dark:bg-corporate-900/20 dark:text-corporate-400 px-2 py-1 rounded">
                       {space.category}
                     </span>
                   </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {space.amenities.slice(0, 3).map(am => (
                      <span key={am} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md">
                        {am}
                      </span>
                    ))}
                    {space.amenities.length > 3 && (
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md">
                        +{space.amenities.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {filteredSpaces.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                <Filter size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No spaces found matching your criteria.</p>
                <button onClick={() => {setFilter('All'); setSearchQuery(''); setUserLocation(null);}} className="text-corporate-500 hover:underline mt-2">Clear all filters</button>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSpace && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSpace(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-5xl max-h-[95vh] bg-white dark:bg-gray-900 rounded-t-3xl md:rounded-3xl shadow-2xl overflow-y-auto no-scrollbar"
            >
              <button 
                onClick={() => setSelectedSpace(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-white/50 dark:bg-black/50 rounded-full backdrop-blur hover:bg-white dark:hover:bg-black transition-colors"
              >
                <X size={24} className="text-gray-900 dark:text-white" />
              </button>

              <div className="grid md:grid-cols-2">
                {/* Scrollable Image Gallery */}
                <div className="h-64 md:h-auto md:min-h-[600px] relative bg-gray-100 dark:bg-gray-800 flex flex-col">
                  {/* Main Scroll View */}
                  <div 
                    ref={galleryRef}
                    className="flex-1 flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
                  >
                     <img 
                         src={selectedSpace.imageUrl} 
                         className="min-w-full h-full object-cover snap-center"
                         alt="Main"
                     />
                     {selectedSpace.gallery.map((img, i) => (
                       <img 
                         key={i} 
                         src={img} 
                         className="min-w-full h-full object-cover snap-center" 
                         alt={`Gallery ${i}`} 
                       />
                     ))}
                  </div>

                  {/* Thumbnails */}
                  <div className="absolute bottom-4 left-4 right-4 flex space-x-2 overflow-x-auto p-2 bg-black/30 backdrop-blur-md rounded-xl">
                     <img 
                       src={selectedSpace.imageUrl}
                       onClick={() => handleThumbnailClick(0)}
                       className="w-16 h-16 object-cover rounded-lg border-2 border-white/50 hover:border-white cursor-pointer transition-all hover:scale-105" 
                       alt="thumb main"
                     />
                     {selectedSpace.gallery.map((img, i) => (
                       <img 
                         key={i} 
                         src={img} 
                         onClick={() => handleThumbnailClick(i + 1)}
                         className="w-16 h-16 object-cover rounded-lg border-2 border-white/50 hover:border-white cursor-pointer transition-all hover:scale-105" 
                         alt="thumb" 
                       />
                     ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12">
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-corporate-600 font-bold uppercase tracking-wider text-sm bg-corporate-50 dark:bg-corporate-900/20 px-2 py-1 rounded">{selectedSpace.category}</span>
                     <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{selectedSpace.price.toLocaleString('en-IN')}<span className="text-lg font-normal text-gray-500">/{selectedSpace.period}</span></span>
                   </div>
                   
                   <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{selectedSpace.title}</h2>
                   <div className="flex items-center text-gray-500 dark:text-gray-400 mb-6">
                      <MapPin size={18} className="mr-2" />
                      {selectedSpace.address}
                   </div>

                   <div className="flex gap-4 mb-6 text-sm text-gray-600 dark:text-gray-300">
                      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="block font-bold">{selectedSpace.sqFt}</span> Sq Ft
                      </div>
                      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="block font-bold">{selectedSpace.capacity}</span> Seats
                      </div>
                      {selectedSpace.distance !== undefined && selectedSpace.distance < 99999 && (
                          <div className="px-3 py-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-lg flex items-center">
                              <Navigation size={14} className="mr-1" />
                              <span className="block font-bold">{selectedSpace.distance.toFixed(1)} km</span>
                          </div>
                      )}
                   </div>

                   <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        Description
                        <button 
                          onClick={handleGenerateSummary}
                          disabled={loadingAi}
                          className="ml-auto text-xs flex items-center bg-corporate-100 text-corporate-700 dark:bg-corporate-900/30 dark:text-corporate-300 px-2 py-1 rounded-full hover:bg-corporate-200 transition-colors"
                        >
                          <Sparkles size={12} className="mr-1" />
                          {loadingAi ? 'Thinking...' : 'AI Summary'}
                        </button>
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {aiSummary || selectedSpace.description}
                      </p>
                   </div>

                   <div className="mb-8">
                     <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Amenities</h4>
                     <div className="flex flex-wrap gap-2">
                       {selectedSpace.amenities.map(am => (
                         <span key={am} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                           {am}
                         </span>
                       ))}
                     </div>
                   </div>

                   {/* Owner / Contact Actions - Now Unlocked */}
                   <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                        <div className="bg-corporate-50 dark:bg-corporate-900/10 p-6 rounded-xl border border-corporate-100 dark:border-corporate-900/30">
                           <div className="flex items-center mb-4">
                              <div className="w-12 h-12 bg-corporate-200 dark:bg-corporate-800 rounded-full flex items-center justify-center text-corporate-700 dark:text-corporate-200">
                                <User size={24} />
                              </div>
                              <div className="ml-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Property Owner</p>
                                <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedSpace.ownerName}</p>
                              </div>
                           </div>
                           
                           <div className="grid grid-cols-3 gap-3">
                              <a 
                                href={`tel:${selectedSpace.ownerPhone}`}
                                className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-700 dark:text-gray-200"
                              >
                                <Phone size={20} className="mb-1 text-corporate-500" />
                                <span className="text-xs">Call</span>
                              </a>
                              <a 
                                href={`mailto:${selectedSpace.ownerEmail}`}
                                className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-700 dark:text-gray-200"
                              >
                                <Mail size={20} className="mb-1 text-corporate-500" />
                                <span className="text-xs">Email</span>
                              </a>
                              <a 
                                href={whatsappLink(selectedSpace.ownerPhone, selectedSpace.title)}
                                target="_blank"
                                rel="noreferrer"
                                className="flex flex-col items-center justify-center p-3 bg-[#25D366] text-white rounded-lg shadow-sm hover:shadow-md hover:bg-[#20bd5a] transition-colors"
                              >
                                <MessageCircle size={20} className="mb-1" />
                                <span className="text-xs">WhatsApp</span>
                              </a>
                           </div>
                           
                           <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                               <p className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                                   <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                                   {selectedSpace.address}
                               </p>
                           </div>
                        </div>
                   </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Spaces;
