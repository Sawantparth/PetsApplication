import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import WelcomeScreen from './components/WelcomeScreen';
import UserSetup from './components/UserSetup';
import VerificationPending from './components/VerificationPending';
import ProfileSetup from './components/ProfileSetup';
import MainApp from './components/MainApp';

const AppContent: React.FC = () => {
  const { currentScreen, currentUser } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'user-setup':
        return <UserSetup />;
      case 'verification-pending':
        return <VerificationPending />;
      case 'profile-setup':
        return <ProfileSetup />;
      case 'main':
      case 'discovery':
      case 'business-discovery':
      case 'matches':
      case 'chat':
      case 'profile':
        return <MainApp />;
      default:
        return <WelcomeScreen />;
    }
  };

  return <div className="min-h-screen">{renderScreen()}</div>;
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;