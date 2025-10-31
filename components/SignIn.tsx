
import React, { useState } from 'react';
import { UserRole } from '../types';

interface SignInProps {
    onSignIn: (role: UserRole) => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
    const [role, setRole] = useState<UserRole>(UserRole.TRIAGE_NURSE);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSignIn(role);
    };

    return (
        <div className="min-h-screen bg-background-primary flex flex-col items-center p-4 selection:bg-accent-cyan selection:text-background-primary">
            <main className="w-full max-w-md flex flex-col justify-center flex-grow">
                <div className="text-center mb-10">
                    <div className="flex flex-col items-center justify-center space-y-4 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" viewBox="0 0 64 64">
                            <g fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M46 20 V42 a6 6 0 0 1 -6 6 H20" stroke="#8E8E93" />
                                <path d="M18 44 V22 a6 6 0 0 1 6 -6 H42" stroke="#2a9b7d" />
                            </g>
                        </svg>
                        <h1 className="text-5xl font-bold text-accent-green tracking-wider">SENTINA</h1>
                    </div>
                    <p className="text-lg text-text-secondary">AI Perfusion Engine for Emergency Departments</p>
                </div>

                <div className="w-full bg-background-secondary p-8 rounded-2xl shadow-2xl">
                    <h2 className="text-3xl font-bold text-text-primary text-center mb-1">Staff Access</h2>
                    <p className="text-center text-text-secondary mb-8">Sign in to continue.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">Work Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full p-3 bg-background-tertiary rounded-md border-2 border-border-light focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all"
                                placeholder="alex.ray@hospital.org"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                className="w-full p-3 bg-background-tertiary rounded-md border-2 border-border-light focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-text-secondary mb-2">Select Your Role</label>
                            <select
                                id="role"
                                name="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value as UserRole)}
                                required
                                className="w-full p-3 bg-background-tertiary rounded-md border-2 border-border-light focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all appearance-none bg-no-repeat bg-right-4"
                                style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238E8E93' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`}}
                            >
                                {Object.values(UserRole).map(roleOption => (
                                    <option key={roleOption} value={roleOption} className="bg-background-secondary text-text-primary">
                                        {roleOption}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full !mt-8 bg-accent-cyan hover:bg-opacity-80 text-background-primary font-bold py-3 px-4 rounded-lg transition-all text-lg shadow-lg shadow-cyan-glow transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-accent-cyan/50"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </main>
            
            <footer className="py-4 text-center text-sm text-text-secondary/50">
                <p>&copy; {new Date().getFullYear()} SENTINA. All rights reserved.</p>
                <p>Ensuring equitable and efficient care for all.</p>
            </footer>
        </div>
    );
};

export default SignIn;
