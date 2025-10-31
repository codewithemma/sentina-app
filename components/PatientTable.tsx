
import React from 'react';
import { Patient, PatientAcuity } from '../types';

const mockPatients: Patient[] = [
  { id: 'P8450', acuity: PatientAcuity.CRITICAL, perfusionScore: 92, location: 'Acuity Bed 3', waitTimeMinutes: 5, riskFactor: 'High', notes: 'Chest pain, SOB' },
  { id: 'P8448', acuity: PatientAcuity.EMERGENT, perfusionScore: 85, location: 'Acuity Bed 7', waitTimeMinutes: 18, riskFactor: 'High', notes: 'Abdominal pain' },
  { id: 'P8451', acuity: PatientAcuity.URGENT, perfusionScore: 75, location: 'Fast Track 2', waitTimeMinutes: 45, riskFactor: 'Medium', notes: 'Laceration, needs sutures' },
  { id: 'P8432', acuity: PatientAcuity.URGENT, perfusionScore: 78, location: 'Waiting Room', waitTimeMinutes: 125, riskFactor: 'Medium', notes: 'Fever, cough' },
  { id: 'P8445', acuity: PatientAcuity.SEMI_URGENT, perfusionScore: 65, location: 'Waiting Room', waitTimeMinutes: 210, riskFactor: 'Low', notes: 'Sprained ankle' },
  { id: 'P8440', acuity: PatientAcuity.NON_URGENT, perfusionScore: 50, location: 'Waiting Room', waitTimeMinutes: 350, riskFactor: 'Low', notes: 'Prescription refill' },
];

const PatientTable: React.FC = () => {

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

  return (
    <div className="bg-background-secondary p-6 rounded-2xl">
      <h3 className="text-xl font-bold text-text-primary mb-4">Patient Status Board</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border-light">
              <th className="p-2 sm:p-3 text-sm font-semibold text-text-secondary">Patient ID</th>
              <th className="p-2 sm:p-3 text-sm font-semibold text-text-secondary">Acuity</th>
              <th className="p-2 sm:p-3 text-sm font-semibold text-text-secondary">Perfusion Score</th>
              <th className="p-2 sm:p-3 text-sm font-semibold text-text-secondary">Location</th>
              <th className="p-2 sm:p-3 text-sm font-semibold text-text-secondary">Wait (min)</th>
            </tr>
          </thead>
          <tbody>
            {mockPatients.map((patient) => (
              <tr key={patient.id} className="border-b border-border-dark hover:bg-background-tertiary/50 transition-colors">
                <td className="p-2 sm:p-3 font-medium text-text-primary">{patient.id}</td>
                <td className="p-2 sm:p-3">
                  <span className={`px-2 sm:px-3 py-1 text-xs font-bold rounded-full ${getAcuityStyle(patient.acuity)}`}>
                    ESI {patient.acuity}
                  </span>
                </td>
                <td className={`p-2 sm:p-3 font-bold ${patient.perfusionScore > 80 ? 'text-accent-green' : patient.perfusionScore > 60 ? 'text-accent-yellow' : 'text-accent-red'}`}>
                  {patient.perfusionScore}%
                </td>
                <td className="p-2 sm:p-3 text-text-primary">{patient.location}</td>
                <td className={`p-2 sm:p-3 font-medium ${patient.waitTimeMinutes > 120 ? 'text-accent-red animate-pulse-fast' : patient.waitTimeMinutes > 60 ? 'text-accent-orange' : 'text-text-primary'}`}>
                  {patient.waitTimeMinutes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientTable;