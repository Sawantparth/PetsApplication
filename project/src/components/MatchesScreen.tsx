import React from 'react';
import { MessageCircle, Heart, Clock, Award } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const MatchesScreen: React.FC = () => {
  const { matches, setCurrentScreen, currentPet } = useApp();

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const handleMatchClick = (matchId: string) => {
    sessionStorage.setItem('selectedMatchId', matchId);
    setCurrentScreen('chat');
  };

  const getPetTypeEmoji = (type: string) => {
    switch (type) {
      case 'dog': return '🐕';
      case 'cat': return '🐱';
      case 'bird': return '🐦';
      case 'rabbit': return '🐰';
      default: return '🐾';
    }
  };

  if (matches.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-8xl mb-4">🎾</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No playdate matches yet!</h2>
          <p className="text-gray-600 mb-6">Keep swiping to find perfect playmates for your furry friend!</p>
          <button
            onClick={() => setCurrentScreen('discovery')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
          >
            Start Discovering 🐾
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="bg-white shadow-sm p-4 border-b">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Playdate Matches 🎾
        </h1>
        <p className="text-gray-600">{matches.length} potential playmates</p>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {matches.map((match) => (
            <div
              key={match.id}
              onClick={() => handleMatchClick(match.id)}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-purple-100 hover:border-purple-200"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={match.pet.photos[0]}
                    alt={match.pet.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
                  />
                  {match.hasUnreadMessages && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                  )}
                  
                  {/* Pet type emoji */}
                  <div className="absolute -bottom-1 -right-1 text-lg bg-white rounded-full border border-gray-200 w-6 h-6 flex items-center justify-center">
                    {getPetTypeEmoji(match.pet.petType)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {match.pet.name}
                    </h3>
                    <span className="text-gray-500 text-sm">
                      {match.pet.age}y
                    </span>
                    {match.pet.verified && (
                      <Award className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate">{match.pet.breed}</p>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Matched {formatTimeAgo(match.matchedAt)}
                    </span>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-purple-600 font-medium">
                      🎾 Ready for a playdate with {currentPet?.name}!
                    </p>
                  </div>
                </div>

                <MessageCircle className="w-6 h-6 text-purple-400" />
              </div>

              {/* Match preview interests */}
              {match.pet.interests.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {match.pet.interests.slice(0, 3).map(interest => (
                    <span
                      key={interest}
                      className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                    >
                      {interest}
                    </span>
                  ))}
                  {match.pet.interests.length > 3 && (
                    <span className="text-gray-500 text-xs">+{match.pet.interests.length - 3} more</span>
                  )}
                </div>
              )}

              {/* Pet compatibility indicators */}
              <div className="mt-2 flex items-center space-x-3 text-xs">
                <span className={`px-2 py-1 rounded-full ${
                  match.pet.size === currentPet?.size 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {match.pet.size} size
                </span>
                <span className={`px-2 py-1 rounded-full ${
                  match.pet.energy === currentPet?.energy 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {match.pet.energy} energy
                </span>
                {match.pet.vaccinated && (
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    ✅ Vaccinated
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Playdate tips */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
          <h3 className="font-semibold text-purple-800 mb-2">🎾 Playdate Tips</h3>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Meet in a neutral, public space first</li>
            <li>• Bring water and cleanup bags</li>
            <li>• Watch for signs of stress in both pets</li>
            <li>• Keep first meetings short and positive</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MatchesScreen;