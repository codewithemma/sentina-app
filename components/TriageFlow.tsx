

import React, { useState, useEffect, useRef } from 'react';
import { getRoutingRecommendation } from '../services/geminiService';
import { AIRecommendation, PatientIntakeData, TriagePatient } from '../types';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { XIcon } from './icons/XIcon';
import ToggleSwitch from './ToggleSwitch';

// Add a minimal interface for the non-standard SpeechRecognition API
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

interface TriageFlowProps {
    onFlowComplete: (newPatient?: TriagePatient) => void;
}

type TriageStep = 'intake' | 'loading' | 'recommendation' | 'override' | 'confirmation';

const TriageFlow: React.FC<TriageFlowProps> = ({ onFlowComplete }) => {
  const [step, setStep] = useState<TriageStep>('intake');
  const [intakeData, setIntakeData] = useState<PatientIntakeData>({
    patientName: '',
    age: 30,
    sex: 'Other',
    location: 'Waiting Room',
    chiefComplaint: '',
    bpSystolic: 120,
    bpDiastolic: 80,
    heartRate: 80,
    o2Sat: 98,
    temperature: 98.6,
    temperatureUnit: 'F',
    height: 68,
    heightUnit: 'in',
    esiLevel: 3,
    language: 'English',
    hasFever: false,
    isIsolationRisk: false,
    isVulnerable: false,
  });
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [routedPatient, setRoutedPatient] = useState<TriagePatient | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const flowContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.onresult = (event) => {
            setIntakeData(prev => ({...prev, chiefComplaint: event.results[0][0].transcript}));
            setIsListening(false);
        };
        recognitionRef.current.onerror = (event) => { console.error("Speech recognition error", event.error); setIsListening(false); };
        recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return alert('Speech recognition not supported.');
    if (isListening) recognitionRef.current.stop();
    else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['bpSystolic', 'bpDiastolic', 'heartRate', 'o2Sat', 'esiLevel', 'age', 'temperature', 'height'];
    if (numericFields.includes(name)) {
        setIntakeData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
        setIntakeData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmitIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    flowContainerRef.current?.scrollTo(0, 0);
    setStep('loading');
    setError(null);
    setRecommendation(null);
    try {
      const result = await getRoutingRecommendation(intakeData);
      setRecommendation(result);
      setStep('recommendation');
    } catch (err) {
      setError('Failed to get recommendation from AI engine. Please try again.');
      console.error(err);
      setStep('intake');
    }
  };

  const handleRoutePatient = () => {
    const newPatient: TriagePatient = {
      id: recommendation?.patientId || `T${Math.floor(1000 + Math.random() * 9000)}`,
      name: intakeData.patientName,
      esiLevel: intakeData.esiLevel,
      checkInTime: new Date(),
      // FIX: Added missing chiefComplaint property.
      chiefComplaint: intakeData.chiefComplaint,
    };
    setRoutedPatient(newPatient);
    setConfirmationMessage(`Patient Routed to ${recommendation?.optimalPath}`);
    setStep('confirmation');
  };

  const handleOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason) return alert("Please provide a reason for the override.");
    console.log("Override Logged:", overrideReason);
     const newPatient: TriagePatient = {
      id: recommendation?.patientId || `T${Math.floor(1000 + Math.random() * 9000)}`,
      name: intakeData.patientName,
      esiLevel: intakeData.esiLevel,
      checkInTime: new Date(),
      // FIX: Added missing chiefComplaint property.
      chiefComplaint: intakeData.chiefComplaint,
    };
    setRoutedPatient(newPatient);
    setConfirmationMessage("Route Override Logged");
    setStep('confirmation');
  }

  useEffect(() => {
      if (step === 'confirmation') {
          const timer = setTimeout(() => {
              onFlowComplete(routedPatient || undefined);
          }, 2500);
          return () => clearTimeout(timer);
      }
  }, [step, onFlowComplete, routedPatient]);

  const renderIntakeForm = () => (
    <div className="max-w-4xl mx-auto bg-background-secondary p-4 sm:p-8 rounded-2xl relative animate-fade-in">
      <button onClick={() => onFlowComplete()} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary z-10 p-2">
        <XIcon className="h-6 w-6" />
      </button>
      <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6 text-center">New Patient Intake</h2>
      <form onSubmit={handleSubmitIntake} className="space-y-6">
        
        <div>
          <label className="text-base sm:text-lg font-semibold text-text-secondary">Demographics</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <input type="text" name="patientName" value={intakeData.patientName} onChange={handleInputChange} required placeholder="Patient Name" className="w-full p-2 sm:p-3 bg-background-tertiary rounded-md border-2 border-border-light text-base sm:text-lg focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan focus:outline-none" />
            <input type="text" name="location" value={intakeData.location} onChange={handleInputChange} required placeholder="Current Location" className="w-full p-2 sm:p-3 bg-background-tertiary rounded-md border-2 border-border-light text-base sm:text-lg focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan focus:outline-none" />
            <input type="number" name="age" value={intakeData.age} onChange={handleInputChange} required placeholder="Age" className="w-full p-2 sm:p-3 bg-background-tertiary rounded-md border-2 border-border-light text-base sm:text-lg focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan focus:outline-none" />
            <select name="sex" value={intakeData.sex} onChange={handleInputChange} className="w-full p-2 sm:p-3 bg-background-tertiary rounded-md border-2 border-border-light text-base sm:text-lg focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan focus:outline-none appearance-none bg-no-repeat bg-right-4" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238E8E93' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`}}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-base sm:text-lg font-semibold text-text-secondary">Chief Complaint</label>
          <div className="relative mt-2">
            <textarea name="chiefComplaint" value={intakeData.chiefComplaint} onChange={handleInputChange} rows={2} required className="w-full p-2 sm:p-3 pr-12 sm:pr-14 bg-background-tertiary rounded-md border-2 border-border-light focus:outline-none focus:ring-2 focus:ring-accent-cyan text-base sm:text-lg" placeholder="e.g., Chest pain..." />
            <button type="button" onClick={handleVoiceInput} className={`absolute top-1/2 right-2 sm:right-3 -translate-y-1/2 p-2 rounded-full transition-colors ${isListening ? 'bg-accent-red animate-pulse' : 'bg-background-primary hover:bg-border-light'}`}>
              <MicrophoneIcon className="h-5 w-5 sm:h-6 sm:h-6 text-text-primary" />
            </button>
          </div>
        </div>
        
        <div>
            <label className="text-base sm:text-lg font-semibold text-text-secondary">Vitals</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <input type="number" name="bpSystolic" value={intakeData.bpSystolic} onChange={handleInputChange} placeholder="BP Sys" className="p-2 sm:p-3 bg-background-tertiary rounded-md border-2 border-border-light text-center font-bold text-lg sm:text-xl focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan focus:outline-none" />
                <input type="number" name="bpDiastolic" value={intakeData.bpDiastolic} onChange={handleInputChange} placeholder="BP Dia" className="p-2 sm:p-3 bg-background-tertiary rounded-md border-2 border-border-light text-center font-bold text-lg sm:text-xl focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan focus:outline-none" />
                <input type="number" name="heartRate" value={intakeData.heartRate} onChange={handleInputChange} placeholder="HR" className="p-2 sm:p-3 bg-background-tertiary rounded-md border-2 border-border-light text-center font-bold text-lg sm:text-xl focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan focus:outline-none" />
                <input type="number" name="o2Sat" value={intakeData.o2Sat} onChange={handleInputChange} placeholder="O2%" className="p-2 sm:p-3 bg-background-tertiary rounded-md border-2 border-border-light text-center font-bold text-lg sm:text-xl focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan focus:outline-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center bg-background-tertiary rounded-md border-2 border-border-light focus-within:ring-2 focus-within:ring-accent-cyan focus-within:border-accent-cyan">
                <input type="number" step="0.1" name="temperature" value={intakeData.temperature} onChange={handleInputChange} placeholder="Temp" className="w-full p-2 sm:p-3 bg-transparent text-center font-bold text-lg sm:text-xl outline-none" />
                <button type="button" onClick={() => setIntakeData(p => ({...p, temperatureUnit: 'F'}))} className={`px-3 sm:px-4 py-2 sm:py-3 rounded-l-none rounded-r-md text-base sm:text-lg font-bold ${intakeData.temperatureUnit === 'F' ? 'bg-accent-cyan text-background-primary' : 'bg-background-tertiary text-text-secondary'}`}>°F</button>
                <button type="button" onClick={() => setIntakeData(p => ({...p, temperatureUnit: 'C'}))} className={`px-3 sm:px-4 py-2 sm:py-3 rounded-l-none rounded-r-md text-base sm:text-lg font-bold ${intakeData.temperatureUnit === 'C' ? 'bg-accent-cyan text-background-primary' : 'bg-background-tertiary text-text-secondary'}`}>°C</button>
              </div>
              <div className="flex items-center bg-background-tertiary rounded-md border-2 border-border-light focus-within:ring-2 focus-within:ring-accent-cyan focus-within:border-accent-cyan">
                <input type="number" name="height" value={intakeData.height} onChange={handleInputChange} placeholder="Height" className="w-full p-2 sm:p-3 bg-transparent text-center font-bold text-lg sm:text-xl outline-none" />
                <button type="button" onClick={() => setIntakeData(p => ({...p, heightUnit: 'in'}))} className={`px-3 sm:px-4 py-2 sm:py-3 rounded-l-none rounded-r-md text-base sm:text-lg font-bold ${intakeData.heightUnit === 'in' ? 'bg-accent-cyan text-background-primary' : 'bg-background-tertiary text-text-secondary'}`}>in</button>
                <button type="button" onClick={() => setIntakeData(p => ({...p, heightUnit: 'cm'}))} className={`px-3 sm:px-4 py-2 sm:py-3 rounded-l-none rounded-r-md text-base sm:text-lg font-bold ${intakeData.heightUnit === 'cm' ? 'bg-accent-cyan text-background-primary' : 'bg-background-tertiary text-text-secondary'}`}>cm</button>
              </div>
            </div>
        </div>
        
        <div>
          <label className="text-base sm:text-lg font-semibold text-text-secondary mb-2 block">ESI Level</label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map(level => (
              <button key={level} type="button" onClick={() => setIntakeData(p => ({...p, esiLevel: level}))} className={`py-3 sm:py-4 text-lg sm:text-xl font-bold rounded-lg transition-all transform hover:-translate-y-1 ${intakeData.esiLevel === level ? 'bg-accent-cyan text-background-primary ring-2 ring-white' : 'bg-background-tertiary text-text-primary'}`}>
                {level}
              </button>
            ))}
          </div>
        </div>
        
         <div>
            <label htmlFor="language" className="text-base sm:text-lg font-semibold text-text-secondary">Patient Language</label>
            <select id="language" name="language" value={intakeData.language} onChange={handleInputChange} required className="w-full mt-2 p-2 sm:p-3 bg-background-tertiary rounded-md border-2 border-border-light focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all appearance-none bg-no-repeat bg-right-4 text-base sm:text-lg" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238E8E93' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`}}>
                <option>English</option>
                <option>Spanish</option>
                <option>Russian</option>
                <option>Mandarin</option>
                <option>Hindi</option>
                <option>Hausa</option>
                <option>Igbo</option>
                <option>Yoruba</option>
                <option>Other</option>
            </select>
        </div>
        
        <div className="space-y-4 pt-2">
            <ToggleSwitch label="Isolation / Infection Risk" checked={intakeData.isIsolationRisk} onChange={(e) => setIntakeData(p => ({...p, isIsolationRisk: e.target.checked}))} />
            <ToggleSwitch label="Vulnerability Flag (e.g., Unaccompanied Minor)" checked={intakeData.isVulnerable} onChange={(e) => setIntakeData(p => ({...p, isVulnerable: e.target.checked}))} />
            <ToggleSwitch label="Fever" checked={intakeData.hasFever} onChange={(e) => setIntakeData(p => ({...p, hasFever: e.target.checked}))} />
        </div>

        <button type="submit" className="w-full !mt-8 bg-accent-cyan hover:bg-opacity-80 text-background-primary font-bold py-3 sm:py-4 px-4 rounded-lg transition-all text-lg sm:text-xl shadow-lg shadow-cyan-glow">
          Calculate Optimal Route
        </button>
      </form>
    </div>
  );

  const renderLoading = () => (
    <div className="fixed inset-0 bg-background-primary/50 flex flex-col items-center justify-center text-center text-text-primary z-50 backdrop-blur-sm">
        <svg className="animate-spin h-12 w-12 text-accent-cyan" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-6 text-2xl font-semibold">Analyzing Data...</p>
        <p className="text-lg text-text-secondary">Matching patient needs with real-time ED resources.</p>
    </div>
  );
  
  const renderRecommendation = () => {
    if (!recommendation) return null;
    return (
    <div className="fixed inset-0 bg-background-primary/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="w-full max-w-lg bg-background-secondary p-8 rounded-2xl shadow-2xl text-center border border-border-light">
            <h2 className="text-base sm:text-lg font-semibold text-accent-cyan mb-2">AI Routing Recommendation</h2>
            
            <div className="my-6 bg-background-tertiary p-6 rounded-lg">
                <p className="text-sm font-semibold text-text-secondary">Optimal Route</p>
                <p className="font-bold text-3xl sm:text-5xl text-text-primary my-1">{recommendation.optimalPath}</p>
                 <p className="text-sm text-text-secondary">Confidence: {recommendation.confidenceScore}%</p>
            </div>
            
            <div className="text-left space-y-3 mb-6">
                <div>
                    <p className="text-sm font-semibold text-text-secondary">Matched Resource</p>
                    <p className="font-bold text-base sm:text-lg text-text-primary">{recommendation.matchedResource.name} <span className="text-text-secondary font-normal">({recommendation.matchedResource.reason})</span></p>
                </div>
                 <div>
                    <p className="text-sm font-semibold text-text-secondary">Predicted Wait to Treatment</p>
                    <p className="font-bold text-base sm:text-lg text-text-primary">~{recommendation.predictedWaitTimeMinutes} mins</p>
                </div>
            </div>
             <p className="text-xs text-text-secondary text-left p-3 bg-background-tertiary/50 rounded-md italic">Rationale: {recommendation.rationale}</p>

            <div className="mt-8 grid grid-cols-2 gap-4">
                <button onClick={() => setStep('override')} className="bg-accent-orange hover:bg-opacity-80 text-white font-bold py-3 sm:py-4 px-4 rounded-lg text-base sm:text-lg transition-all transform hover:-translate-y-1">
                    Override Route
                </button>
                <button onClick={handleRoutePatient} className="bg-accent-green hover:bg-opacity-80 text-white font-bold py-3 sm:py-4 px-4 rounded-lg text-base sm:text-lg transition-all transform hover:-translate-y-1">
                    Route Patient
                </button>
            </div>
        </div>
    </div>
    );
  };
  
  const renderOverrideModal = () => (
    <div className="fixed inset-0 bg-background-primary/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <form onSubmit={handleOverrideSubmit} className="w-full max-w-2xl bg-background-secondary rounded-2xl shadow-2xl p-8 border border-accent-orange">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-accent-orange">Override Route</h2>
            <button type="button" onClick={() => setStep('recommendation')} className="p-2 text-text-secondary hover:text-text-primary"><XIcon className="h-6 w-6" /></button>
          </div>
          <p className="text-text-secondary mb-6">A reason is mandatory for overriding the AI recommendation to ensure accountability and data integrity.</p>
          <textarea 
            value={overrideReason}
            onChange={(e) => setOverrideReason(e.target.value)}
            rows={5}
            required
            className="w-full p-3 bg-background-tertiary rounded-md border-2 border-border-light focus:outline-none focus:ring-2 focus:ring-accent-orange text-base sm:text-lg"
            placeholder="e.g., Patient has severe claustrophobia and requested an open bay..."
          />
          <div className="mt-6 flex gap-4">
              <button type="submit" className="w-full bg-accent-orange hover:bg-opacity-80 text-white font-bold py-3 px-4 rounded-lg transition-colors text-base sm:text-lg">Submit Override</button>
          </div>
      </form>
    </div>
  );

  const renderConfirmation = () => (
    <div className="fixed inset-0 bg-background-primary flex items-center justify-center z-50 animate-fade-in">
        <div className="text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-accent-green/20 rounded-full flex items-center justify-center border-4 border-accent-green">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:h-12 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-text-primary">{confirmationMessage}</h2>
            <p className="text-base sm:text-lg text-text-secondary">Returning to dashboard...</p>
        </div>
    </div>
  );

  return (
    <div ref={flowContainerRef} className={`fixed inset-0 bg-background-primary z-40 p-4 ${step === 'intake' ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        {step === 'intake' && renderIntakeForm()}
        {step === 'loading' && renderLoading()}
        {step === 'recommendation' && renderRecommendation()}
        {step === 'override' && renderOverrideModal()}
        {step === 'confirmation' && renderConfirmation()}
    </div>
  );
};

export default TriageFlow;