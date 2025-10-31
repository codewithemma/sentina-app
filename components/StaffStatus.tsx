import React from 'react';
import { StaffMember } from '../types';
import { UserGroupIcon } from './icons/UserGroupIcon';

const mockStaff: StaffMember[] = [
    { id: 's1', name: 'Dr. Anya Sharma', role: 'MD', languages: ['English', 'Hindi'], certifications: ['ACLS', 'PALS'], status: 'Available' },
    { id: 's2', name: 'RN Carlos Rey', role: 'RN', languages: ['English', 'Spanish'], certifications: ['TNCC'], status: 'Available' },
    { id: 's3', name: 'Tech Maria V.', role: 'Tech', languages: ['English'], certifications: [], status: 'On Break' },
    { id: 's4', name: 'RN Charon', role: 'RN', languages: ['English', 'Russian'], certifications: ['Isolation Certified'], status: 'Available' },
    { id: 's5', name: 'Dr. Ben Carter', role: 'MD', languages: ['English'], certifications: ['ATLS'], status: 'Unavailable' },
];

const StaffStatus: React.FC = () => {

    const getStatusColor = (status: StaffMember['status']) => {
        switch (status) {
            case 'Available': return 'bg-accent-green';
            case 'On Break': return 'bg-accent-yellow';
            case 'Unavailable': return 'bg-accent-red';
        }
    }
    
    return (
        <div className="bg-background-secondary p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-text-primary mb-4">Staff Status</h3>
            <div className="space-y-3">
                {mockStaff.map(staff => (
                    <div key={staff.id} className="flex items-center justify-between bg-background-tertiary/50 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <UserGroupIcon className="h-6 w-6 text-text-secondary" />
                            <div>
                                <p className="font-semibold text-text-primary">{staff.name} <span className="text-xs text-text-secondary">({staff.role})</span></p>
                                <p className="text-xs text-text-secondary">{staff.languages.join(', ')}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-text-primary">{staff.status}</span>
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(staff.status)}`}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StaffStatus;