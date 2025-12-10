

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/mockDb';
import { Owner, Space, Enquiry } from '../types';
import { Building, MessageSquare, LogOut, Plus, Phone, Mail, X, Save, Image as ImageIcon, UploadCloud, BarChart2, TrendingUp, Users, Eye, MousePointerClick } from 'lucide-react';
import AdSpace from '../components/AdSpace';

// Simple Area Chart Component using SVG
const AreaChart = ({ data, color }: { data: number[], color: string }) => {
    const height = 100;
    const width = 300;
    const max = Math.max(...data, 1);
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - (val / max) * height;
        return `${x},${y}`;
    }).join(' ');

    const areaPath = `M0,${height} ${points} L${width},${height} Z`;
    const linePath = `M${points.split(' ')[0]} ${points}`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
                <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
                </linearGradient>
            </defs>
            <motion.path
                initial={{ d: `M0,${height} L${width},${height} L${width},${height} Z` }}
                animate={{ d: areaPath }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                fill={`url(#grad-${color})`}
            />
            <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                d={linePath}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<Owner | null>(null);
  const [listings, setListings] = useState<Space[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'listings' | 'enquiries' | 'analytics'>('listings');
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  // Add Space Form State
  const [newSpace, setNewSpace] = useState<Partial<Space>>({
    title: '',
    category: 'Hot Desk',
    price: 0,
    period: 'month',
    location: '',
    address: '',
    description: '',
    amenities: [],
    imageUrl: '',
    gallery: [],
    sqFt: 0,
    capacity: 0,
    latitude: undefined,
    longitude: undefined
  });
  const [amenityInput, setAmenityInput] = useState('');

  // Analytics State
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>('all');

  const categories = [
    'Hot Desk', 'Dedicated Desk', 'Private Cabin / Private Office', 'Meeting Rooms', 
    'Conference / Training Rooms', 'Virtual Office', 'Day Pass / Hourly Pass Areas', 
    'Event Spaces', 'Creator / Studio Rooms', 'Phone Booths / Quiet Pods', 'Flexi Zones', 
    'Dedicated Team Suites', 'Pantry / Café Zones', 'Breakout Spaces', 'Storage / Locker Zones', 
    'Parking Slots', 'Outdoor Working Spaces', 'Utility / Service Rooms', 'Managed Office', 'Enterprise Suites'
  ];

  useEffect(() => {
    const currentUser = db.getCurrentUser();
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    setUser(currentUser);
    setListings(db.getUserSpaces(currentUser.id));
    setEnquiries(db.getEnquiries(currentUser.id));
  }, [navigate]);

  const handleLogout = () => {
    db.logout();
    window.dispatchEvent(new Event('user-auth-change'));
    navigate('/');
  };

  const handleAddSpace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newSpace.title) return;

    const spaceToSave: Space = {
      id: Date.now().toString(),
      ownerId: user.id,
      ownerName: `${user.firstName} ${user.lastName}`,
      ownerEmail: user.email,
      ownerPhone: user.mobile,
      title: newSpace.title!,
      category: newSpace.category || 'Hot Desk',
      price: Number(newSpace.price),
      period: newSpace.period as 'hour' | 'day' | 'month',
      location: newSpace.location || '',
      address: newSpace.address || '',
      description: newSpace.description || '',
      amenities: newSpace.amenities || [],
      imageUrl: newSpace.imageUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800',
      gallery: newSpace.gallery?.length ? newSpace.gallery : ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800'],
      sqFt: Number(newSpace.sqFt),
      capacity: Number(newSpace.capacity),
      latitude: newSpace.latitude,
      longitude: newSpace.longitude,
      views: 0 // Initialize views
    };

    db.saveSpace(spaceToSave);
    setListings([...listings, spaceToSave]);
    setShowAddForm(false);
    // Reset form
    setNewSpace({
        title: '', category: 'Hot Desk', price: 0, period: 'month', location: '', address: '', description: '', amenities: [], imageUrl: '', gallery: [], sqFt: 0, capacity: 0, latitude: undefined, longitude: undefined
    });
  };

  const addAmenity = () => {
      if(amenityInput.trim()) {
          setNewSpace({...newSpace, amenities: [...(newSpace.amenities || []), amenityInput.trim()]});
          setAmenityInput('');
      }
  };

  // Convert uploaded file to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean) => {
    if (e.target.files) {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                if(isGallery) {
                    setNewSpace(prev => ({
                        ...prev,
                        gallery: [...(prev.gallery || []), base64String]
                    }));
                } else {
                    setNewSpace(prev => ({ ...prev, imageUrl: base64String }));
                }
            };
            reader.readAsDataURL(file as Blob);
        });
    }
  };

  // --- Analytics Logic ---
  const analyticsData = useMemo(() => {
    // If 'all', sum up everything. If specific ID, find that one.
    const targetSpaces = selectedSpaceId === 'all' 
        ? listings 
        : listings.filter(l => l.id === selectedSpaceId);

    const totalViews = targetSpaces.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalEnquiries = enquiries.filter(e => 
        selectedSpaceId === 'all' ? true : e.spaceId === selectedSpaceId
    ).length;

    // Generate Mock Trend Data based on totalViews (Simulating last 7 days)
    // We deterministically generate random-ish data based on the total count so it doesn't flicker
    const generateTrend = (total: number, days: number) => {
        const data = [];
        let remaining = total;
        for (let i = 0; i < days - 1; i++) {
            const val = Math.floor(Math.random() * (remaining / (days - i)) * 1.5);
            data.push(val);
            remaining -= val;
        }
        data.push(remaining); // Put remainder in last day or shuffle. 
        // For smoother chart, let's just generate numbers that sum roughly to total or just look good relative to it
        return Array.from({length: days}, (_, i) => Math.floor(total / days * (0.5 + Math.random())));
    };

    const viewsTrend = generateTrend(totalViews || 100, 7);
    const enquiriesTrend = generateTrend(totalEnquiries || 10, 7);

    return {
        totalViews,
        totalEnquiries,
        conversionRate: totalViews > 0 ? ((totalEnquiries / totalViews) * 100).toFixed(1) : '0.0',
        viewsTrend,
        enquiriesTrend
    };
  }, [selectedSpaceId, listings, enquiries]);


  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-12 flex flex-col items-center">
      {/* Top Ad */}
      <div className="w-full max-w-6xl mb-8">
        <AdSpace type="horizontal" />
      </div>

      <div className="max-w-6xl w-full mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Owner Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Welcome back, {user.firstName}!</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-red-500 rounded-lg shadow hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={18} className="mr-2" /> Logout
          </button>
        </div>

        {/* Stats Cards - Global */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="text-corporate-500 mb-2"><Building /></div>
             <div className="text-2xl font-bold text-gray-900 dark:text-white">{listings.length}</div>
             <div className="text-xs text-gray-500 uppercase tracking-wide">Active Listings</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="text-blue-500 mb-2"><MessageSquare /></div>
             <div className="text-2xl font-bold text-gray-900 dark:text-white">{enquiries.length}</div>
             <div className="text-xs text-gray-500 uppercase tracking-wide">Total Enquiries</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="text-purple-500 mb-2"><Eye /></div>
             <div className="text-2xl font-bold text-gray-900 dark:text-white">{listings.reduce((acc, curr) => acc + (curr.views || 0), 0)}</div>
             <div className="text-xs text-gray-500 uppercase tracking-wide">Total Views</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="text-green-500 mb-2"><TrendingUp /></div>
             <div className="text-2xl font-bold text-gray-900 dark:text-white">
                 {listings.reduce((acc, c) => acc + (c.views || 0), 0) > 0 
                    ? ((enquiries.length / listings.reduce((acc, c) => acc + (c.views || 0), 0)) * 100).toFixed(1)
                    : 0}%
             </div>
             <div className="text-xs text-gray-500 uppercase tracking-wide">Conv. Rate</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 border-b border-gray-200 dark:border-gray-700 mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-4 px-2 font-medium transition-colors relative whitespace-nowrap ${activeTab === 'listings' ? 'text-corporate-600 dark:text-corporate-400' : 'text-gray-500 dark:text-gray-400'}`}
          >
            My Listings
            {activeTab === 'listings' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-corporate-500" />}
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`pb-4 px-2 font-medium transition-colors relative whitespace-nowrap ${activeTab === 'enquiries' ? 'text-corporate-600 dark:text-corporate-400' : 'text-gray-500 dark:text-gray-400'}`}
          >
            Requests / Enquiries
            {activeTab === 'enquiries' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-corporate-500" />}
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-4 px-2 font-medium transition-colors relative whitespace-nowrap flex items-center ${activeTab === 'analytics' ? 'text-corporate-600 dark:text-corporate-400' : 'text-gray-500 dark:text-gray-400'}`}
          >
            <BarChart2 size={16} className="mr-2" /> Analytics
            {activeTab === 'analytics' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-corporate-500" />}
          </button>
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {activeTab === 'listings' && (
            <div>
               {!showAddForm ? (
                   <>
                       <div className="flex justify-end mb-6">
                         <button 
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center px-4 py-2 bg-corporate-600 text-white rounded-lg hover:bg-corporate-700 shadow-lg shadow-corporate-500/30 transition-all"
                         >
                            <Plus size={18} className="mr-2" /> Add New Space
                         </button>
                       </div>
                       
                       {listings.length === 0 ? (
                         <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't listed any spaces yet.</p>
                            <button onClick={() => setShowAddForm(true)} className="text-corporate-600 font-bold hover:underline">List your first space now</button>
                         </div>
                       ) : (
                         <div className="grid md:grid-cols-2 gap-6">
                            {listings.map(space => (
                              <div key={space.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex space-x-4 border border-gray-100 dark:border-gray-700">
                                 <img src={space.imageUrl} className="w-24 h-24 object-cover rounded-lg" alt={space.title} />
                                 <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{space.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{space.location}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-corporate-600 font-semibold">₹{space.price}/{space.period}</p>
                                        <div className="flex items-center text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                            <Eye size={12} className="mr-1" /> {space.views || 0}
                                        </div>
                                    </div>
                                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-2 inline-block">{space.category}</span>
                                 </div>
                              </div>
                            ))}
                         </div>
                       )}
                   </>
               ) : (
                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                       <div className="flex justify-between items-center mb-6">
                           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Listing</h2>
                           <button onClick={() => setShowAddForm(false)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full"><X size={20} /></button>
                       </div>
                       
                       <form onSubmit={handleAddSpace} className="space-y-6">
                           {/* ... (Form fields remain same, just rendering logic) ... */}
                           <div className="grid md:grid-cols-2 gap-6">
                               <div className="col-span-2">
                                   <label className="block text-sm font-medium mb-2 dark:text-gray-300">Property Title</label>
                                   <input required value={newSpace.title} onChange={e => setNewSpace({...newSpace, title: e.target.value})} className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700" placeholder="e.g. Skyline Executive Suite" />
                               </div>
                               
                               <div>
                                   <label className="block text-sm font-medium mb-2 dark:text-gray-300">Category</label>
                                   <select value={newSpace.category} onChange={e => setNewSpace({...newSpace, category: e.target.value})} className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700">
                                       {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                   </select>
                               </div>

                               <div className="grid grid-cols-2 gap-2">
                                   <div>
                                       <label className="block text-sm font-medium mb-2 dark:text-gray-300">Price (INR)</label>
                                       <input type="number" required value={newSpace.price} onChange={e => setNewSpace({...newSpace, price: Number(e.target.value)})} className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700" />
                                   </div>
                                   <div>
                                       <label className="block text-sm font-medium mb-2 dark:text-gray-300">Period</label>
                                       <select value={newSpace.period} onChange={e => setNewSpace({...newSpace, period: e.target.value})} className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700">
                                           <option value="hour">Per Hour</option>
                                           <option value="day">Per Day</option>
                                           <option value="month">Per Month</option>
                                       </select>
                                   </div>
                               </div>

                               <div>
                                   <label className="block text-sm font-medium mb-2 dark:text-gray-300">City / Area</label>
                                   <input required value={newSpace.location} onChange={e => setNewSpace({...newSpace, location: e.target.value})} className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700" placeholder="e.g. BKC, Mumbai" />
                               </div>
                               
                               <div>
                                   <label className="block text-sm font-medium mb-2 dark:text-gray-300">Full Address</label>
                                   <input required value={newSpace.address} onChange={e => setNewSpace({...newSpace, address: e.target.value})} className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700" />
                               </div>

                               <div className="grid grid-cols-2 gap-2">
                                  <div>
                                     <label className="block text-sm font-medium mb-2 dark:text-gray-300">Sq Ft</label>
                                     <input type="number" value={newSpace.sqFt} onChange={e => setNewSpace({...newSpace, sqFt: Number(e.target.value)})} className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700" />
                                  </div>
                                  <div>
                                     <label className="block text-sm font-medium mb-2 dark:text-gray-300">Capacity</label>
                                     <input type="number" value={newSpace.capacity} onChange={e => setNewSpace({...newSpace, capacity: Number(e.target.value)})} className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700" />
                                  </div>
                               </div>

                               <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <div className="col-span-2 text-xs text-gray-500 mb-1">Optional: Add coordinates for "Near Me" discovery</div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Latitude</label>
                                        <input type="number" step="any" value={newSpace.latitude || ''} onChange={e => setNewSpace({...newSpace, latitude: e.target.value ? parseFloat(e.target.value) : undefined})} className="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 text-sm" placeholder="e.g. 19.0760" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Longitude</label>
                                        <input type="number" step="any" value={newSpace.longitude || ''} onChange={e => setNewSpace({...newSpace, longitude: e.target.value ? parseFloat(e.target.value) : undefined})} className="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 text-sm" placeholder="e.g. 72.8777" />
                                    </div>
                               </div>

                               <div className="col-span-2">
                                   <label className="block text-sm font-medium mb-2 dark:text-gray-300">Description</label>
                                   <textarea required value={newSpace.description} onChange={e => setNewSpace({...newSpace, description: e.target.value})} className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 h-32" />
                               </div>

                               <div className="col-span-2">
                                   <label className="block text-sm font-medium mb-2 dark:text-gray-300">Main Display Image</label>
                                   <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => handleImageUpload(e, false)}
                                        />
                                        {newSpace.imageUrl ? (
                                            <div className="relative w-full h-48">
                                                <img src={newSpace.imageUrl} alt="Main" className="w-full h-full object-contain rounded-lg" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg text-white font-medium">Click to Change</div>
                                            </div>
                                        ) : (
                                            <>
                                                <UploadCloud size={32} className="text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-500">Click to upload Main Image</p>
                                            </>
                                        )}
                                   </div>
                               </div>

                               <div className="col-span-2">
                                   <label className="block text-sm font-medium mb-2 dark:text-gray-300">Amenities</label>
                                   <div className="flex gap-2 mb-2">
                                       <input value={amenityInput} onChange={e => setAmenityInput(e.target.value)} className="flex-1 p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700" placeholder="Add amenity..." onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addAmenity())} />
                                       <button type="button" onClick={addAmenity} className="px-4 bg-gray-200 dark:bg-gray-700 rounded-lg">Add</button>
                                   </div>
                                   <div className="flex flex-wrap gap-2">
                                       {newSpace.amenities?.map((am, i) => (
                                           <span key={i} className="px-3 py-1 bg-corporate-50 dark:bg-corporate-900/30 text-corporate-700 dark:text-corporate-300 rounded-full text-sm flex items-center">
                                               {am} <button type="button" onClick={() => setNewSpace({...newSpace, amenities: newSpace.amenities?.filter((_, idx) => idx !== i)})} className="ml-2 hover:text-red-500"><X size={14}/></button>
                                           </span>
                                       ))}
                                   </div>
                               </div>

                               <div className="col-span-2">
                                   <label className="block text-sm font-medium mb-2 dark:text-gray-300">Gallery Photos</label>
                                   <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative mb-4">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            multiple
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => handleImageUpload(e, true)}
                                        />
                                        <div className="text-center">
                                            <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500">Click to upload gallery photos</p>
                                        </div>
                                   </div>
                                   
                                   <div className="grid grid-cols-4 gap-4">
                                       {newSpace.gallery?.map((url, i) => (
                                           <div key={i} className="relative aspect-square">
                                               <img src={url} className="w-full h-full object-cover rounded-lg" alt={`Gallery ${i}`} />
                                               <button type="button" onClick={() => setNewSpace({...newSpace, gallery: newSpace.gallery?.filter((_, idx) => idx !== i)})} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"><X size={12}/></button>
                                           </div>
                                       ))}
                                   </div>
                               </div>

                           </div>
                           
                           <div className="flex justify-end pt-6">
                               <button type="submit" className="flex items-center px-8 py-3 bg-corporate-600 text-white rounded-xl font-bold shadow-lg shadow-corporate-500/30 hover:bg-corporate-700 transition-all">
                                   <Save size={18} className="mr-2" /> Publish Listing
                               </button>
                           </div>
                       </form>
                   </motion.div>
               )}
            </div>
          )}

          {activeTab === 'enquiries' && (
            <div>
              {enquiries.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl">
                   <p className="text-gray-500 dark:text-gray-400">No enquiries received yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enquiries.map((req) => (
                    <div key={req.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{req.userName}</h3>
                            <p className="text-sm text-gray-500">Interested in: <span className="font-medium text-corporate-600">{req.spaceTitle}</span></p>
                          </div>
                          <span className="text-xs text-gray-400">{new Date(req.date).toLocaleDateString()}</span>
                       </div>
                       
                       <p className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-gray-600 dark:text-gray-300 italic mb-4">
                         "{req.message}"
                       </p>

                       <div className="flex gap-4">
                          <a href={`tel:${req.userMobile}`} className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-corporate-500">
                             <Phone size={16} className="mr-2" /> {req.userMobile}
                          </a>
                          <a href={`mailto:${req.userEmail}`} className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-corporate-500">
                             <Mail size={16} className="mr-2" /> {req.userEmail}
                          </a>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
              <div className="space-y-8">
                  <div className="flex items-center space-x-4 mb-6">
                      <label className="text-gray-700 dark:text-gray-300 font-medium">Select Listing:</label>
                      <select 
                        value={selectedSpaceId}
                        onChange={(e) => setSelectedSpaceId(e.target.value)}
                        className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-corporate-500"
                      >
                          <option value="all">All Listings</option>
                          {listings.map(l => (
                              <option key={l.id} value={l.id}>{l.title}</option>
                          ))}
                      </select>
                  </div>

                  {/* Analytics Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                          <div>
                              <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Total Views</p>
                              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{analyticsData.totalViews}</h3>
                              <span className="text-green-500 text-xs font-semibold flex items-center mt-2"><TrendingUp size={12} className="mr-1"/> +12% this week</span>
                          </div>
                          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
                              <Eye size={24} />
                          </div>
                      </motion.div>

                      <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                          <div>
                              <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Enquiries</p>
                              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{analyticsData.totalEnquiries}</h3>
                              <span className="text-corporate-500 text-xs font-semibold flex items-center mt-2"><MousePointerClick size={12} className="mr-1"/> {analyticsData.totalEnquiries > 0 ? 'Active Interest' : 'No activity yet'}</span>
                          </div>
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                              <MessageSquare size={24} />
                          </div>
                      </motion.div>

                      <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                          <div>
                              <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Conversion Rate</p>
                              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{analyticsData.conversionRate}%</h3>
                              <span className="text-gray-400 text-xs mt-2 block">Views to Enquiries</span>
                          </div>
                          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                              <Users size={24} />
                          </div>
                      </motion.div>
                  </div>

                  {/* Charts */}
                  <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-80 flex flex-col">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Views Trend (Last 7 Days)</h4>
                          <div className="flex-1 w-full">
                              <AreaChart data={analyticsData.viewsTrend} color="#8b5cf6" />
                          </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-80 flex flex-col">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Enquiries Trend (Last 7 Days)</h4>
                          <div className="flex-1 w-full">
                               <AreaChart data={analyticsData.enquiriesTrend} color="#3b82f6" />
                          </div>
                      </div>
                  </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
