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
  karmaPoints: number;
  badges: Badge[];
  showCommunityActivityOnMatchProfile: boolean; // New privacy setting
}

// --- Badge Interface ---
export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  dateAwarded: Date;
}
// --- End Badge Interface ---

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

// --- Community Feature Data Structures ---
export interface Comment {
  id: string;
  authorId: string;
  postId: string;
  content: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  authorId: string;
  communityId: string;
  content: string;
  mediaUrl?: string;
  createdAt: Date;
  comments: Comment[];
}

export interface Community {
  id: string;
  name: string;
  description: string;
  type: 'dog' | 'cat' | 'topic' | 'interest' | 'other'; // Added 'other'
  memberIds: string[];
  posts: Post[];
}

export interface CommunityEvent {
  id: string;
  name: string;
  description: string;
  communityId: string;
  location: string;
  dateTime: Date;
  attendees: string[];
}
// --- End Community Feature Data Structures ---

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  currentPet: Pet | null;
  setCurrentPet: (pet: Pet | null) => void;
  discoveryPets: Pet[];
  discoveryUsers: User[];
  matches: Match[];
  messages: Message[];
  // Community State
  communities: Community[];
  communityEvents: CommunityEvent[];
  // End Community State
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
  // Community Functions
  createCommunity: (communityData: Omit<Community, 'id' | 'memberIds' | 'posts'>) => void;
  addPostToCommunity: (communityId: string, postData: Omit<Post, 'id' | 'communityId' | 'createdAt' | 'comments' | 'authorId'>) => void; // Added authorId to omit
  addCommentToPost: (postId: string, commentData: Omit<Comment, 'id' | 'postId' | 'createdAt' | 'authorId'>) => void; // Added authorId to omit
  createCommunityEvent: (eventDetails: { communityId: string; name: string; description: string; location: string; dateTime: Date }) => void;
  joinEvent: (eventId: string, userId: string) => void;
  leaveEvent: (eventId: string, userId: string) => void; // New function
  joinCommunity: (communityId: string, userId: string) => void;
  leaveCommunity: (communityId: string, userId: string) => void;
  // Karma and Badges Functions
  awardKarma: (userId: string, points: number) => void;
  awardBadge: (userId: string, badgeName: string) => void;
  updateProfilePrivacySettings: (settings: { showCommunityActivityOnMatchProfile: boolean }) => void; // New function
  // End Karma and Badges Functions
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
    reviews: [],
    karmaPoints: 0,
    badges: [],
    showCommunityActivityOnMatchProfile: false
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
    reviews: [],
    karmaPoints: 0,
    badges: [],
    showCommunityActivityOnMatchProfile: false // Added missing field
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
    reviews: [],
    karmaPoints: 0,
    badges: [],
    showCommunityActivityOnMatchProfile: false // Added missing field
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [discoveryPets, setDiscoveryPets] = useState<Pet[]>(samplePets);
  const [discoveryUsers, setDiscoveryUsers] = useState<User[]>(sampleUsers);
  const [matches, setMatches] = useState<Match[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  // Community State Initialization
  const [communities, setCommunities] = useState<Community[]>([]);
  const [communityEvents, setCommunityEvents] = useState<CommunityEvent[]>([]);
  // End Community State Initialization
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

  // --- Community Feature Functions ---
  const createCommunity = (communityData: Omit<Community, 'id' | 'memberIds' | 'posts'>) => {
    if (!currentUser) return;
    const newCommunity: Community = {
      id: `comm-${Date.now()}`,
      ...communityData,
      memberIds: [currentUser.id], // Creator is the first member
      posts: [],
    };
    setCommunities(prev => [newCommunity, ...prev]);
    console.log('Community created:', newCommunity);
  };

  const addPostToCommunity = (communityId: string, postData: Omit<Post, 'id' | 'communityId' | 'createdAt' | 'comments' | 'authorId'>) => {
    if (!currentUser) return;
    const newPost: Post = {
      id: `post-${Date.now()}`,
      communityId,
      authorId: currentUser.id,
      ...postData,
      createdAt: new Date(),
      comments: [],
    };
    setCommunities(prev => prev.map(c =>
      c.id === communityId ? { ...c, posts: [newPost, ...c.posts] } : c
    ));
    console.log('Post added to community:', communityId, newPost);
  };

  const addCommentToPost = (postId: string, commentData: Omit<Comment, 'id' | 'postId' | 'createdAt' | 'authorId'>) => {
    if (!currentUser) return;
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      authorId: currentUser.id,
      ...commentData,
      createdAt: new Date(),
    };
    setCommunities(prev => prev.map(c => ({
      ...c,
      posts: c.posts.map(p =>
        p.id === postId ? { ...p, comments: [newComment, ...p.comments] } : p
      )
    })));
    console.log('Comment added to post:', postId, newComment);
  };

  const createCommunityEvent = (eventDetails: { communityId: string; name: string; description: string; location: string; dateTime: Date }) => {
    if (!currentUser) return;
    const newEvent: CommunityEvent = {
      id: `event-${Date.now()}`,
      communityId: eventDetails.communityId,
      name: eventDetails.name,
      description: eventDetails.description,
      location: eventDetails.location,
      dateTime: eventDetails.dateTime,
      attendees: [currentUser.id], // Creator is the first attendee
    };
    setCommunityEvents(prev => [newEvent, ...prev]);
    console.log('Community event created:', newEvent);
  };

  const joinEvent = (eventId: string, userId: string) => {
    if (!currentUser || currentUser.id !== userId) return;
    setCommunityEvents(prev => prev.map(e =>
      e.id === eventId && !e.attendees.includes(userId)
        ? { ...e, attendees: [...e.attendees, userId] }
        : e
    ));
    console.log('User', userId, 'joined event:', eventId);
  };

  const leaveEvent = (eventId: string, userId: string) => {
    if (!currentUser || currentUser.id !== userId) return;
    setCommunityEvents(prev => prev.map(e =>
      e.id === eventId && e.attendees.includes(userId)
        ? { ...e, attendees: e.attendees.filter(id => id !== userId) }
        : e
    ));
    console.log('User', userId, 'left event:', eventId);
  };

  const joinCommunity = (communityId: string, userId: string) => {
    if (!currentUser || currentUser.id !== userId) return;
    setCommunities(prev => prev.map(c =>
      c.id === communityId && !c.memberIds.includes(userId)
        ? { ...c, memberIds: [...c.memberIds, userId] }
        : c
    ));
    console.log('User', userId, 'joined community:', communityId);
  };

  const updateProfilePrivacySettings = (settings: { showCommunityActivityOnMatchProfile: boolean }) => {
    if (!currentUser) return;
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      console.log(`Updating privacy settings for ${prevUser.id}:`, settings);
      return { ...prevUser, ...settings };
    });
    // Also update discoveryUsers if the user is in there
    setDiscoveryUsers(prevUsers => prevUsers.map(user =>
      user.id === currentUser.id ? { ...user, ...settings } : user
    ));
  };

  const leaveCommunity = (communityId: string, userId: string) => {
    if (!currentUser || currentUser.id !== userId) return;
    setCommunities(prev => prev.map(c =>
      c.id === communityId && c.memberIds.includes(userId)
        ? { ...c, memberIds: c.memberIds.filter(id => id !== userId) }
        : c
    ));
    console.log('User', userId, 'left community:', communityId);
  };
  // --- End Community Feature Functions ---

  // --- Karma and Badge Functions ---
  const BADGE_DEFINITIONS: Omit<Badge, 'id' | 'dateAwarded'>[] = [
    { name: 'First Post', description: 'Awarded for making your first post in any community.', iconUrl: 'TODO_first_post_icon.png' },
    { name: 'Event Organizer', description: 'Awarded for creating your first community event.', iconUrl: 'TODO_event_organizer_icon.png' },
    { name: 'Active Commenter', description: 'Awarded for making 5 comments.', iconUrl: 'TODO_commenter_icon.png' },
    { name: 'Community Starter', description: 'Awarded for creating your first community.', iconUrl: 'TODO_community_starter_icon.png'}
  ];

  const awardKarma = (userId: string, points: number) => {
    setCurrentUser(prevUser => {
      if (prevUser && prevUser.id === userId) {
        console.log(`Awarding ${points} karma to current user ${userId}. New total: ${prevUser.karmaPoints + points}`);
        return { ...prevUser, karmaPoints: prevUser.karmaPoints + points };
      }
      return prevUser;
    });
    // Also update discoveryUsers if the user is in there (e.g. for profiles viewed by others)
    // Note: This doesn't update users within community posts/comments authors directly unless they are the currentUser.
    // A more robust user management system would be needed for that.
    setDiscoveryUsers(prevUsers => prevUsers.map(user =>
      user.id === userId ? { ...user, karmaPoints: user.karmaPoints + points } : user
    ));
  };

  const awardBadge = (userId: string, badgeName: string) => {
    const badgeDef = BADGE_DEFINITIONS.find(b => b.name === badgeName);
    if (!badgeDef) {
      console.warn(`Badge definition for "${badgeName}" not found.`);
      return;
    }

    const newBadge: Badge = {
      id: `badge-${badgeName.replace(/\s+/g, '-')}-${Date.now()}`,
      name: badgeDef.name,
      description: badgeDef.description,
      iconUrl: badgeDef.iconUrl,
      dateAwarded: new Date(),
    };

    let userHadBadge = false;
    setCurrentUser(prevUser => {
      if (prevUser && prevUser.id === userId) {
        if (!prevUser.badges.find(b => b.name === badgeName)) {
          console.log(`Awarding badge "${badgeName}" to current user ${userId}.`);
          return { ...prevUser, badges: [...prevUser.badges, newBadge] };
        }
        userHadBadge = true;
      }
      return prevUser;
    });

    if (userHadBadge) return; // User already processed via setCurrentUser

    setDiscoveryUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId && !user.badges.find(b => b.name === badgeName)) {
        console.log(`Awarding badge "${badgeName}" to discovery user ${userId}.`);
        return { ...user, badges: [...user.badges, newBadge] };
      }
      return user;
    }));
  };

  // --- End Karma and Badge Functions ---


  // Modified Community Functions to include karma/badge awards
  const originalCreateCommunity = createCommunity; // Keep original for internal calls if needed
  const createCommunityWithKarma = (communityData: Omit<Community, 'id' | 'memberIds' | 'posts'>) => {
    if (!currentUser) return;
    originalCreateCommunity(communityData); // Call the original logic
    awardKarma(currentUser.id, 15); // +15 karma for creating a community

    let totalCommunitiesCreated = 0;
    communities.forEach(community => {
        // Assuming the first memberId is the creator, and that currentUser.id is stable
        if (community.memberIds[0] === currentUser.id) { // This logic is a bit weak for "creator"
            totalCommunitiesCreated++;
        }
    });
     // Check if it's the user's first community AFTER it's added
    if (communities.filter(c => c.memberIds[0] === currentUser.id).length === 1) {
        awardBadge(currentUser.id, 'Community Starter');
    }
  };


  const originalAddPostToCommunity = addPostToCommunity;
  const addPostToCommunityWithKarma = (communityId: string, postData: Omit<Post, 'id' | 'communityId' | 'createdAt' | 'comments' | 'authorId'>) => {
    if (!currentUser) return;
    originalAddPostToCommunity(communityId, postData); // Call the original logic
    awardKarma(currentUser.id, 5); // +5 karma for a post

    // Check for "First Post" badge
    let postCount = 0;
    communities.forEach(c => {
      c.posts.forEach(p => {
        if (p.authorId === currentUser.id) {
          postCount++;
        }
      });
    });
    if (postCount === 1) { // After adding the current post
      awardBadge(currentUser.id, 'First Post');
    }
  };

  const originalAddCommentToPost = addCommentToPost;
  const addCommentToPostWithKarma = (postId: string, commentData: Omit<Comment, 'id' | 'postId' | 'createdAt' | 'authorId'>) => {
    if (!currentUser) return;
    originalAddCommentToPost(postId, commentData); // Call the original logic
    awardKarma(currentUser.id, 2); // +2 karma for a comment

    let commentCount = 0;
    communities.forEach(c => {
        c.posts.forEach(p => {
            p.comments.forEach(comment => {
                if (comment.authorId === currentUser.id) {
                    commentCount++;
                }
            });
        });
    });
    if (commentCount === 5) { // Check if this is the 5th comment
        awardBadge(currentUser.id, 'Active Commenter');
    }
  };

  const originalCreateCommunityEvent = createCommunityEvent;
  const createCommunityEventWithKarma = (eventDetails: { communityId: string; name: string; description: string; location: string; dateTime: Date }) => {
    if(!currentUser) return;
    originalCreateCommunityEvent(eventDetails); // Call the original logic
    awardKarma(currentUser.id, 10); // +10 karma for creating an event

    // Check for "Event Organizer" badge
    // This check assumes the event was successfully added by originalCreateCommunityEvent
    // and currentUser.id is the first attendee.
    let eventCount = 0;
    communityEvents.forEach(event => {
        if (event.attendees[0] === currentUser.id) { // Assuming creator is first attendee
            eventCount++;
        }
    });
    if (eventCount === 1) {
        awardBadge(currentUser.id, 'Event Organizer');
    }
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
      // Community State
      communities,
      communityEvents,
      // End Community State
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
      submitVerificationRequest,
      // Community Functions
      createCommunity: createCommunityWithKarma,
      addPostToCommunity: addPostToCommunityWithKarma,
      addCommentToPost: addCommentToPostWithKarma,
      createCommunityEvent: createCommunityEventWithKarma,
      joinEvent,
      leaveEvent,
      joinCommunity,
      leaveCommunity,
      // End Community Functions
      // Karma and Badges Functions
      awardKarma,
      awardBadge,
      updateProfilePrivacySettings
      // End Karma and Badges Functions
    }}>
      {children}
    </AppContext.Provider>
  );
};