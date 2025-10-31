
import React from 'react';
import { UserRole } from '../types';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { LogoutIcon } from './icons/LogoutIcon';

interface HeaderProps {
  userRole: UserRole;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ userRole, onSignOut }) => {
  return (
    <header className="bg-background-primary/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 64 64">
                <g fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M46 20 V42 a6 6 0 0 1 -6 6 H20" stroke="#8E8E93" />
                    <path d="M18 44 V22 a6 6 0 0 1 6 -6 H42" stroke="#2a9b7d" />
                </g>
            </svg>
            <h1 className="text-2xl sm:text-3xl font-bold text-accent-green tracking-wider">
              SENTINA
            </h1>
            <span className="hidden md:block text-sm text-text-secondary mt-1">AI Perfusion Engine</span>
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-2 p-2 rounded-lg bg-background-secondary">
                <UserGroupIcon className="h-6 w-6 text-text-secondary" />
                <span className="font-semibold text-text-primary">{userRole}</span>
             </div>
             <button
                onClick={onSignOut}
                className="flex items-center space-x-2 bg-background-secondary text-text-primary rounded-md px-3 py-2 border-2 border-transparent hover:border-accent-red focus:outline-none focus:ring-2 focus:ring-accent-red transition-colors"
                aria-label="Sign Out"
             >
                <LogoutIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;