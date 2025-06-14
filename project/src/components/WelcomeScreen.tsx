import React, { useState } from 'react';
import { Heart, Sparkles, Users, Shield, Stethoscope, Store, Building2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const WelcomeScreen: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const [selectedUserType, setSelectedUserType] = useState<string>('');

  const userTypes = [
    {
      type: 'pet-parent',
      title: 'Pet Parent',
      icon: Heart,
      description: 'Find playmates for your furry friends',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700'
    },
    {
      type: 'organization',
      title: 'Non-Profit Organization',
      icon: Building2,
      description: 'Connect with the pet community',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      type: 'pet-store',
      title: 'Pet Store',
      icon: Store,
      description: 'Offer services to pet parents',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      type: 'veterinarian',
      title: 'Veterinarian',
      icon: Stethoscope,
      description: 'Guide and help pet parents',
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ];

  const handleContinue = () => {
    if (selectedUserType) {
      sessionStorage.setItem('selectedUserType', selectedUserType);
      setCurrentScreen('user-setup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center mb-8">
        <div className="mb-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="text-4xl">🐾</div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
            PawMates
          </h1>
          <p className="text-xl opacity-90">The complete pet community platform</p>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-center space-x-3">
            <Sparkles className="w-6 h-6" />
            <span className="text-lg">Connect pets, parents, and professionals</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Users className="w-6 h-6" />
            <span className="text-lg">Verified community members</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Shield className="w-6 h-6" />
            <span className="text-lg">Safe and trusted platform</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl mb-8">
        <h2 className="text-2xl font-bold text-center mb-6">Join as:</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {userTypes.map(({ type, title, icon: Icon, description, color, bgColor, textColor }) => (
            <button
              key={type}
              onClick={() => setSelectedUserType(type)}
              className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                selectedUserType === type
                  ? 'border-white bg-white/20 backdrop-blur-sm'
                  : 'border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20'
              }`}
            >
              <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon className={`w-8 h-8 ${textColor}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm opacity-90">{description}</p>
              {selectedUserType === type && (
                <div className="mt-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mx-auto">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedUserType}
          className="w-full bg-white text-purple-600 font-semibold py-4 px-6 rounded-full text-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Continue
        </button>
      </div>

      <div className="text-center">
        <p className="text-sm opacity-75 mb-4">
          {selectedUserType === 'organization' || selectedUserType === 'veterinarian' || selectedUserType === 'pet-store'
            ? 'Professional accounts require manual verification'
            : 'By continuing, you agree to keep all interactions safe and positive! 🐕🐱'
          }
        </p>
        
        {(selectedUserType === 'organization' || selectedUserType === 'veterinarian' || selectedUserType === 'pet-store') && (
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Verification Required</span>
            </div>
            <p className="text-sm">
              You'll need to submit documents for manual review to ensure community safety and trust.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;