import React, { useState, useRef } from 'react';
import { X, Heart, Star, Info, MapPin, Award } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const DiscoveryScreen: React.FC = () => {
  const { discoveryPets, swipePet, filters } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentPet = discoveryPets[currentIndex];

  const handleSwipe = (action: 'like' | 'pass' | 'superlike') => {
    if (!currentPet) return;
    
    swipePet(currentPet.id, action);
    setCurrentIndex(prev => prev + 1);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const startX = e.clientX;
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      setDragOffset({ x: deltaX, y: 0 });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      if (Math.abs(dragOffset.x) > 100) {
        handleSwipe(dragOffset.x > 0 ? 'like' : 'pass');
      } else {
        setDragOffset({ x: 0, y: 0 });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const startX = e.touches[0].clientX;
    
    const handleTouchMove = (e: TouchEvent) => {
      const deltaX = e.touches[0].clientX - startX;
      setDragOffset({ x: deltaX, y: 0 });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      if (Math.abs(dragOffset.x) > 100) {
        handleSwipe(dragOffset.x > 0 ? 'like' : 'pass');
      } else {
        setDragOffset({ x: 0, y: 0 });
      }
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
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

  const getSizeEmoji = (size: string) => {
    switch (size) {
      case 'small': return '🐕‍🦺';
      case 'medium': return '🐕';
      case 'large': return '🐕‍🦮';
      default: return '🐾';
    }
  };

  if (!currentPet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="text-8xl mb-4">🐾</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No more pets to discover!</h2>
          <p className="text-gray-600">Check back later for new furry friends! 🎾</p>
        </div>
      </div>
    );
  }

  const rotation = dragOffset.x * 0.1;
  const opacity = 1 - Math.abs(dragOffset.x) / 300;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4 pt-8">
      <div className="max-w-sm mx-auto relative">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Find Playmates! 🎾
          </h1>
        </div>

        {/* Card Stack */}
        <div className="relative h-[600px]">
          {/* Background cards for stack effect */}
          {discoveryPets.slice(currentIndex + 1, currentIndex + 3).map((pet, index) => (
            <div
              key={pet.id}
              className="absolute inset-0 bg-white rounded-2xl shadow-lg border"
              style={{
                transform: `scale(${0.95 - index * 0.02}) translateY(${index * 4}px)`,
                zIndex: -index - 1
              }}
            />
          ))}

          {/* Current card */}
          <div
            ref={cardRef}
            className="absolute inset-0 bg-white rounded-2xl shadow-xl cursor-grab active:cursor-grabbing overflow-hidden border-2 border-white"
            style={{
              transform: `translateX(${dragOffset.x}px) rotate(${rotation}deg)`,
              opacity,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* Pet Image */}
            <div className="relative h-[420px] overflow-hidden">
              <img
                src={currentPet.photos[0]}
                alt={currentPet.name}
                className="w-full h-full object-cover"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              {/* Like/Pass overlays */}
              {dragOffset.x > 50 && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                  <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg">
                    PLAYDATE! 🎾
                  </div>
                </div>
              )}
              
              {dragOffset.x < -50 && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                  <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg">
                    PASS 👋
                  </div>
                </div>
              )}

              {/* Info button */}
              <button
                onClick={() => setShowProfile(true)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
              >
                <Info className="w-5 h-5 text-white" />
              </button>

              {/* Pet type badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                <span className="text-lg">{getPetTypeEmoji(currentPet.petType)}</span>
                <span className="text-sm font-medium text-gray-800">{currentPet.petType}</span>
              </div>

              {/* Verification badge */}
              {currentPet.verified && (
                <div className="absolute top-16 left-4 bg-blue-500 rounded-full p-1">
                  <Award className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Basic info overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center space-x-2 mb-1">
                  <h2 className="text-3xl font-bold">{currentPet.name}</h2>
                  <span className="text-2xl font-light">{currentPet.age}y</span>
                </div>
                
                <p className="text-lg font-medium mb-2">{currentPet.breed}</p>
                
                <div className="flex items-center space-x-1 text-sm opacity-90 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{currentPet.distance} miles away</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm opacity-90">
                  <span className="bg-white/20 px-2 py-1 rounded-full">
                    {getSizeEmoji(currentPet.size)} {currentPet.size}
                  </span>
                  <span className="bg-white/20 px-2 py-1 rounded-full">
                    ⚡ {currentPet.energy} energy
                  </span>
                </div>
              </div>
            </div>

            {/* Quick info */}
            <div className="p-4">
              <p className="text-gray-700 text-sm line-clamp-2 mb-3">{currentPet.bio}</p>
              
              {currentPet.interests.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {currentPet.interests.slice(0, 3).map(interest => (
                    <span
                      key={interest}
                      className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                  {currentPet.interests.length > 3 && (
                    <span className="text-gray-500 text-xs">+{currentPet.interests.length - 3}</span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Owner: {currentPet.ownerName}</span>
                {currentPet.vaccinated && <span className="text-green-600">✅ Vaccinated</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center items-center space-x-6 mt-6">
          <button
            onClick={() => handleSwipe('pass')}
            className="bg-white border-2 border-red-300 rounded-full p-4 hover:border-red-400 hover:bg-red-50 transition-all shadow-lg transform hover:scale-110"
          >
            <X className="w-6 h-6 text-red-500" />
          </button>

          <button
            onClick={() => handleSwipe('superlike')}
            className="bg-white border-2 border-blue-300 rounded-full p-4 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-lg transform hover:scale-110"
          >
            <Star className="w-6 h-6 text-blue-500" />
          </button>

          <button
            onClick={() => handleSwipe('like')}
            className="bg-white border-2 border-green-300 rounded-full p-4 hover:border-green-400 hover:bg-green-50 transition-all shadow-lg transform hover:scale-110"
          >
            <Heart className="w-6 h-6 text-green-500" />
          </button>
        </div>
      </div>

      {/* Full Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="relative">
            <img
              src={currentPet.photos[0]}
              alt={currentPet.name}
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full p-2"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-4xl font-bold">{currentPet.name}</h1>
                <span className="text-3xl font-light">{currentPet.age}y</span>
                <span className="text-2xl">{getPetTypeEmoji(currentPet.petType)}</span>
              </div>
              <p className="text-xl font-medium mb-2">{currentPet.breed}</p>
              <div className="flex items-center space-x-1 text-sm opacity-90">
                <MapPin className="w-4 h-4" />
                <span>{currentPet.distance} miles away</span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">About {currentPet.name}</h3>
              <p className="text-gray-700">{currentPet.bio}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <h4 className="font-semibold text-purple-800">Size</h4>
                <p className="text-purple-600">{currentPet.size}</p>
              </div>
              
              <div className="bg-pink-50 p-3 rounded-lg">
                <h4 className="font-semibold text-pink-800">Energy</h4>
                <p className="text-pink-600">{currentPet.energy}</p>
              </div>
              
              <div className="bg-orange-50 p-3 rounded-lg">
                <h4 className="font-semibold text-orange-800">Owner</h4>
                <p className="text-orange-600">{currentPet.ownerName}</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-semibold text-green-800">Health</h4>
                <p className="text-green-600">
                  {currentPet.vaccinated ? '✅ Vaccinated' : '❌ Not vaccinated'}
                </p>
              </div>
            </div>

            {currentPet.personality.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Personality</h3>
                <div className="flex flex-wrap gap-2">
                  {currentPet.personality.map(trait => (
                    <span
                      key={trait}
                      className="bg-purple-100 text-purple-800 px-3 py-2 rounded-full text-sm font-medium"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {currentPet.interests.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Favorite Activities</h3>
                <div className="flex flex-wrap gap-2">
                  {currentPet.interests.map(interest => (
                    <span
                      key={interest}
                      className="bg-orange-100 text-orange-800 px-3 py-2 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {currentPet.goodWith.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Good With</h3>
                <div className="flex flex-wrap gap-2">
                  {currentPet.goodWith.map(item => (
                    <span
                      key={item}
                      className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-4 pt-4">
              <button
                onClick={() => {
                  setShowProfile(false);
                  handleSwipe('pass');
                }}
                className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
              >
                Pass 👋
              </button>
              <button
                onClick={() => {
                  setShowProfile(false);
                  handleSwipe('like');
                }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors"
              >
                Playdate! 🎾
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoveryScreen;