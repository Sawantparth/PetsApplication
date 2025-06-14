import React, { useState } from 'react';
import React, { useState } from 'react';
import { Settings, Edit, Camera, MapPin, Award, LogOut, Zap, Star, ShieldCheck, Eye, EyeOff } from 'lucide-react'; // Added Star, ShieldCheck, Eye, EyeOff
import { useApp, Badge } from '../contexts/AppContext'; // Added Badge type

const ProfileScreen: React.FC = () => {
  const { currentUser, currentPet, setCurrentUser, setCurrentPet, setCurrentScreen, filters, setFilters, updateProfilePrivacySettings } = useApp(); // Added updateProfilePrivacySettings
  const [showSettings, setShowSettings] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Combined check for loading state
  if (!currentUser && !currentPet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <p>Loading profile...</p> {/* Or handle specific user type loading */}
      </div>
    );
  }

  const handleLogout = () => {
    setCurrentUser(null); // Clear current user
    setCurrentPet(null); // Clear current pet
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
          {currentUser ? `${currentUser.name}'s Profile` : (currentPet ? `${currentPet.name}'s Profile` : "Profile")}
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
          
          {/* Pet type badge or User type icon */}
          {currentPet && (
            <div className="absolute top-0 right-1/2 transform translate-x-6 -translate-y-2 bg-white rounded-full p-2 shadow-lg border-2 border-purple-200">
              <span className="text-2xl">{getPetTypeEmoji(currentPet.petType)}</span>
            </div>
          )}
          {!currentPet && currentUser && ( // Show user type if no pet profile
             <div className="absolute top-0 right-1/2 transform translate-x-6 -translate-y-2 bg-white rounded-full p-2 shadow-lg border-2 border-gray-200">
                <User className="w-6 h-6 text-gray-700" />
             </div>
          )}
        </div>

        {/* User Info Section (Karma and Badges) */}
        {currentUser && (
          <>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{currentUser.name}</h2>
                {currentUser.verified && (
                  <Award className="w-6 h-6 text-blue-500" title="Verified User"/>
                )}
              </div>
              <p className="text-lg font-medium text-gray-700 mb-1">{currentUser.userType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
              <div className="flex items-center justify-center space-x-1 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{currentUser.location}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-semibold text-lg">{currentUser.karmaPoints} Karma</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-100 mb-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <ShieldCheck className="w-5 h-5 text-indigo-500 mr-2"/> Badges ({currentUser.badges.length})
              </h3>
              {currentUser.badges.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {currentUser.badges.map((badge: Badge) => ( // Explicitly type Badge here
                    <div key={badge.id} className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 text-center flex-grow basis-1/3">
                      {badge.iconUrl && <img src={badge.iconUrl} alt={badge.name} className="w-8 h-8 mx-auto mb-1" />}
                      {/* Placeholder icon if no iconUrl */}
                      {!badge.iconUrl && <Award className="w-6 h-6 text-indigo-400 mx-auto mb-1"/>}
                      <p className="text-sm font-semibold text-indigo-700">{badge.name}</p>
                      <p className="text-xs text-indigo-500 mt-1">{badge.description}</p>
                      <p className="text-xs text-gray-400 mt-1">Awarded: {new Date(badge.dateAwarded).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No badges earned yet. Keep engaging to earn them!</p>
              )}
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100 mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">About {currentUser.name}</h3>
              <p className="text-gray-700">{currentUser.bio}</p>
            </div>

            {/* Profile Privacy Settings */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Privacy Settings</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 text-sm">Show community activity on match profile?</span>
                <button
                  onClick={() => updateProfilePrivacySettings({ showCommunityActivityOnMatchProfile: !currentUser.showCommunityActivityOnMatchProfile })}
                  className={`p-2 rounded-full transition-colors ${
                    currentUser.showCommunityActivityOnMatchProfile ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {currentUser.showCommunityActivityOnMatchProfile ? <Eye className="w-5 h-5 text-white" /> : <EyeOff className="w-5 h-5 text-white" />}
                </button>
              </div>
               <p className="text-xs text-gray-500 mt-1">
                This controls if others see your karma points and badges on your matchmaking profile.
              </p>
            </div>
          </>
        )}


        {/* Pet Profile Section - Only if currentPet exists */}
        {currentPet && (
          <div className="mt-6 pt-6 border-t border-gray-200">
             <h2 className="text-xl font-bold text-center text-purple-700 mb-4">Pet Profile: {currentPet.name}</h2>
            {/* Basic Info */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{currentPet.name}</h2>
                <span className="text-xl text-gray-600">{currentPet.age}y</span>
                {currentPet.verified && ( // This verified is pet's, not user's
                  <Award className="w-6 h-6 text-pink-500" title="Pet Verified"/>
                )}
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">{currentPet.breed}</p>
              <div className="flex items-center justify-center space-x-1 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{currentPet.location}</span>
              </div>
            </div>
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
            </div> {/* End of currentPet specific space-y-4 */}
          </div>
        )}

        {/* Actions - common for both user and pet profile views */}
        <div className="space-y-3 pt-4 mt-6 border-t border-gray-200">
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
              <h2 className="text-xl font-bold">Edit {currentUser ? currentUser.name : (currentPet ? currentPet.name : "")}'s Profile</h2>
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
                You'll be able to update {currentUser ? currentUser.name : (currentPet ? currentPet.name : "your")}'s photos, bio, and other details here.
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