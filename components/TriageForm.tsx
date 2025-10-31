// FIX: This file was empty, which caused an import error. This component provides a button to initiate the patient intake flow.
import React, { useState } from 'react';
import TriageFlow from './TriageFlow';
import { PlusIcon } from './icons/PlusIcon';

const TriageForm: React.FC = () => {
  const [showIntakeFlow, setShowIntakeFlow] = useState(false);

  if (showIntakeFlow) {
    return <TriageFlow onFlowComplete={() => setShowIntakeFlow(false)} />;
  }

  return (
    <div className="bg-sentina-blue-dark p-6 rounded-2xl shadow-lg text-center">
      <h3 className="text-xl font-bold text-sentina-gray mb-4">New Patient Intake</h3>
      <p className="text-sentina-blue-light mb-6">
        Initiate the intake process for a new patient arrival.
      </p>
      <button
        onClick={() => setShowIntakeFlow(true)}
        className="w-full flex items-center justify-center space-x-2 bg-sentina-cyan hover:bg-opacity-80 text-sentina-blue-deep font-bold py-3 px-4 rounded-lg transition-all text-lg"
      >
        <PlusIcon className="h-6 w-6" />
        <span>Start Triage</span>
      </button>
    </div>
  );
};

export default TriageForm;
