import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Heart, Image, MapPin, Award } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ChatScreen: React.FC = () => {
  const { matches, messages, sendMessage, markMessagesAsRead, setCurrentScreen, currentPet } = useApp();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedMatchId = sessionStorage.getItem('selectedMatchId');
  const selectedMatch = matches.find(match => match.id === selectedMatchId);
  const chatMessages = messages.filter(msg => msg.matchId === selectedMatchId);

  useEffect(() => {
    if (selectedMatchId) {
      markMessagesAsRead(selectedMatchId);
    }
  }, [selectedMatchId, markMessagesAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedMatchId) return;
    
    sendMessage(selectedMatchId, newMessage.trim());
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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

  if (!selectedMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🐾</div>
          <p className="text-gray-600">No match selected</p>
          <button
            onClick={() => setCurrentScreen('matches')}
            className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
          >
            Go back to matches
          </button>
        </div>
      </div>
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const playdateStarters = [
    `Would ${selectedMatch.pet.name} like to meet ${currentPet?.name} at the dog park this weekend?`,
    `${currentPet?.name} loves ${selectedMatch.pet.interests[0]?.toLowerCase()} too! Want to set up a playdate?`,
    `Hi! ${currentPet?.name} would love to make a new friend. How about a meetup?`,
    `Your ${selectedMatch.pet.name} looks adorable! ${currentPet?.name} would love to play together!`
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center space-x-4 border-b">
        <button
          onClick={() => setCurrentScreen('matches')}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="relative">
          <img
            src={selectedMatch.pet.photos[0]}
            alt={selectedMatch.pet.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
          />
          <div className="absolute -bottom-1 -right-1 text-lg bg-white rounded-full border border-gray-200 w-6 h-6 flex items-center justify-center">
            {getPetTypeEmoji(selectedMatch.pet.petType)}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h2 className="font-semibold text-gray-900">{selectedMatch.pet.name}</h2>
            <span className="text-sm text-gray-500">{selectedMatch.pet.age}y</span>
            {selectedMatch.pet.verified && (
              <Award className="w-4 h-4 text-blue-500" />
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <MapPin className="w-3 h-3" />
            <span>{selectedMatch.pet.distance} miles away</span>
            <span>•</span>
            <span>{selectedMatch.pet.breed}</span>
          </div>
        </div>

        <button className="p-2 rounded-full hover:bg-gray-100">
          <Heart className="w-6 h-6 text-pink-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-3xl">🎾</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              You matched with {selectedMatch.pet.name}! 🎉
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Start planning an awesome playdate for your furry friends!
            </p>
            
            {/* Suggested conversation starters */}
            <div className="bg-white rounded-lg p-4 border border-purple-200 max-w-sm mx-auto">
              <p className="text-sm font-medium text-purple-700 mb-3">💬 Conversation starters:</p>
              <div className="space-y-2">
                {playdateStarters.slice(0, 2).map((starter, index) => (
                  <button
                    key={index}
                    onClick={() => setNewMessage(starter)}
                    className="block w-full text-left p-3 text-sm bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-lg border border-purple-200 text-purple-700 transition-colors"
                  >
                    "{starter}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {chatMessages.map((message) => {
              const isCurrentUser = message.senderId === currentPet?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      isCurrentUser
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white text-gray-800 border border-purple-100'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isCurrentUser ? 'text-purple-100' : 'text-gray-500'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <div className="flex items-end space-x-3">
          <button className="p-2 text-purple-400 hover:text-purple-600">
            <Image className="w-6 h-6" />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Plan a playdate for ${currentPet?.name} and ${selectedMatch.pet.name}...`}
              className="w-full p-3 pr-12 border border-purple-200 rounded-full resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent max-h-20"
              rows={1}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="absolute right-2 bottom-2 p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex space-x-2 mt-3">
          <button
            onClick={() => setNewMessage(`Would you like to meet at the dog park this weekend? 🎾`)}
            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 transition-colors"
          >
            🏞️ Dog Park
          </button>
          <button
            onClick={() => setNewMessage(`${currentPet?.name} would love a playdate! When works for you? 🐕`)}
            className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs hover:bg-pink-200 transition-colors"
          >
            📅 Schedule
          </button>
          <button
            onClick={() => setNewMessage(`Your ${selectedMatch.pet.name} looks so sweet! 💕`)}
            className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs hover:bg-orange-200 transition-colors"
          >
            💕 Compliment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;