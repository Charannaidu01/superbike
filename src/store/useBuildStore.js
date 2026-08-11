import { create } from 'zustand';
import { PARTS_CATALOG, BIKE_MODELS_DB } from '../services/aiService';

// Default explore builds
const DEFAULT_EXPLORE_BUILDS = [
  {
    id: 'b-1',
    bike: 'Royal Enfield Classic 350',
    title: 'Stealth Bomber Custom',
    creator: 'Vikram_Rider',
    likes: 124,
    cost: 39500,
    paint: 'paint-matte-black',
    wheels: 'wheels-alloy-black',
    exhaust: 'exhaust-slip-on',
    seat: 'seat-touring',
    accessories: ['acc-mirrors', 'acc-crashguard'],
    category: 'Cafe Racer',
    notes: 'Built for urban cruising. Matte black finish matches street lighting.'
  },
  {
    id: 'b-2',
    bike: 'KTM Duke 390',
    title: 'Track Performance Spec',
    creator: 'ApexHunter',
    likes: 89,
    cost: 54000,
    paint: 'paint-racing-red',
    wheels: 'wheels-alloy-performance',
    exhaust: 'exhaust-slip-on',
    seat: 'seat-split',
    accessories: ['acc-mirrors', 'acc-phonemount'],
    category: 'Performance',
    notes: 'Optimized for weekend track days and throttle response.'
  }
];

// Prepopulated Peer-to-Peer listings
const DEFAULT_LISTINGS = [
  {
    id: 'lst-1',
    user_id: 'usr-2',
    sellerName: 'Vikram Singh',
    type: 'bike',
    title: '2023 Royal Enfield Classic 350 Chrome',
    manufacturer: 'Royal Enfield',
    model: 'Classic 350',
    variant: 'Chrome Bronze',
    year: 2023,
    kilometers: 12500,
    engineCapacity: 349,
    condition: 'Excellent',
    location: 'Chennai',
    price: 165000,
    description: 'Very well maintained Chrome Bronze Classic 350. Sump guard installed. Single owner, insurance current.',
    contactPreference: 'Chat Only',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop',
    status: 'active', // 'active', 'sold', 'draft'
    views: 142,
    datePosted: '2026-08-01'
  },
  {
    id: 'lst-2',
    user_id: 'usr-3',
    sellerName: 'Karthik Cruiser',
    type: 'part',
    title: 'Black Alloy Wheels for Classic 350',
    productName: 'RE Alloy Wheel Kit',
    category: 'Wheels',
    brand: 'AlloyTech',
    compatibleBike: 'Royal Enfield Classic 350',
    condition: 'Like New',
    price: 11500,
    quantity: 1,
    description: 'Hardly used alloys. Tubeless tyre compatible. Upgraded to spoke wheels, selling this set.',
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop',
    location: 'Bangalore',
    status: 'active',
    views: 89,
    datePosted: '2026-08-04'
  }
];

