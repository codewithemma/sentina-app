
import React from 'react';
import { Ambulance } from '../types';
import { AmbulanceIcon } from './icons/AmbulanceIcon';

const mockAmbulances: Ambulance[] = [
  { id: 'a1', etaMinutes: 8, acuity: 'High', patientCount: 1 },
  { id: 'a2', etaMinutes: 15, acuity: 'Medium', patientCount: 1 },
  { id: 'a3', etaMinutes: 22, acuity: 'Low', patientCount: 2 },
];

const AmbulancePrediction: React.FC = () => {
  const getAcuityColor = (acuity: 'High' | 'Medium' | 'Low') => {
    switch (acuity) {
      case 'High': return 'bg-accent-red text-white';
      case 'Medium': return 'bg-accent-orange text-white';
      case 'Low': return 'bg-accent-yellow text-background-primary';
    }
  };

  return (
    <div className="bg-background-secondary p-6 rounded-2xl h-full">
      <h3 className="text-lg font-semibold text-text-secondary mb-4">Ambulance Triage Prediction</h3>
      <div className="space-y-3">
        {mockAmbulances.map(ambulance => (
          <div key={ambulance.id} className="flex items-center justify-between bg-background-tertiary/50 p-3 rounded-lg">
            <div className="flex items-center space-x-3">
              <AmbulanceIcon className="h-6 w-6 text-accent-cyan" />
              <div>
                <p className="font-semibold text-text-primary">{ambulance.patientCount} Patient{ambulance.patientCount > 1 ? 's' : ''}</p>
                <p className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${getAcuityColor(ambulance.acuity)}`}>{ambulance.acuity} Acuity</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-text-primary">{ambulance.etaMinutes}</p>
              <p className="text-xs text-text-secondary -mt-1">min ETA</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmbulancePrediction;