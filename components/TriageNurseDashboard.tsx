
import React, { useState, useEffect } from 'react';
import TriageFlow from './TriageFlow';
import { PlusIcon } from './icons/PlusIcon';
import { PatientAcuity, TriagePatient } from '../types';
import FlowControlCard from './FlowControlCard';
import { BedIcon } from './icons/BedIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import ExternalDiversionStatus from './ExternalDiversionStatus';

const initialTriagePatients: TriagePatient[] = [
  { id: 'T001', name: 'Jane D.', esiLevel: PatientAcuity.URGENT, checkInTime: new Date(Date.now() - 15 * 60 * 1000), chiefComplaint: 'Severe abdominal pain' },
  { id: 'T002', name: 'John S.', esiLevel: PatientAcuity.SEMI_URGENT, checkInTime: new Date(Date.now() - 35 * 60 * 1000), chiefComplaint: 'Laceration on right arm' },
];

const mockCapacity = {
  availableRNs: 5,
  availableMDs: 2,
  availableBeds: 6,
  traumaBaysOpen: 2,
};

const TriageNurseDashboard: React.FC = () => {
  const [showIntakeFlow, setShowIntakeFlow] = useState(false);
  const [showDiversionStatus, setShowDiversionStatus] = useState(false);
  const [triagePatients, setTriagePatients] = useState<TriagePatient[]>(initialTriagePatients);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);
  
  const handleIntakeComplete = (newPatient?: TriagePatient) => {
    setShowIntakeFlow(false);
    if (newPatient) {
        setTriagePatients(currentPatients => [newPatient, ...currentPatients]);
    }
  };

  if (showIntakeFlow) {
    return <TriageFlow onFlowComplete={handleIntakeComplete} />;
  }

  const edStatus = { status: 'Optimal', homeostasis: 85 }; // Mock Data
  const isCritical = mockCapacity.availableBeds <= 2 || mockCapacity.availableRNs <= 2;

  const getStatusBarColor = () => {
    if (isCritical) return 'bg-accent-red text-white';
    if (edStatus.homeostasis < 75) return 'bg-accent-yellow text-background-primary';
    return 'bg-accent-green text-background-primary';
  }
  
  const getAcuityStyle = (acuity: PatientAcuity) => {
    switch (acuity) {
      case PatientAcuity.CRITICAL: return 'bg-accent-red text-white';
      case PatientAcuity.EMERGENT: return 'bg-accent-orange text-white';
      case PatientAcuity.URGENT: return 'bg-accent-yellow text-background-primary';
      case PatientAcuity.SEMI_URGENT: return 'bg-accent-green text-background-primary';
      case PatientAcuity.NON_URGENT: return 'bg-background-tertiary text-text-primary';
      default: return 'bg-text-secondary text-background-primary';
    }
  };

  const calculateWaitTime = (checkInTime: Date) => {
    const diffMs = currentTime.getTime() - checkInTime.getTime();
    return Math.round(diffMs / 60000); // in minutes
  };

  return (
    <>
      <div className="h-[calc(100vh-80px)] flex flex-col">
        {isCritical && (
          <div className="p-2 text-center font-bold text-lg bg-accent-red text-white animate-pulse-fast">
            URGENT: ED CAPACITY CRITICAL. CONSIDER DIVERSION.
          </div>
        )}
        <div className={`p-2 text-center font-semibold ${getStatusBarColor()} transition-colors`}>
          Current ED Status: {isCritical ? 'Critical' : edStatus.status}
        </div>

        <div className="flex-grow p-4 sm:p-6 overflow-y-auto pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <FlowControlCard 
              title="Staff Capacity"
              icon={<UserGroupIcon className="h-6 w-6 text-accent-cyan" />}
              stats={[
                { label: 'Available RNs', value: `${mockCapacity.availableRNs}` },
                { label: 'Available MDs', value: `${mockCapacity.availableMDs}` }
              ]}
            />
            <FlowControlCard 
              title="Bed Capacity"
              icon={<BedIcon className="h-6 w-6 text-accent-cyan" />}
              stats={[
                { label: 'Available Beds', value: `${mockCapacity.availableBeds}` },
                { label: 'Trauma Bays Open', value: `${mockCapacity.traumaBaysOpen}` }
              ]}
            />
            <div className="bg-background-secondary p-6 rounded-2xl flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-text-secondary">Diversion Status</h3>
              <button 
                onClick={() => setShowDiversionStatus(true)}
                className="w-full mt-2 bg-background-tertiary hover:bg-border-light text-text-primary font-bold py-3 px-4 rounded-lg transition-colors">
                  External Diversion Status (FR2.4)
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Current Patients in Triage</h2>
            <div className="bg-background-secondary rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border-light">
                      <th className="p-2 sm:p-4 text-sm font-semibold text-text-secondary">Name</th>
                      <th className="p-2 sm:p-4 text-sm font-semibold text-text-secondary">ESI</th>
                      <th className="p-2 sm:p-4 text-sm font-semibold text-text-secondary">Time Since Check-in</th>
                    </tr>
                  </thead>
                  <tbody>
                    {triagePatients.map((patient) => (
                      <tr key={patient.id} className="border-b border-border-dark last:border-b-0 hover:bg-background-tertiary/50">
                        <td className="p-2 sm:p-4 font-medium text-text-primary">{patient.name}</td>
                        <td className="p-2 sm:p-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${getAcuityStyle(patient.esiLevel)}`}>
                            ESI {patient.esiLevel}
                          </span>
                        </td>
                        <td className={`p-2 sm:p-4 font-medium ${calculateWaitTime(patient.checkInTime) > 30 ? 'text-accent-orange' : 'text-text-primary'}`}>{calculateWaitTime(patient.checkInTime)} min</td>
                      </tr>
                    ))}
                    {triagePatients.length === 0 && (
                        <tr>
                          <td colSpan={3} className="text-center p-8 text-text-secondary">No patients currently in triage.</td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background-primary/80 backdrop-blur-sm border-t border-border-light z-10">
          <button
            onClick={() => setShowIntakeFlow(true)}
            className="w-full max-w-lg mx-auto flex items-center justify-center space-x-2 sm:space-x-3 bg-accent-cyan hover:bg-opacity-80 text-background-primary font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full transition-all text-lg sm:text-xl shadow-lg shadow-cyan-glow transform hover:-translate-y-1"
          >
            <PlusIcon className="h-6 w-6 sm:h-8 sm:h-8" />
            <span>New Patient Intake</span>
          </button>
        </footer>
      </div>
      {showDiversionStatus && <ExternalDiversionStatus onClose={() => setShowDiversionStatus(false)} patients={triagePatients} />}
    </>
  );
};

export default TriageNurseDashboard;