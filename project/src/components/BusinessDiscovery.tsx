import React, { useState } from 'react';
import { MapPin, Star, Phone, Globe, Clock, Award, Filter } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const BusinessDiscovery: React.FC = () => {
  const { discoveryUsers, connectWithUser, filters, setFilters } = useApp();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Services', icon: '🏪' },
    { id: 'veterinarian', name: 'Veterinarians', icon: '🩺' },
    { id: 'pet-store', name: 'Pet Stores', icon: '🛍️' },
    { id: 'organization', name: 'Organizations', icon: '🏢' }
  ];

  const filteredUsers = discoveryUsers.filter(user => {
    if (selectedCategory !== 'all' && user.userType !== selectedCategory) return false;
    return user.verified; // Only show verified businesses
  });

  const handleConnect = (userId: string, userType: string) => {
    const connectionType = userType === 'veterinarian' ? 'business-service' : 
                          userType === 'pet-store' ? 'business-service' : 
                          'organization-support';
    connectWithUser(userId, connectionType);
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'veterinarian':
        return 'bg-purple-100 text-purple-800';
      case 'pet-store':
        return 'bg-green-100 text-green-800';
      case 'organization':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Pet Services & Support
          </h1>
          <button
            onClick={() => setShowFilters(true)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Filter className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Business Cards */}
      <div className="p-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No services found</h2>
            <p className="text-gray-600">Try adjusting your filters or check back later!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map(user => (
              <div
                key={user.id}
                className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start space-x-4">
                    <img
                      src={user.profilePhoto}
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-gray-900 truncate">{user.name}</h3>
                        {user.verified && (
                          <Award className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserTypeColor(user.userType)}`}>
                          {user.userType === 'veterinarian' && '🩺 Veterinarian'}
                          {user.userType === 'pet-store' && '🛍️ Pet Store'}
                          {user.userType === 'organization' && '🏢 Organization'}
                        </span>
                        
                        {user.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{user.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{user.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{user.bio}</p>

                  {/* Services/Specialties */}
                  {(user.specialties || user.services) && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-800 mb-2">
                        {user.userType === 'veterinarian' ? 'Specialties' : 'Services'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(user.specialties || user.services || []).slice(0, 3).map(item => (
                          <span
                            key={item}
                            className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                          >
                            {item}
                          </span>
                        ))}
                        {(user.specialties || user.services || []).length > 3 && (
                          <span className="text-gray-500 text-xs">
                            +{(user.specialties || user.services || []).length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    {user.businessHours && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 truncate">{user.businessHours}</span>
                      </div>
                    )}
                    
                    {user.contactInfo.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{user.contactInfo.phone}</span>
                      </div>
                    )}
                    
                    {user.contactInfo.website && (
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <a 
                          href={user.contactInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700 truncate"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleConnect(user.id, user.userType)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
                    >
                      {user.userType === 'veterinarian' && '📞 Consult'}
                      {user.userType === 'pet-store' && '🛍️ Shop'}
                      {user.userType === 'organization' && '🤝 Connect'}
                    </button>
                    
                    <button className="px-4 py-2 border border-purple-300 text-purple-600 rounded-full font-medium hover:bg-purple-50 transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Filter Services</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <select
                  value={filters.userType}
                  onChange={(e) => setFilters({...filters, userType: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Services</option>
                  <option value="veterinarian">Veterinarians</option>
                  <option value="pet-store">Pet Stores</option>
                  <option value="organization">Organizations</option>
                </select>
              </div>

              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDiscovery;