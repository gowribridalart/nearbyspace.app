

import { Space, Owner, Enquiry } from '../types';
import { SPACES } from '../constants';

const STORAGE_KEYS = {
  OWNERS: 'nearby_owners',
  ENQUIRIES: 'nearby_enquiries',
  SPACES: 'nearby_spaces',
  CURRENT_USER: 'nearby_current_user'
};

export const db = {
  getOwners: (): Owner[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.OWNERS) || '[]');
    } catch { return []; }
  },
  
  saveOwner: (owner: Owner) => {
    const owners = db.getOwners();
    owners.push(owner);
    localStorage.setItem(STORAGE_KEYS.OWNERS, JSON.stringify(owners));
    db.setCurrentUser(owner);
  },

  login: (email: string): Owner | null => {
    const owners = db.getOwners();
    const user = owners.find(o => o.email.toLowerCase() === email.toLowerCase());
    if (user) {
      db.setCurrentUser(user);
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser: (): Owner | null => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
    } catch { return null; }
  },

  setCurrentUser: (user: Owner | null) => {
    if (user) localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getEnquiries: (ownerId: string): Enquiry[] => {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENQUIRIES) || '[]');
      return all.filter((e: Enquiry) => e.ownerId === ownerId);
    } catch { return []; }
  },

  saveEnquiry: (enquiry: Enquiry) => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENQUIRIES) || '[]');
    all.push(enquiry);
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(all));
  },

  saveSpace: (space: Space) => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.SPACES) || '[]');
    // Ensure views property exists
    if (space.views === undefined) {
        space.views = 0;
    }
    all.push(space);
    localStorage.setItem(STORAGE_KEYS.SPACES, JSON.stringify(all));
  },

  getAllSpaces: (): Space[] => {
    // Merge constants with local storage spaces
    const localSpaces = JSON.parse(localStorage.getItem(STORAGE_KEYS.SPACES) || '[]');
    // Ensure constant spaces have default views if accessed via this method (though constants.ts has them)
    const formattedConstants = SPACES.map(s => ({...s, views: s.views || 0}));
    return [...formattedConstants, ...localSpaces];
  },
  
  // Get spaces belonging to a specific owner
  getUserSpaces: (ownerId: string): Space[] => {
    const all = db.getAllSpaces();
    // Filter by ownerId, but also fallback to email matching for the hardcoded constant data
    const user = db.getCurrentUser();
    if (!user) return [];

    return all.filter(s => 
        (s.ownerId === ownerId) || 
        (s.ownerEmail && s.ownerEmail.toLowerCase() === user.email.toLowerCase())
    );
  }
};