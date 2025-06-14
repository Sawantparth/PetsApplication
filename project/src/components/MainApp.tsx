import React from 'react';
import { Heart, MessageCircle, User, Zap, Building2, Users } from 'lucide-react'; // Added Users icon
import { useApp } from '../contexts/AppContext';
import DiscoveryScreen from './DiscoveryScreen';
import CommunityScreen from './CommunityScreen'; // Import CommunityScreen
import BusinessDiscovery from './BusinessDiscovery';
import MatchesScreen from './MatchesScreen';
import ChatScreen from './ChatScreen';
import ProfileScreen from './ProfileScreen';

const MainApp: React.FC = () => {
  const { currentScreen, setCurrentScreen, matches, currentUser } = useApp();
  
  const unreadCount = matches.filter(match => match.hasUnreadMessages).length;

  const renderScreen = () => {
    switch (currentScreen) {
      case 'discovery':
        return <DiscoveryScreen />;
      case 'business-discovery':
        return <BusinessDiscovery />;
      case 'matches':
        return <MatchesScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'community': // Add case for community screen
        return <CommunityScreen />;
      default:
        return currentUser?.userType === 'pet-parent' ? <DiscoveryScreen /> : <BusinessDiscovery />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col">
      <div className="flex-1 overflow-hidden">
        {renderScreen()}
      </div>

      <div className="bg-white border-t border-gray-200 px-4 py-2 shadow-lg">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {/* Pet Discovery - Only for pet parents */}
          {currentUser?.userType === 'pet-parent' && (
            <button
              onClick={() => setCurrentScreen('discovery')}
              className={`flex flex-col items-center p-3 rounded-lg transition-all transform hover:scale-105 ${
                currentScreen === 'discovery' 
                  ? 'text-purple-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative">
                <Zap className={`w-6 h-6 ${currentScreen === 'discovery' ? 'fill-current' : ''}`} />
                {currentScreen === 'discovery' && (
                  <div className="absolute -inset-1 bg-purple-200 rounded-full -z-10 animate-pulse"></div>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">Pets</span>
            </button>
          )}

          {/* Business Discovery */}
          <button
            onClick={() => setCurrentScreen('business-discovery')}
            className={`flex flex-col items-center p-3 rounded-lg transition-all transform hover:scale-105 ${
              currentScreen === 'business-discovery' 
                ? 'text-blue-600' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="relative">
              <Building2 className={`w-6 h-6 ${currentScreen === 'business-discovery' ? 'fill-current' : ''}`} />
              {currentScreen === 'business-discovery' && (
                <div className="absolute -inset-1 bg-blue-200 rounded-full -z-10 animate-pulse"></div>
              )}
            </div>
            <span className="text-xs mt-1 font-medium">Services</span>
          </button>

          {/* Communities Tab */}
          <button
            onClick={() => setCurrentScreen('community')}
            className={`flex flex-col items-center p-3 rounded-lg transition-all transform hover:scale-105 ${
              currentScreen === 'community'
                ? 'text-teal-600' // Teal color for active state
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="relative">
              <Users className={`w-6 h-6 ${currentScreen === 'community' ? 'fill-current' : ''}`} />
              {currentScreen === 'community' && (
                <div className="absolute -inset-1 bg-teal-200 rounded-full -z-10 animate-pulse"></div>
              )}
            </div>
            <span className="text-xs mt-1 font-medium">Community</span>
          </button>

          {/* Matches/Connections */}
          <button
            onClick={() => setCurrentScreen('matches')}
            className={`flex flex-col items-center p-3 rounded-lg transition-all transform hover:scale-105 relative ${
              currentScreen === 'matches' 
                ? 'text-pink-600' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="relative">
              <MessageCircle className={`w-6 h-6 ${currentScreen === 'matches' ? 'fill-current' : ''}`} />
              {currentScreen === 'matches' && (
                <div className="absolute -inset-1 bg-pink-200 rounded-full -z-10 animate-pulse"></div>
              )}
            </div>
            <span className="text-xs mt-1 font-medium">
              {currentUser?.userType === 'pet-parent' ? 'Matches' : 'Connections'}
            </span>
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                {unreadCount}
              </div>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={() => setCurrentScreen('profile')}
            className={`flex flex-col items-center p-3 rounded-lg transition-all transform hover:scale-105 ${
              currentScreen === 'profile' 
                ? 'text-orange-600' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="relative">
              <User className={`w-6 h-6 ${currentScreen === 'profile' ? 'fill-current' : ''}`} />
              {currentScreen === 'profile' && (
                <div className="absolute -inset-1 bg-orange-200 rounded-full -z-10 animate-pulse"></div>
              )}
            </div>
            <span className="text-xs mt-1 font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainApp;