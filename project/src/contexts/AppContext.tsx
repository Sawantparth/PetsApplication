import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Pet {
  id: string;
  name: string;
  age: number;
  breed: string;
  bio: string;
  photos: string[];
  location: string;
  distance: number;
  verified: boolean;
  interests: string[];
  size: 'small' | 'medium' | 'large';
  energy: 'low' | 'medium' | 'high';
  personality: string[];
  ownerName: string;
  petType: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  vaccinated: boolean;
  spayedNeutered: boolean;
  goodWith: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'pet-parent' | 'organization' | 'pet-store' | 'veterinarian';
  verified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  profilePhoto: string;
  bio: string;
  location: string;
  specialties?: string[]; // For vets
  services?: string[]; // For pet stores
  organizationType?: string; // For organizations
  businessHours?: string; // For businesses
  contactInfo: {
    phone?: string;
    website?: string;
    address?: string;
  };
  pets?: Pet[]; // Only for pet parents
  joinedAt: Date;
  rating?: number;
  reviews?: Review[];
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface Match {
  id: string;
  pet?: Pet; // For pet parent matches
  user?: User; // For business/organization matches
  matchedAt: Date;
  hasUnreadMessages: boolean;
  matchType: 'pet-playdate' | 'business-service' | 'organization-support';
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  messageType: 'text' | 'appointment-request' | 'service-inquiry' | 'support-request';
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  currentPet: Pet | null;
  setCurrentPet: (pet: Pet | null) => void;
  discoveryPets: Pet[];
  discoveryUsers: User[];
  matches: Match[];
  messages: Message[];
  likedPets: string[];
  passedPets: string[];
  swipePet: (petId: string, action: 'like' | 'pass' | 'superlike') => void;
  connectWithUser: (userId: string, connectionType: string) => void;
  sendMessage: (matchId: string, content: string, messageType?: string) => void;
  markMessagesAsRead: (matchId: string) => void;
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  filters: {
    minAge: number;
    maxAge: number;
    maxDistance: number;
    petType: string;
    size: string;
    userType: string;
  };
  setFilters: (filters: any) => void;
  submitVerificationRequest: (documents: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const samplePets: Pet[] = [
  {
    id: '1',
    name: 'Bella',
    age: 3,
    breed: 'Golden Retriever',
    bio: 'Friendly golden girl who loves fetch and making new friends! 🎾 Great with kids and other dogs. Looking for playmates who enjoy long walks and park adventures!',
    photos: ['https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg'],
    location: 'Central Park Area',
    distance: 2,
    verified: true,
    interests: ['Fetch', 'Swimming', 'Hiking', 'Dog Parks'],
    size: 'large',
    energy: 'high',
    personality: ['Friendly', 'Energetic', 'Social'],
    ownerName: 'Sarah',
    petType: 'dog',
    vaccinated: true,
    spayedNeutered: true,
    goodWith: ['Dogs', 'Kids', 'Cats']
  },
  {
    id: '2',
    name: 'Max',
    age: 2,
    breed: 'French Bulldog',
    bio: 'Charming little guy with a big personality! 🐾 Loves cuddles and short walks. Perfect for apartment living friends!',
    photos: ['https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg'],
    location: 'Downtown',
    distance: 5,
    verified: false,
    interests: ['Napping', 'Treats', 'Short Walks', 'Socializing'],
    size: 'small',
    energy: 'medium',
    personality: ['Calm', 'Affectionate', 'Playful'],
    ownerName: 'Mike',
    petType: 'dog',
    vaccinated: true,
    spayedNeutered: true,
    goodWith: ['Dogs', 'Kids']
  }
];

const sampleUsers: User[] = [
  {
    id: 'vet-1',
    name: 'Dr. Emily Chen',
    email: 'dr.chen@pawcare.com',
    userType: 'veterinarian',
    verified: true,
    verificationStatus: 'approved',
    profilePhoto: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg',
    bio: 'Experienced veterinarian specializing in small animal care. Here to help new pet parents with health questions and guidance! 🩺',
    location: 'Downtown Veterinary Clinic',
    specialties: ['Small Animal Medicine', 'Preventive Care', 'Emergency Medicine'],
    businessHours: 'Mon-Fri 8AM-6PM, Sat 9AM-4PM',
    contactInfo: {
      phone: '(555) 123-4567',
      website: 'www.pawcare.com',
      address: '123 Main St, Downtown'
    },
    joinedAt: new Date('2023-01-15'),
    rating: 4.9,
    reviews: []
  },
  {
    id: 'store-1',
    name: 'Pawsome Pet Supplies',
    email: 'info@pawsomepets.com',
    userType: 'pet-store',
    verified: true,
    verificationStatus: 'approved',
    profilePhoto: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg',
    bio: 'Your neighborhood pet store with everything your furry friends need! Premium food, toys, grooming services, and expert advice. 🛍️',
    location: 'Pet District',
    services: ['Pet Food & Treats', 'Grooming Services', 'Pet Accessories', 'Training Supplies'],
    businessHours: 'Daily 9AM-8PM',
    contactInfo: {
      phone: '(555) 987-6543',
      website: 'www.pawsomepets.com',
      address: '456 Pet Avenue'
    },
    joinedAt: new Date('2023-03-20'),
    rating: 4.7,
    reviews: []
  },
  {
    id: 'org-1',
    name: 'Happy Tails Rescue',
    email: 'contact@happytailsrescue.org',
    userType: 'organization',
    verified: true,
    verificationStatus: 'approved',
    profilePhoto: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
    bio: 'Non-profit animal rescue dedicated to finding loving homes for pets in need. We also provide community education and support! 🏠❤️',
    location: 'Community Center',
    organizationType: 'Animal Rescue',
    services: ['Pet Adoption', 'Community Education', 'Volunteer Programs', 'Emergency Pet Care'],
    contactInfo: {
      phone: '(555) 456-7890',
      website: 'www.happytailsrescue.org',
      address: '789 Community Blvd'
    },
    joinedAt: new Date('2023-02-10'),
    rating: 4.8,
    reviews: []
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [discoveryPets, setDiscoveryPets] = useState<Pet[]>(samplePets);
  const [discoveryUsers, setDiscoveryUsers] = useState<User[]>(sampleUsers);
  const [matches, setMatches] = useState<Match[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [likedPets, setLikedPets] = useState<string[]>([]);
  const [passedPets, setPassedPets] = useState<string[]>([]);
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [filters, setFilters] = useState({
    minAge: 0,
    maxAge: 15,
    maxDistance: 25,
    petType: 'all',
    size: 'all',
    userType: 'all'
  });

  const swipePet = (petId: string, action: 'like' | 'pass' | 'superlike') => {
    const pet = discoveryPets.find(p => p.id === petId);
    if (!pet) return;

    if (action === 'like' || action === 'superlike') {
      setLikedPets(prev => [...prev, petId]);
      
      // Simulate mutual like (40% chance for demo)
      if (Math.random() < 0.4) {
        const newMatch: Match = {
          id: `match-${Date.now()}`,
          pet,
          matchedAt: new Date(),
          hasUnreadMessages: false,
          matchType: 'pet-playdate'
        };
        setMatches(prev => [newMatch, ...prev]);
      }
    } else {
      setPassedPets(prev => [...prev, petId]);
    }

    setDiscoveryPets(prev => prev.filter(p => p.id !== petId));
  };

  const connectWithUser = (userId: string, connectionType: string) => {
    const user = discoveryUsers.find(u => u.id === userId);
    if (!user) return;

    const newMatch: Match = {
      id: `match-${Date.now()}`,
      user,
      matchedAt: new Date(),
      hasUnreadMessages: false,
      matchType: connectionType as any
    };
    setMatches(prev => [newMatch, ...prev]);
  };

  const sendMessage = (matchId: string, content: string, messageType: string = 'text') => {
    if (!currentUser) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      matchId,
      senderId: currentUser.id,
      content,
      timestamp: new Date(),
      read: false,
      messageType: messageType as any
    };

    setMessages(prev => [...prev, newMessage]);
    
    setMatches(prev => prev.map(match => 
      match.id === matchId 
        ? { ...match, hasUnreadMessages: true }
        : match
    ));
  };

  const markMessagesAsRead = (matchId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.matchId === matchId ? { ...msg, read: true } : msg
    ));
    
    setMatches(prev => prev.map(match => 
      match.id === matchId 
        ? { ...match, hasUnreadMessages: false }
        : match
    ));
  };

  const submitVerificationRequest = (documents: any) => {
    // This would typically send documents to backend for manual review
    console.log('Verification documents submitted:', documents);
    // For demo, we'll just show a success message
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      currentPet,
      setCurrentPet,
      discoveryPets,
      discoveryUsers,
      matches,
      messages,
      likedPets,
      passedPets,
      swipePet,
      connectWithUser,
      sendMessage,
      markMessagesAsRead,
      currentScreen,
      setCurrentScreen,
      filters,
      setFilters,
      submitVerificationRequest
    }}>
      {children}
    </AppContext.Provider>
  );
};