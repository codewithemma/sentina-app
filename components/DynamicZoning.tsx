
import React from 'react';
import { Zone, UserRole } from '../types';
import { BedIcon } from './icons/BedIcon';

const mockZones: Zone[] = [
  { id: 'z1', name: 'Acuity Beds', type: 'Acuity', capacity: 20, occupied: 18, status: 'Operational' },
  { id: 'z2', name: 'Fast Track', type: 'FastTrack', capacity: 12, occupied: 10, status: 'Operational' },
  { id: 'z3', name: 'Overflow Area', type: 'Overflow', capacity: 5, occupied: 1, status: 'Operational' },
  { id: 'z4', name: 'Isolation Bays', type: 'Isolation', capacity: 2, occupied: 2, status: 'Surge' },
];

interface DynamicZoningProps {
    userRole: UserRole;
}

const DynamicZoning: React.FC<DynamicZoningProps> = ({ userRole }) => {
  const isActionable = userRole === UserRole.CHARGE_NURSE || userRole === UserRole.ADMINISTRATOR;

  const getZoneBorderColor = (zone: Zone) => {
    const usage = zone.occupied / zone.capacity;
    if (zone.status === 'Surge') return 'border-accent-red';
    if (usage > 0.85) return 'border-accent-orange';
    if (usage > 0.6) return 'border-accent-yellow';
    return 'border-accent-green';
  };
  
  return (
    <div className="bg-background-secondary p-6 rounded-2xl">
      <h3 className="text-xl font-bold text-text-primary mb-4">Dynamic Zoning Control</h3>
      <div className="space-y-4">
        {mockZones.map((zone) => (
          <div key={zone.id} className={`p-4 rounded-lg border-l-4 bg-background-tertiary/50 transition-all ${getZoneBorderColor(zone)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BedIcon className="h-6 w-6 text-text-secondary"/>
                <div>
                  <p className="font-semibold text-text-primary">{zone.name}</p>
                  <p className="text-sm text-text-secondary">{zone.occupied} / {zone.capacity} Occupied</p>
                </div>
              </div>
              {isActionable && (
                <button className="bg-background-tertiary hover:bg-border-light text-text-primary text-xs font-bold py-1 px-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Re-Zone
                </button>
              )}
            </div>
          </div>
        ))}
        {isActionable && (
          <button className="w-full mt-4 bg-accent-cyan hover:bg-opacity-80 text-background-primary font-bold py-3 px-4 rounded-lg transition-all">
            Initiate Surge Protocol
          </button>
        )}
      </div>
    </div>
  );
};

export default DynamicZoning;