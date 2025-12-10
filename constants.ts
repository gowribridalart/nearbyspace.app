

import { Space, Review, TeamMember } from './types';

export const SPACES: Space[] = [
  {
    id: '1',
    ownerId: 'owner_1',
    title: 'Skyline Executive Suite',
    category: 'Private Cabin / Private Office',
    price: 12000,
    period: 'hour',
    location: 'Bandra Kurla Complex, Mumbai',
    address: '101 Tech Plaza, Suite 4500, BKC, Mumbai, MH 400051',
    description: 'A premium corner office with panoramic views of the city skyline. Features ergonomic Herman Miller furniture, state-of-the-art teleconferencing equipment, and a private breakout area. Perfect for high-stakes board meetings and client presentations.',
    amenities: ['High-Speed WiFi', 'Video Conferencing', 'Chai/Coffee Bar', 'Concierge', 'Soundproof'],
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1000&auto=format&fit=crop'
    ],
    ownerName: 'Priya Sharma',
    ownerPhone: '919876543210',
    ownerEmail: 'priya.sharma@prestige.com',
    sqFt: 850,
    capacity: 12,
    latitude: 19.0674,
    longitude: 72.8681,
    views: 1245
  },
  {
    id: '2',
    ownerId: 'owner_2',
    title: 'The Industrial Loft Event Hall',
    category: 'Event Spaces',
    price: 85000,
    period: 'day',
    location: 'Indiranagar, Bangalore',
    address: '45 Fabric Row, Floor 2, Indiranagar, KA 560038',
    description: 'Expansive converted warehouse space featuring exposed brick walls, high timber ceilings, and polished concrete floors. Natural light floods in through floor-to-ceiling industrial windows. Ideal for product launches, art galleries, and corporate mixers.',
    amenities: ['Catering Kitchen', 'Projector System', 'Valet Parking', 'Wheelchair Access', 'Custom Lighting'],
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop'
    ],
    ownerName: 'Rahul Verma',
    ownerPhone: '919988776655',
    ownerEmail: 'rahul@creativevenues.io',
    sqFt: 2500,
    capacity: 150,
    latitude: 12.9716,
    longitude: 77.6412,
    views: 3420
  },
  {
    id: '3',
    ownerId: 'owner_3',
    title: 'Creator Studio B',
    category: 'Creator / Studio Rooms',
    price: 5000,
    period: 'hour',
    location: 'Hauz Khas, Delhi',
    address: '88 Creative Blvd, Studio B, Hauz Khas Village, New Delhi 110016',
    description: 'A pristine white cyc wall studio designed for professional photography and videography. Includes Profoto lighting gear, grip equipment, and a dedicated makeup/changing station. The acoustic treatment makes it suitable for audio recording as well.',
    amenities: ['Cyc Wall', 'Lighting Gear', 'Green Screen', 'Makeup Station', 'Bluetooth Audio'],
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop'
    ],
    ownerName: 'Anjali Desai',
    ownerPhone: '918877665544',
    ownerEmail: 'anjali@studios.net',
    sqFt: 600,
    capacity: 8,
    latitude: 28.5494,
    longitude: 77.1942,
    views: 890
  },
  {
    id: '4',
    ownerId: 'owner_4',
    title: 'StartUp Flexi Zone',
    category: 'Hot Desk',
    price: 8000,
    period: 'month',
    location: 'Jubilee Hills, Hyderabad',
    address: '202 Fashion Ave, Ground Floor, Jubilee Hills, TS 500033',
    description: 'Vibrant coworking area with flexible seating options. Perfect for freelancers and early-stage startups. Includes access to community events, high-speed internet, and unlimited chai.',
    amenities: ['High-Speed WiFi', 'Community Events', 'Unlimited Chai', 'Power Backup', 'Printer Access'],
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504384308090-c54be3853247?q=80&w=1000&auto=format&fit=crop'
    ],
    ownerName: 'Vikram Singh',
    ownerPhone: '917766554433',
    ownerEmail: 'vikram.s@cowork.com',
    sqFt: 400,
    capacity: 20,
    latitude: 17.4326,
    longitude: 78.4071,
    views: 1560
  },
  {
    id: '5',
    ownerId: 'owner_1',
    title: 'Blue Room Conference Hall',
    category: 'Conference / Training Rooms',
    price: 3000,
    period: 'hour',
    location: 'Cyber City, Gurugram',
    address: 'Building 10, Tower A, Cyber City, HR 122002',
    description: 'Fully equipped training room with projector, whiteboard, and modular seating. Ideal for workshops, corporate training sessions, and large team meetings.',
    amenities: ['Projector', 'Whiteboard', 'Modular Seating', 'Catering Available', 'AC'],
    imageUrl: 'https://images.unsplash.com/photo-1517502884422-41e157d258b4?q=80&w=1000&auto=format&fit=crop',
    gallery: [
       'https://images.unsplash.com/photo-1517502884422-41e157d258b4?q=80&w=1000&auto=format&fit=crop',
       'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=1000&auto=format&fit=crop'
    ],
    ownerName: 'Priya Sharma',
    ownerPhone: '919876543210',
    ownerEmail: 'priya@techpark.com',
    sqFt: 1000,
    capacity: 30,
    latitude: 28.4950,
    longitude: 77.0895,
    views: 450
  }
];

export const REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Neha Gupta',
    role: 'Event Director',
    company: 'Tech Summit India',
    content: 'NearbySpace transformed how we source venues. The "Skyline Executive Suite" in Mumbai was impeccable for our board meeting. The booking process was seamless.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    name: 'Arjun Mehta',
    role: 'Freelance Photographer',
    company: 'Lens & Light',
    content: 'Finding a studio with the right gear included is usually a nightmare. This platform made it effortless. The direct WhatsApp connection to the owner saved me hours.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    name: 'Kavita Reddy',
    role: 'Founder',
    company: 'Zenith Ethnic Wear',
    content: 'We launched our pop-up store using a space we found here. The premium presentation of the listings gave us confidence, and the reality matched the photos perfectly.',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&h=150&fit=crop'
  }
];

export const TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Aditya Kapoor',
    role: 'CEO & Founder',
    bio: 'Former architect with a passion for adaptive reuse and urban planning.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=500&fit=crop'
  },
  {
    id: '2',
    name: 'Mira Nair',
    role: 'Head of Design',
    bio: 'Award-winning interior designer ensuring every listing meets our aesthetic standards.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&h=500&fit=crop'
  },
  {
    id: '3',
    name: 'Rohan Malhotra',
    role: 'CTO',
    bio: 'Tech veteran focused on creating seamless, invisible digital experiences.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&h=500&fit=crop'
  }
];