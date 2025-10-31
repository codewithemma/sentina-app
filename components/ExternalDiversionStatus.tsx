
import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';
import { ExternalHospital, TriagePatient } from '../types';
import { ShareIcon } from './icons/ShareIcon';

const mockHospitals: ExternalHospital[] = [
  { name: 'Massachusetts General Hospital', address: '55 Fruit St, Boston, MA 02114', distance: '3.5 mi', traumaBaysAvailable: 2, status: 'Accepting' },
  { name: 'St. Jude Medical Center', address: '456 Oak Ave, Cityville', distance: '5.1 mi', traumaBaysAvailable: 0, status: 'At Capacity' },
  { name: 'County Trauma Center', address: '789 Pine Rd, County Seat', distance: '8.2 mi', traumaBaysAvailable: 0, status: 'On Diversion' },
  { name: 'North Valley Clinic', address: '101 Birch Blvd, Northtown', distance: '10.4 mi', traumaBaysAvailable: 3, status: 'Accepting' },
];

interface ExternalDiversionStatusProps {
  onClose: () => void;
  patients: TriagePatient[];
}

type TransferStep = 'list' | 'select_patient' | 'form' | 'confirmation';

const ExternalDiversionStatus: React.FC<ExternalDiversionStatusProps> = ({ onClose, patients }) => {
  const [step, setStep] = useState<TransferStep>('list');
  const [selectedHospital, setSelectedHospital] = useState<ExternalHospital | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<TriagePatient | null>(null);
  const [handoffNote, setHandoffNote] = useState('');
  const [transferId, setTransferId] = useState('');
  const [shareFeedback, setShareFeedback] = useState<string>('');


  const getStatusColor = (status: ExternalHospital['status']) => {
    switch (status) {
      case 'Accepting': return 'bg-accent-green text-background-primary';
      case 'At Capacity': return 'bg-accent-yellow text-background-primary';
      case 'On Diversion': return 'bg-accent-red text-white';
    }
  };
  
  const handleRequestBed = (hospital: ExternalHospital) => {
    if (hospital.status !== 'Accepting') return;
    setSelectedHospital(hospital);
    setStep('select_patient');
  }

  const handleSelectPatient = (patient: TriagePatient) => {
    setSelectedPatient(patient);
    setStep('form');
  }
  
  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handoffNote.trim()) {
        alert("Handoff note is mandatory.");
        return;
    }
    const newTransferId = `SNTN-T-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setTransferId(newTransferId);
    setStep('confirmation');
  }

  const renderHospitalList = () => (
    <>
      <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6">Nearby Hospital Diversion Status</h2>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {mockHospitals.map((hospital) => (
          <div key={hospital.name} className="bg-background-tertiary/50 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-lg sm:text-xl text-text-primary">{hospital.name}</p>
                <p className="text-md text-text-secondary">{hospital.distance} away</p>
                <p className="text-sm text-text-secondary">Trauma Bays Available: {hospital.traumaBaysAvailable}</p>
              </div>
              <span className={`px-4 py-2 text-sm font-bold rounded-full whitespace-nowrap ${getStatusColor(hospital.status)}`}>
                {hospital.status}
              </span>
            </div>
            {hospital.status === 'Accepting' && (
              <button 
                onClick={() => handleRequestBed(hospital)}
                className="w-full mt-3 bg-accent-cyan hover:bg-opacity-80 text-background-primary font-bold py-2 px-4 rounded-lg transition-all text-sm sm:text-md"
              >
                Check Availability
              </button>
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-text-secondary mt-6">Data updated in real-time. Last updated: just now.</p>
    </>
  );

  const renderPatientSelector = () => (
     <>
      <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">Select Patient to Transfer</h2>
      <p className="text-text-secondary mb-6">To: <span className="font-bold text-text-primary">{selectedHospital?.name}</span></p>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {patients.length > 0 ? (
            patients.map(p => (
                <button key={p.id} onClick={() => handleSelectPatient(p)} className="w-full text-left bg-background-tertiary/50 hover:bg-border-light p-4 rounded-lg transition-colors">
                    <p className="font-bold text-base sm:text-lg text-text-primary">{p.name} (ESI: {p.esiLevel})</p>
                    <p className="text-sm text-text-secondary">{p.chiefComplaint}</p>
                </button>
            ))
        ) : (
            <div className="text-center p-8 text-text-secondary bg-background-tertiary/50 rounded-lg">
                <p className="font-semibold text-lg text-text-primary">No Patients in Triage</p>
                <p className="mt-2">There are currently no patients waiting in triage to be transferred.</p>
            </div>
        )}
      </div>
      <button onClick={() => setStep('list')} className="mt-6 text-accent-cyan hover:underline">Back to Hospital List</button>
     </>
  );

  const renderRequestForm = () => (
    <form onSubmit={handleSubmitRequest}>
      <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">External Bed Request</h2>
      <p className="text-text-secondary mb-6">To: <span className="font-bold text-text-primary">{selectedHospital?.name}</span></p>

      <div className="bg-background-tertiary/50 p-4 rounded-lg mb-4">
        <h3 className="text-sm font-semibold text-text-secondary mb-1">Patient Summary</h3>
        <p className="font-bold text-xl text-text-primary">{selectedPatient?.name}</p>
        <p>ESI Level: {selectedPatient?.esiLevel}</p>
        <p>Chief Complaint: {selectedPatient?.chiefComplaint}</p>
      </div>

      <div>
        <label htmlFor="handoffNote" className="text-lg font-semibold text-text-secondary">Handoff Note (Mandatory)</label>
        <textarea 
            id="handoffNote"
            value={handoffNote}
            onChange={(e) => setHandoffNote(e.target.value)}
            rows={4}
            required
            className="w-full mt-2 p-3 bg-background-tertiary rounded-md border-2 border-border-light focus:outline-none focus:ring-2 focus:ring-accent-cyan text-lg"
            placeholder="e.g., Requires immediate Ortho consult..."
        />
      </div>

      <button type="submit" className="w-full mt-6 bg-accent-cyan hover:bg-opacity-80 text-background-primary font-bold py-3 px-4 rounded-lg transition-all text-base sm:text-lg">
        Submit External Transfer Request
      </button>
      <button type="button" onClick={() => setStep('select_patient')} className="w-full mt-3 text-accent-cyan hover:underline">Back to Patient Selection</button>
    </form>
  );

  const renderConfirmation = () => {
    const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(`${selectedHospital?.name}, ${selectedHospital?.address}`)}`;
    
    const handleShare = async () => {
        if (!selectedHospital || !transferId) return;

        const shareText = `SENTINA Patient Transfer:\n\nTransfer ID: ${transferId}\nDestination: ${selectedHospital.name}\nAddress: ${selectedHospital.address}\n\nNavigation: ${mapUrl}`;
        const shareData = {
            title: 'Patient Transfer Details',
            text: shareText,
            url: mapUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareText);
                setShareFeedback('Copied to clipboard!');
            } catch (error) {
                console.error('Error copying to clipboard:', error);
                setShareFeedback('Failed to copy.');
            }
        }
        
        setTimeout(() => setShareFeedback(''), 3000);
    };
    
    return (
    <div>
        <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-accent-green">Transfer Request Confirmed</h2>
            <p className="text-text-secondary">The patient's bed is reserved upon arrival.</p>
        </div>
        <div className="bg-background-tertiary/50 p-4 rounded-lg text-center mb-4">
            <p className="text-sm font-semibold text-text-secondary">Transfer ID</p>
            <p className="font-mono text-3xl sm:text-4xl font-bold text-accent-cyan tracking-widest my-2">{transferId}</p>
        </div>

        <div className="bg-background-tertiary/50 p-4 rounded-lg mb-4">
            <h3 className="text-sm font-semibold text-text-secondary">Destination</h3>
            <p className="font-bold text-lg sm:text-xl text-text-primary">{selectedHospital?.name}</p>
            <p className="text-md text-text-secondary">{selectedHospital?.address}</p>
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline font-semibold">View on Map</a>
        </div>
        
        <div className="bg-background-tertiary/50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-text-secondary">Handover Instructions</h3>
            <ol className="list-decimal list-inside text-text-primary mt-2 space-y-1">
                <li>Present Transfer ID <span className="font-bold">{transferId}</span> to security/triage.</li>
                <li>Proceed directly to the assigned wing/department.</li>
                <li>Provide handoff note to receiving nurse.</li>
            </ol>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={handleShare} className="flex items-center justify-center space-x-2 bg-background-tertiary hover:bg-border-light text-text-primary font-bold py-3 px-4 rounded-lg transition-colors text-base sm:text-lg">
                <ShareIcon className="h-5 w-5" />
                <span>Share Details</span>
            </button>
             <button onClick={onClose} className="bg-accent-green hover:bg-opacity-80 text-white font-bold py-3 px-4 rounded-lg transition-colors text-base sm:text-lg">
                Done
            </button>
        </div>
         {shareFeedback && <p className="text-center text-sm text-accent-cyan mt-4 animate-fade-in">{shareFeedback}</p>}
    </div>
  )};

  const renderContent = () => {
    switch (step) {
      case 'list': return renderHospitalList();
      case 'select_patient': return renderPatientSelector();
      case 'form': return renderRequestForm();
      case 'confirmation': return renderConfirmation();
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background-primary/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-background-secondary rounded-2xl shadow-2xl p-6 sm:p-8 border border-border-light relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary z-10 p-2">
          <XIcon className="h-7 w-7" />
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default ExternalDiversionStatus;
