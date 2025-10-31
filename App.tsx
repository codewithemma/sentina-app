import React, { useState } from 'react';
import Header from './components/Header';
import { UserRole } from './types';
import ChargeNurseDashboard from './components/ChargeNurseDashboard';
import TriageNurseDashboard from './components/TriageNurseDashboard';
import SignIn from './components/SignIn';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const handleSignIn = (role: UserRole) => {
    setUserRole(role);
  };

  const handleSignOut = () => {
    setUserRole(null);
  };

  if (!userRole) {
    return <SignIn onSignIn={handleSignIn} />;
  }

  const renderDashboard = () => {
    switch (userRole) {
      case UserRole.TRIAGE_NURSE:
        return <TriageNurseDashboard />;
      case UserRole.CHARGE_NURSE:
      case UserRole.ADMINISTRATOR:
        return <ChargeNurseDashboard userRole={userRole} />;
      default:
        return <TriageNurseDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background-primary font-sans">
      <Header userRole={userRole} onSignOut={handleSignOut} />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default App;