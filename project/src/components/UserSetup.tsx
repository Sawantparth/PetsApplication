import React, { useState } from 'react';
import { ArrowLeft, Upload, Shield, Mail, Phone, Globe, MapPin, Camera } from 'lucide-react';
import { useApp, User } from '../contexts/AppContext';

const UserSetup: React.FC = () => {
  const { setCurrentUser, setCurrentScreen, submitVerificationRequest } = useApp();
  const [step, setStep] = useState(1);
  const [userType] = useState(sessionStorage.getItem('selectedUserType') || 'pet-parent');
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
    address: '',
    specialties: [] as string[],
    services: [] as string[],
    organizationType: '',
    businessHours: ''
  });

  const [verificationDocs, setVerificationDocs] = useState({
    businessLicense: null as File | null,
    veterinaryLicense: null as File | null,
    nonprofitCertification: null as File | null,
    insuranceProof: null as File | null
  });

  const specialtyOptions = [
    'Small Animal Medicine', 'Large Animal Medicine', 'Emergency Medicine',
    'Surgery', 'Dentistry', 'Dermatology', 'Cardiology', 'Oncology',
    'Behavioral Medicine', 'Exotic Animals', 'Preventive Care'
  ];

  const serviceOptions = {
    'pet-store': [
      'Pet Food & Treats', 'Grooming Services', 'Pet Accessories',
      'Training Supplies', 'Pet Toys', 'Health Supplements',
      'Boarding Services', 'Pet Photography', 'Training Classes'
    ],
    'organization': [
      'Pet Adoption', 'Foster Programs', 'Community Education',
      'Volunteer Programs', 'Emergency Pet Care', 'Spay/Neuter Services',
      'Pet Food Bank', 'Behavioral Training', 'Senior Pet Care'
    ]
  };

  const organizationTypes = [
    'Animal Rescue', 'Animal Shelter', 'Wildlife Rehabilitation',
    'Therapy Animal Organization', 'Breed-Specific Rescue',
    'Pet Education Foundation', 'Animal Rights Advocacy'
  ];

  const handleArrayToggle = (item: string, field: 'specialties' | 'services') => {
    setUserData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setVerificationDocs(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const completeSetup = () => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      userType: userType as any,
      verified: userType === 'pet-parent', // Pet parents don't need verification
      verificationStatus: userType === 'pet-parent' ? 'approved' : 'pending',
      profilePhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      bio: userData.bio,
      location: userData.location,
      specialties: userData.specialties,
      services: userData.services,
      organizationType: userData.organizationType,
      businessHours: userData.businessHours,
      contactInfo: {
        phone: userData.phone,
        website: userData.website,
        address: userData.address
      },
      joinedAt: new Date(),
      rating: 5.0,
      reviews: []
    };

    // Submit verification documents if needed
    if (userType !== 'pet-parent') {
      submitVerificationRequest(verificationDocs);
    }

    setCurrentUser(newUser);
    
    if (userType === 'pet-parent') {
      setCurrentScreen('profile-setup');
    } else {
      setCurrentScreen('verification-pending');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">
                {userType === 'pet-parent' && '👨‍👩‍👧‍👦'}
                {userType === 'veterinarian' && '🩺'}
                {userType === 'pet-store' && '🏪'}
                {userType === 'organization' && '🏢'}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {userType === 'pet-parent' && 'Tell us about yourself!'}
                {userType === 'veterinarian' && 'Veterinary Professional Setup'}
                {userType === 'pet-store' && 'Pet Store Information'}
                {userType === 'organization' && 'Organization Details'}
              </h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {userType === 'pet-parent' ? 'Your Name' : 'Business/Organization Name'}
              </label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder={userType === 'pet-parent' ? 'What should other pet parents call you?' : 'Enter your business name'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={userData.location}
                onChange={(e) => setUserData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="City, State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={userData.bio}
                onChange={(e) => setUserData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32 resize-none"
                placeholder={
                  userType === 'pet-parent' 
                    ? 'Tell other pet parents about yourself and your pets...'
                    : 'Describe your services and how you help the pet community...'
                }
                maxLength={300}
              />
              <p className="text-sm text-gray-500 mt-1">{userData.bio.length}/300</p>
            </div>

            {userType === 'organization' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Type</label>
                <select
                  value={userData.organizationType}
                  onChange={(e) => setUserData(prev => ({ ...prev, organizationType: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select organization type</option>
                  {organizationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">📞</div>
              <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={userData.phone}
                onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </div>

            {userType !== 'pet-parent' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website (Optional)</label>
                  <input
                    type="url"
                    value={userData.website}
                    onChange={(e) => setUserData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                  <input
                    type="text"
                    value={userData.address}
                    onChange={(e) => setUserData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
                  <input
                    type="text"
                    value={userData.businessHours}
                    onChange={(e) => setUserData(prev => ({ ...prev, businessHours: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Mon-Fri 9AM-6PM, Sat 10AM-4PM"
                  />
                </div>
              </>
            )}
          </div>
        );

      case 3:
        if (userType === 'pet-parent') return null;
        
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⭐</div>
              <h2 className="text-2xl font-bold text-gray-800">
                {userType === 'veterinarian' ? 'Specialties' : 'Services Offered'}
              </h2>
            </div>

            {userType === 'veterinarian' && (
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Select your specialties (up to 5)</h3>
                <div className="grid grid-cols-1 gap-2">
                  {specialtyOptions.map(specialty => (
                    <button
                      key={specialty}
                      onClick={() => handleArrayToggle(specialty, 'specialties')}
                      disabled={!userData.specialties.includes(specialty) && userData.specialties.length >= 5}
                      className={`p-3 rounded-lg border text-left font-medium transition-colors ${
                        userData.specialties.includes(specialty)
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(userType === 'pet-store' || userType === 'organization') && (
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Select services you offer</h3>
                <div className="grid grid-cols-1 gap-2">
                  {serviceOptions[userType as keyof typeof serviceOptions]?.map(service => (
                    <button
                      key={service}
                      onClick={() => handleArrayToggle(service, 'services')}
                      className={`p-3 rounded-lg border text-left font-medium transition-colors ${
                        userData.services.includes(service)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        if (userType === 'pet-parent') return null;
        
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-bold text-gray-800">Verification Documents</h2>
              <p className="text-gray-600 mt-2">Upload required documents for manual verification</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Manual Review Required</span>
              </div>
              <p className="text-sm text-yellow-700">
                All professional accounts are manually reviewed to ensure community safety and trust.
                This process typically takes 1-3 business days.
              </p>
            </div>

            <div className="space-y-4">
              {userType === 'veterinarian' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Veterinary License <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('veterinaryLicense', e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              {(userType === 'pet-store' || userType === 'veterinarian') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business License <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('businessLicense', e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              {userType === 'organization' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Non-Profit Certification <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">501(c)(3) or equivalent documentation</p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('nonprofitCertification', e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance Proof (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Liability insurance documentation</p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('insuranceProof', e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your documents will be reviewed within 1-3 business days</li>
                <li>• You'll receive an email notification about your verification status</li>
                <li>• Once approved, you can start connecting with the pet community</li>
                <li>• If additional information is needed, we'll contact you directly</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getMaxSteps = () => {
    return userType === 'pet-parent' ? 2 : 4;
  };

  const canContinue = () => {
    switch (step) {
      case 1:
        return userData.name && userData.email && userData.bio && userData.location;
      case 2:
        return userData.phone && (userType === 'pet-parent' || (userData.address && userData.businessHours));
      case 3:
        return userType === 'pet-parent' || 
               (userType === 'veterinarian' && userData.specialties.length > 0) ||
               ((userType === 'pet-store' || userType === 'organization') && userData.services.length > 0);
      case 4:
        return userType === 'pet-parent' || 
               (userType === 'veterinarian' && verificationDocs.veterinaryLicense && verificationDocs.businessLicense) ||
               (userType === 'pet-store' && verificationDocs.businessLicense) ||
               (userType === 'organization' && verificationDocs.nonprofitCertification);
      default:
        return false;
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
          {Array.from({ length: getMaxSteps() }, (_, i) => (
            <div
              key={i + 1}
              className={`w-8 h-1 rounded-full ${
                i + 1 <= step ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
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
          {step < getMaxSteps() ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canContinue()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-full hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={completeSetup}
              disabled={!canContinue()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-full hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {userType === 'pet-parent' ? 'Create Profile 🎉' : 'Submit for Verification 📋'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSetup;