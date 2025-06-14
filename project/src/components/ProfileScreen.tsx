import React, { useState } from 'react';
import { Settings, Edit, Camera, MapPin, Award, LogOut, Zap } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ProfileScreen: React.FC = () => {
  const { currentPet, setCurrentPet, setCurrentScreen, filters, setFilters } = useApp();
  const [showSettings, setShowSettings] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  if (!currentPet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  const handleLogout = () => {
    setCurrentPet(null);
    setCurrentScreen('welcome');
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

  const getEnergyEmoji = (energy: string) => {
    switch (energy) {
      case 'low': return '😴';
      case 'medium': return '🚶';
      case 'high': return '🏃';
      default: return '⚡';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between border-b">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {currentPet.name}'s Profile
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(true)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Edit className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        {/* Profile Photo */}
        <div className="relative mb-6">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={currentPet.photos[0]}
              alt={currentPet.name}
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-1/2 transform translate-x-6 translate-y-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-2 hover:from-purple-600 hover:to-pink-600 transition-all">
            <Camera className="w-4 h-4" />
          </button>
          
          {/* Pet type badge */}
          <div className="absolute top-0 right-1/2 transform translate-x-6 -translate-y-2 bg-white rounded-full p-2 shadow-lg border-2 border-purple-200">
            <span className="text-2xl">{getPetTypeEmoji(currentPet.petType)}</span>
          </div>
        </div>

        {/* Basic Info */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <h2 className="text-2xl font-bold text-gray-800">{currentPet.name}</h2>
            <span className="text-xl text-gray-600">{currentPet.age}y</span>
            {currentPet.verified && (
              <Award className="w-6 h-6 text-blue-500" />
            )}
          </div>
          <p className="text-lg font-medium text-gray-700 mb-2">{currentPet.breed}</p>
          <div className="flex items-center justify-center space-x-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{currentPet.location}</span>
          </div>
        </div>

        {/* Profile Info Cards */}
        <div className="space-y-4">
          {/* Bio */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
            <h3 className="font-semibold text-gray-800 mb-2">About {currentPet.name}</h3>
            <p className="text-gray-700">{currentPet.bio}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 shadow-sm border border-purple-100 text-center">
              <div className="text-2xl mb-1">{getPetTypeEmoji(currentPet.petType)}</div>
              <p className="text-xs font-medium text-gray-600">{currentPet.petType}</p>
            </div>
            
            <div className="bg-white rounded-xl p-3 shadow-sm border border-pink-100 text-center">
              <div className="text-2xl mb-1">📏</div>
              <p className="text-xs font-medium text-gray-600">{currentPet.size}</p>
            </div>
            
            <div className="bg-white rounded-xl p-3 shadow-sm border border-orange-100 text-center">
              <div className="text-2xl mb-1">{getEnergyEmoji(currentPet.energy)}</div>
              <p className="text-xs font-medium text-gray-600">{currentPet.energy} energy</p>
            </div>
          </div>

          {/* Health & Care */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
            <h3 className="font-semibold text-gray-800 mb-3">Health & Care</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-2 rounded-lg text-center ${
                currentPet.vaccinated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <div className="text-sm font-medium">
                  {currentPet.vaccinated ? '✅ Vaccinated' : '❌ Not Vaccinated'}
                </div>
              </div>
              
              <div className={`p-2 rounded-lg text-center ${
                currentPet.spayedNeutered ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                <div className="text-sm font-medium">
                  {currentPet.spayedNeutered ? '✅ Spayed/Neutered' : '❌ Not Fixed'}
                </div>
              </div>
            </div>
          </div>

          {/* Personality */}
          {currentPet.personality.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
              <h3 className="font-semibold text-gray-800 mb-3">Personality</h3>
              <div className="flex flex-wrap gap-2">
                {currentPet.personality.map(trait => (
                  <span
                    key={trait}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {currentPet.interests.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
              <h3 className="font-semibold text-gray-800 mb-3">Favorite Activities</h3>
              <div className="flex flex-wrap gap-2">
                {currentPet.interests.map(interest => (
                  <span
                    key={interest}
                    className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Good With */}
          {currentPet.goodWith.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
              <h3 className="font-semibold text-gray-800 mb-3">Good With</h3>
              <div className="flex flex-wrap gap-2">
                {currentPet.goodWith.map(item => (
                  <span
                    key={item}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Owner Info */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
            <h3 className="font-semibold text-gray-800 mb-2">Pet Parent</h3>
            <p className="text-gray-700">👤 {currentPet.ownerName}</p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => setShowFilters(true)}
              className="w-full bg-white text-purple-800 py-3 px-4 rounded-full font-semibold border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5" />
              <span>Discovery Settings</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full bg-red-50 text-red-600 py-3 px-4 rounded-full font-semibold border-2 border-red-200 hover:border-red-300 transition-colors flex items-center justify-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Discovery Settings</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Range: {filters.minAge} - {filters.maxAge} years
                </label>
                <div className="flex space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={filters.minAge}
                    onChange={(e) => setFilters({...filters, minAge: parseInt(e.target.value)})}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={filters.maxAge}
                    onChange={(e) => setFilters({...filters, maxAge: parseInt(e.target.value)})}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Distance: {filters.maxDistance} miles
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={filters.maxDistance}
                  onChange={(e) => setFilters({...filters, maxDistance: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pet Type</label>
                <select
                  value={filters.petType}
                  onChange={(e) => setFilters({...filters, petType: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Pets</option>
                  <option value="dog">Dogs Only</option>
                  <option value="cat">Cats Only</option>
                  <option value="bird">Birds Only</option>
                  <option value="rabbit">Rabbits Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size Preference</label>
                <select
                  value={filters.size}
                  onChange={(e) => setFilters({...filters, size: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Sizes</option>
                  <option value="small">Small Pets</option>
                  <option value="medium">Medium Pets</option>
                  <option value="large">Large Pets</option>
                </select>
              </div>

              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="text-center py-8">
              <div className="text-6xl mb-4">🚧</div>
              <p className="text-gray-600 mb-2">Profile editing coming soon!</p>
              <p className="text-sm text-gray-500">
                You'll be able to update {currentPet.name}'s photos, bio, and other details here.
              </p>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;