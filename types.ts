

export type SpaceCategory = 
  | 'Hot Desk'
  | 'Dedicated Desk'
  | 'Private Cabin / Private Office'
  | 'Meeting Rooms'
  | 'Conference / Training Rooms'
  | 'Virtual Office'
  | 'Day Pass / Hourly Pass Areas'
  | 'Event Spaces'
  | 'Creator / Studio Rooms'
  | 'Phone Booths / Quiet Pods'
  | 'Flexi Zones'
  | 'Dedicated Team Suites'
  | 'Pantry / Café Zones'
  | 'Breakout Spaces'
  | 'Storage / Locker Zones'
  | 'Parking Slots'
  | 'Outdoor Working Spaces'
  | 'Utility / Service Rooms'
  | 'Managed Office'
  | 'Enterprise Suites';

export interface Space {
  id: string;
  ownerId?: string;
  title: string;
  category: SpaceCategory | string; // Allow string for flexibility with new categories
  price: number;
  period: 'hour' | 'day' | 'month';
  location: string;
  address: string;
  description: string;
  amenities: string[];
  imageUrl: string;
  gallery: string[];
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  sqFt: number;
  capacity: number;
  latitude?: number;
  longitude?: number;
  distance?: number; // Calculated distance for geolocation features
  views: number; // Added for analytics
}

export interface Review {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  joinedAt: string;
}

export interface Enquiry {
  id: string;
  spaceId: string;
  spaceTitle: string;
  ownerId: string;
  userName: string;
  userMobile: string;
  userEmail: string;
  message: string;
  date: string;
}