export const useBuildStore = create((set, get) => ({
  // Auth state (Unified)
  user: null, // null when Guest
  isLoggedIn: false, // Default false to support Guest preview mode first

  // Selected vehicle for customisation
  selectedBike: BIKE_MODELS_DB[0],
  ridingStyle: 'Touring',
  budgetMode: 'Mid Range',
  customBudget: 40000,

  // Active modifications in studio
  modifications: {
    Paint: 'paint-matte-black',
    Wheels: 'wheels-alloy-black',
    Exhaust: 'exhaust-slip-on',
    Seat: 'seat-touring',
    Lighting: 'light-led-headlight',
    Accessories: ['acc-crashguard', 'acc-mirrors']
  },

  // User's Garage
  garage: [
    {
      id: 'g-1',
      modelId: 're-classic-350',
      manufacturer: 'Royal Enfield',
      model: 'Classic 350',
      year: 2022,
      category: 'Cruiser',
      photoUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop',
      totalBuilds: 1,
      totalSpend: 39500
    }
  ],

  // Saved Builds
  savedBuilds: [
    {
      id: 'sb-1',
      title: 'Stealth Blackout Classic 350',
      bike: 'Royal Enfield Classic 350',
      notes: 'Matte black paint scheme with black alloys and silent exhaust.',
      cost: 39500,
      modifications: {
        Paint: 'paint-matte-black',
        Wheels: 'wheels-alloy-black',
        Exhaust: 'exhaust-slip-on',
        Seat: 'seat-touring',
        Lighting: 'light-led-headlight',
        Accessories: ['acc-crashguard', 'acc-mirrors']
      },
      createdAt: '2026-08-05'
    }
  ],

  // Customization History
  customizationHistory: [
    {
      id: 'ch-1',
      bike: 'Royal Enfield Classic 350',
      originalImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop',
      modifications: { Paint: 'paint-matte-black', Wheels: 'wheels-alloy-black' },
      cost: 22000,
      date: '2026-08-01'
    }
  ],

  // Parts matrix
  parts: [...PARTS_CATALOG],

  // Peer-to-peer listings
  listings: [...DEFAULT_LISTINGS],

  // Explore builds feed
  exploreBuilds: [...DEFAULT_EXPLORE_BUILDS],

  // Chat conversations
  conversations: [
    {
      id: 'conv-1',
      recipientId: 'usr-2',
      recipientName: 'Vikram Singh',
      listing: {
        id: 'lst-1',
        title: '2023 Royal Enfield Classic 350 Chrome',
        price: 165000,
        imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop'
      },
      messages: [
        { id: 'm-1', senderId: 'usr-2', text: 'Hey, are you interested in the Classic 350 Chrome?', timestamp: '10:30 AM' }
      ]
    }
  ],

  // Favorites
  favoriteParts: [],

  // Notifications
  notifications: [
    { id: 'n-1', title: 'Welcome to RideVision', message: 'Continue with Google to unlock custom builds, listing creations, and real-time chat.', read: false, time: 'Just now' }
  ],

  // Real Supabase authentication state
  setAuthUser: (authUser) => set({
    isLoggedIn: Boolean(authUser),
    user: authUser ? {
      id: authUser.id,
      name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Rider',
      email: authUser.email || '',
      phone: authUser.user_metadata?.phone || '',
      photo: authUser.user_metadata?.avatar_url || '',
      bio: authUser.user_metadata?.bio || '',
      location: authUser.user_metadata?.location || ''
    } : null,
    notifications: authUser ? [{
      id: `n-${Date.now()}`,
      title: 'Signed In',
      message: 'Your RideVision account is active.',
      read: false,
      time: 'Just now'
    }, ...get().notifications] : get().notifications
  }),

  logout: () => set({
    isLoggedIn: false,
    user: null,
    conversations: [],
    notifications: [{
      id: `n-${Date.now()}`,
      title: 'Logged Out',
      message: 'You have signed out. Using RideVision as a Guest.',
      read: false,
      time: 'Just now'
    }]
  }),

  setUserProfileDetails: (details) => set(state => ({
    user: {
      ...state.user,
      ...details
    }
  })),

  // Studio actions
  setSelectedBike: (bike) => set({ selectedBike: bike }),
  setRidingStyle: (style) => set({ ridingStyle: style }),
  setBudgetMode: (mode) => set({ budgetMode: mode }),
  setCustomBudget: (budget) => set({ customBudget: budget }),
  
  updateModification: (category, partId) => set(state => {
    const mods = { ...state.modifications };
    if (category === 'Accessories') {
      const idx = mods.Accessories.indexOf(partId);
      if (idx > -1) {
        mods.Accessories = mods.Accessories.filter(id => id !== partId);
      } else {
        mods.Accessories = [...mods.Accessories, partId];
      }
    } else {
      mods[category] = partId;
    }
    return { modifications: mods };
  }),

  setFullModifications: (newMods) => set({ modifications: newMods }),

  // Garage and build actions
  addBikeToGarage: (newBike) => set(state => ({
    garage: [...state.garage, {
      id: `g-${Date.now()}`,
      modelId: newBike.id || 'custom',
      manufacturer: newBike.manufacturer,
      model: newBike.model,
      year: newBike.year,
      category: newBike.category,
      photoUrl: newBike.imageUrl,
      totalBuilds: 0,
      totalSpend: 0
    }]
  })),

  saveBuild: (title, notes = '') => set(state => {
    let cost = 0;
    Object.entries(state.modifications).forEach(([category, val]) => {
      if (category === 'Accessories') {
        val.forEach(pId => {
          const part = state.parts.find(p => p.id === pId);
          if (part) cost += part.price + part.installationCost;
        });
      } else {
        const part = state.parts.find(p => p.id === val);
        if (part) cost += part.price + part.installationCost;
      }
    });

    const newBuild = {
      id: `sb-${Date.now()}`,
      title,
      bike: state.selectedBike.model,
      notes,
      cost,
      modifications: { ...state.modifications },
      createdAt: new Date().toISOString().split('T')[0]
    };

    const historyItem = {
      id: `ch-${Date.now()}`,
      bike: state.selectedBike.model,
      originalImage: state.selectedBike.imageUrl,
      modifications: { ...state.modifications },
      cost,
      date: new Date().toISOString().split('T')[0]
    };

    return {
      savedBuilds: [newBuild, ...state.savedBuilds],
      customizationHistory: [historyItem, ...state.customizationHistory],
      notifications: [{
        id: `n-${Date.now()}`,
        title: 'Build Saved',
        message: `Your build configuration "${title}" was saved.`,
        read: false,
        time: 'Just now'
      }, ...state.notifications]
    };
  }),

  deleteBuild: (buildId) => set(state => ({
    savedBuilds: state.savedBuilds.filter(b => b.id !== buildId)
  })),

  duplicateBuild: (buildId) => set(state => {
    const build = state.savedBuilds.find(b => b.id === buildId);
    if (!build) return {};
    return {
      savedBuilds: [{
        ...build,
        id: `sb-${Date.now()}`,
        title: `${build.title} (Copy)`,
        createdAt: new Date().toISOString().split('T')[0]
      }, ...state.savedBuilds]
    };
  }),

  renameBuild: (buildId, newTitle) => set(state => ({
    savedBuilds: state.savedBuilds.map(b => b.id === buildId ? { ...b, title: newTitle } : b)
  })),

  // Peer-to-peer listings actions
  addListing: (newListing) => set(state => {
    const listing = {
      id: `lst-${Date.now()}`,
      user_id: state.user?.id || 'usr-guest',
      sellerName: state.user?.name || 'Guest Seller',
      status: 'active',
      views: 0,
      datePosted: new Date().toISOString().split('T')[0],
      ...newListing
    };

    return {
      listings: [listing, ...state.listings],
      notifications: [{
        id: `n-${Date.now()}`,
        title: 'Listing Published',
        message: `Your ${listing.type} listing "${listing.title}" is now live.`,
        read: false,
        time: 'Just now'
      }, ...state.notifications]
    };
  }),

  editListing: (id, fields) => set(state => ({
    listings: state.listings.map(l => l.id === id ? { ...l, ...fields } : l)
  })),

  deleteListing: (id) => set(state => ({
    listings: state.listings.filter(l => l.id !== id)
  })),

  markListingAsSold: (id) => set(state => ({
    listings: state.listings.map(l => l.id === id ? { ...l, status: 'sold' } : l),
    notifications: [{
      id: `n-${Date.now()}`,
      title: 'Item Sold',
      message: 'Listing status updated to SOLD.',
      read: false,
      time: 'Just now'
    }, ...state.notifications]
  })),

  // P2P Chat messaging actions
  createConversation: (listing, sellerName, sellerId) => {
    const state = get();
    // Check if conversation already exists for this listing
    const existing = state.conversations.find(c => c.listing.id === listing.id);
    if (existing) return existing.id;

    const newId = `conv-${Date.now()}`;
    const newConv = {
      id: newId,
      recipientId: sellerId,
      recipientName: sellerName,
      listing: {
        id: listing.id,
        title: listing.title,
        price: listing.price,
        imageUrl: listing.imageUrl
      },
      messages: [
        { id: `m-${Date.now()}`, senderId: 'system', text: `Inquiry request regarding "${listing.title}"`, timestamp: 'Just now' }
      ]
    };

    set({ conversations: [newConv, ...state.conversations] });
    return newId;
  },

  sendMessage: (conversationId, text) => set(state => {
    const list = state.conversations.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          messages: [...c.messages, {
            id: `m-${Date.now()}`,
            senderId: state.user?.id || 'usr-guest',
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]
        };
      }
      return c;
    });

    return { 
      conversations: list,
      notifications: [{
        id: `n-${Date.now()}`,
        title: 'New Message',
        message: 'Your message has been delivered.',
        read: false,
        time: 'Just now'
      }, ...state.notifications]
    };
  }),

  // Favorites
  toggleFavoritePart: (partId) => set(state => {
    const favs = [...state.favoriteParts];
    const idx = favs.indexOf(partId);
    if (idx > -1) {
      return { favoriteParts: favs.filter(id => id !== partId) };
    } else {
      return { favoriteParts: [...favs, partId] };
    }
  }),

  // Notifications clear
  clearNotification: (id) => set(state => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  markAllNotificationsRead: () => set(state => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  }))
}));
