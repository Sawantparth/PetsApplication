import React from 'react';
import { Clock, Mail, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const VerificationPending: React.FC = () => {
  const { currentUser, setCurrentScreen } = useApp();

  if (!currentUser) return null;

  const getStatusColor = () => {
    switch (currentUser.verificationStatus) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStatusIcon = () => {
    switch (currentUser.verificationStatus) {
      case 'approved':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-16 h-16 text-red-500" />;
      default:
        return <Clock className="w-16 h-16 text-yellow-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (currentUser.verificationStatus) {
      case 'approved':
        return {
          title: 'Verification Approved! 🎉',
          message: 'Welcome to the PawMates community! You can now start connecting with pet parents and offering your services.',
          action: 'Start Connecting'
        };
      case 'rejected':
        return {
          title: 'Verification Needs Attention',
          message: 'We need additional information to complete your verification. Please check your email for details on what\'s needed.',
          action: 'Contact Support'
        };
      default:
        return {
          title: 'Verification in Progress',
          message: 'Thank you for submitting your verification documents! Our team is reviewing your application.',
          action: 'Check Status'
        };
    }
  };

  const status = getStatusMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          {getStatusIcon()}
        </div>

        <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
          {status.title}
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          {status.message}
        </p>

        {currentUser.verificationStatus === 'pending' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">What's happening now?</h3>
            <ul className="text-sm text-blue-700 space-y-2 text-left">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Our verification team is reviewing your documents</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>You'll receive an email notification within 1-3 business days</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Once approved, you can start using all platform features</span>
              </li>
            </ul>
          </div>
        )}

        {currentUser.verificationStatus === 'approved' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">You're all set! 🎉</h3>
            <ul className="text-sm text-green-700 space-y-1 text-left">
              <li>✅ Profile verified and active</li>
              <li>✅ Can connect with pet parents</li>
              <li>✅ Can offer services to the community</li>
              <li>✅ Access to all platform features</li>
            </ul>
          </div>
        )}

        {currentUser.verificationStatus === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-800 mb-2">Next Steps</h3>
            <ul className="text-sm text-red-700 space-y-1 text-left">
              <li>📧 Check your email for specific requirements</li>
              <li>📋 Resubmit any missing or unclear documents</li>
              <li>📞 Contact support if you need assistance</li>
            </ul>
          </div>
        )}

        <div className="space-y-3">
          {currentUser.verificationStatus === 'approved' ? (
            <button
              onClick={() => setCurrentScreen('main')}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-full hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105"
            >
              {status.action}
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
            >
              Refresh Status
            </button>
          )}

          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <a href="mailto:support@pawmates.com" className="flex items-center space-x-1 hover:text-purple-600">
              <Mail className="w-4 h-4" />
              <span>Contact Support</span>
            </a>
            <span>•</span>
            <button
              onClick={() => setCurrentScreen('welcome')}
              className="hover:text-purple-600"
            >
              Back to Home
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Verification ensures community safety and trust</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;