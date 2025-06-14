import React, { useState } from 'react';
import { Camera, ArrowLeft, Check, Dog, Cat, Bird } from 'lucide-react';
import { useApp, Pet } from '../contexts/AppContext';

const ProfileSetup: React.FC = () => {
  const { setCurrentPet, setCurrentScreen } = useApp();
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    breed: '',
    bio: '',
    size: '' as 'small' | 'medium' | 'large',
    energy: '' as 'low' | 'medium' | 'high',
    personality: [] as string[],
    interests: [] as string[],
    petType: '' as 'dog' | 'cat' | 'bird' | 'rabbit' | 'other',
    ownerName: '',
    vaccinated: false,
    spayedNeutered: false,
    goodWith: [] as string[]
  });

  const availableInterests = [
    'Fetch', 'Swimming', 'Hiking', 'Dog Parks', 'Agility', 'Training',
    'Napping', 'Treats', 'Socializing', 'Bird Watching', 'Climbing',
    'Puzzle Toys', 'Sunbathing', 'Frisbee', 'Exploring', 'Grooming'
  ];

  const personalityTraits = [
    'Friendly', 'Energetic', 'Social', 'Calm', 'Affectionate', 'Playful',
    'Independent', 'Intelligent', 'Curious', 'Gentle', 'Active', 'Focused'
  ];

  const goodWithOptions = [
    'Dogs', 'Cats', 'Kids', 'Other Pets', 'Seniors', 'Active Families'
  ];

  const handleArrayToggle = (item: string, field: 'interests' | 'personality' | 'goodWith') => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const completeSetup = () => {
    const newPet: Pet = {
      id: 'current-pet',
      name: profileData.name,
      age: parseInt(profileData.age),
      breed: profileData.breed,
      bio: profileData.bio,
      photos: ['https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg'],
      location: 'Your Area',
      distance: 0,
      verified: false,
      interests: profileData.interests,
      size: profileData.size,
      energy: profileData.energy,
      personality: profileData.personality,
      ownerName: profileData.ownerName,
      petType: profileData.petType,
      vaccinated: profileData.vaccinated,
      spayedNeutered: profileData.spayedNeutered,
      goodWith: profileData.goodWith
    };

    setCurrentPet(newPet);
    setCurrentScreen('main');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🐾</div>
              <h2 className="text-2xl font-bold text-gray-800">Tell us about your pet!</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pet's Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="What's your pet's name?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
              <input
                type="number"
                value={profileData.age}
                onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="How old is your pet?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pet Type</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { type: 'dog', icon: '🐕', label: 'Dog' },
                  { type: 'cat', icon: '🐱', label: 'Cat' },
                  { type: 'bird', icon: '🐦', label: 'Bird' },
                  { type: 'rabbit', icon: '🐰', label: 'Rabbit' }
                ].map(({ type, icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setProfileData(prev => ({ ...prev, petType: type as any }))}
                    className={`p-4 rounded-lg border flex flex-col items-center space-y-2 ${
                      profileData.petType === type 
                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className="text-2xl">{icon}</span>
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
              <input
                type="text"
                value={profileData.breed}
                onChange={(e) => setProfileData(prev => ({ ...prev, breed: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="What breed is your pet?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                value={profileData.ownerName}
                onChange={(e) => setProfileData(prev => ({ ...prev, ownerName: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="What should other pet parents call you?"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">📸</div>
              <h2 className="text-2xl font-bold text-gray-800">Add some adorable photos!</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg border-2 border-dashed border-purple-300 flex items-center justify-center hover:border-purple-500 cursor-pointer transition-colors">
                  <Camera className="w-8 h-8 text-purple-400" />
                </div>
              ))}
            </div>
            
            <p className="text-sm text-gray-600 text-center">
              Add at least 2 photos to show off your pet's personality! 📷✨
            </p>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-2xl font-bold text-gray-800">Tell us about their personality</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32 resize-none"
                placeholder="Tell other pet parents what makes your furry friend special..."
                maxLength={300}
              />
              <p className="text-sm text-gray-500 mt-1">{profileData.bio.length}/300</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { size: 'small', label: 'Small', desc: 'Under 25 lbs' },
                  { size: 'medium', label: 'Medium', desc: '25-60 lbs' },
                  { size: 'large', label: 'Large', desc: 'Over 60 lbs' }
                ].map(({ size, label, desc }) => (
                  <button
                    key={size}
                    onClick={() => setProfileData(prev => ({ ...prev, size: size as any }))}
                    className={`p-3 rounded-lg border text-center ${
                      profileData.size === size 
                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium">{label}</div>
                    <div className="text-xs text-gray-500">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Energy Level</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { energy: 'low', label: 'Chill', emoji: '😴' },
                  { energy: 'medium', label: 'Moderate', emoji: '🚶' },
                  { energy: 'high', label: 'High Energy', emoji: '🏃' }
                ].map(({ energy, label, emoji }) => (
                  <button
                    key={energy}
                    onClick={() => setProfileData(prev => ({ ...prev, energy: energy as any }))}
                    className={`p-3 rounded-lg border text-center ${
                      profileData.energy === energy 
                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-xl mb-1">{emoji}</div>
                    <div className="font-medium text-sm">{label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={profileData.vaccinated}
                  onChange={(e) => setProfileData(prev => ({ ...prev, vaccinated: e.target.checked }))}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-medium">Vaccinated ✅</span>
              </label>

              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={profileData.spayedNeutered}
                  onChange={(e) => setProfileData(prev => ({ ...prev, spayedNeutered: e.target.checked }))}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-medium">Spayed/Neutered</span>
              </label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎾</div>
              <h2 className="text-2xl font-bold text-gray-800">What does your pet love?</h2>
              <p className="text-gray-600">Select their favorite activities</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Personality Traits</h3>
              <div className="grid grid-cols-2 gap-2">
                {personalityTraits.map(trait => (
                  <button
                    key={trait}
                    onClick={() => handleArrayToggle(trait, 'personality')}
                    disabled={!profileData.personality.includes(trait) && profileData.personality.length >= 4}
                    className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                      profileData.personality.includes(trait)
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    {trait}
                    {profileData.personality.includes(trait) && (
                      <Check className="w-3 h-3 inline ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-3">Favorite Activities</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableInterests.map(interest => (
                  <button
                    key={interest}
                    onClick={() => handleArrayToggle(interest, 'interests')}
                    disabled={!profileData.interests.includes(interest) && profileData.interests.length >= 6}
                    className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                      profileData.interests.includes(interest)
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    {interest}
                    {profileData.interests.includes(interest) && (
                      <Check className="w-3 h-3 inline ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-3">Good With</h3>
              <div className="grid grid-cols-2 gap-2">
                {goodWithOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => handleArrayToggle(option, 'goodWith')}
                    className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                      profileData.goodWith.includes(option)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {option}
                    {profileData.goodWith.includes(option) && (
                      <Check className="w-3 h-3 inline ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col">
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : setCurrentScreen('welcome')}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={`w-8 h-1 rounded-full ${
                i <= step ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        
        <div className="w-10" />
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-md mx-auto">
          {renderStep()}
        </div>
      </div>

      <div className="bg-white p-6 border-t">
        <div className="max-w-md mx-auto">
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && (!profileData.name || !profileData.age || !profileData.petType || !profileData.breed || !profileData.ownerName)) ||
                (step === 3 && (!profileData.bio || !profileData.size || !profileData.energy))
              }
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-full hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={completeSetup}
              disabled={profileData.personality.length === 0 || profileData.interests.length === 0}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-full hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              Create Profile 🎉
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;