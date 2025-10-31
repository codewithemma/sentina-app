export enum UserRole {
  CHARGE_NURSE = 'Charge Nurse',
  ADMINISTRATOR = 'Administrator',
  TRIAGE_NURSE = 'Triage Nurse',
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'RN' | 'MD' | 'Tech';
  languages: string[];
  certifications: string[];
  status: 'Available' | 'Unavailable' | 'On Break';
}

export interface Zone {
  id: string;
  name: string;
  type: 'Acuity' | 'Overflow' | 'Isolation' | 'FastTrack';
  capacity: number;
  occupied: number;
  status: 'Operational' | 'Closed' | 'Surge';
}

export enum PatientAcuity {
  CRITICAL = 1,
  EMERGENT = 2,
  URGENT = 3,
  SEMI_URGENT = 4,
  NON_URGENT = 5,
}

export interface Patient {
  id: string;
  acuity: PatientAcuity;
  perfusionScore: number;
  location: string;
  waitTimeMinutes: number;
  riskFactor: 'High' | 'Medium' | 'Low';
  notes: string;
}

export interface Ambulance {
  id: string;
  etaMinutes: number;
  acuity: 'High' | 'Medium' | 'Low';
  patientCount: number;
}

export interface PatientIntakeData {
  patientName: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  location: string;
  chiefComplaint: string;
  bpSystolic: number;
  bpDiastolic: number;
  heartRate: number;
  o2Sat: number;
  temperature: number;
  temperatureUnit: 'F' | 'C';
  height: number;
  heightUnit: 'in' | 'cm';
  esiLevel: number;
  language: string;
  hasFever: boolean;
  isIsolationRisk: boolean;
  isVulnerable: boolean;
}

export interface TriagePatient {
  id: string;
  name: string;
  esiLevel: PatientAcuity;
  checkInTime: Date;
  chiefComplaint: string;
}


export interface AIRecommendation {
  patientId: string;
  optimalPath: string;
  matchedResource: {
    name: string;
    reason: string;
  };
  predictedWaitTimeMinutes: number;
  confidenceScore: number;
  rationale: string;
  equityAlert: {
    triggered: boolean;
    reason: string | null;
  };
}

export interface ExternalHospital {
    name: string;
    address: string;
    distance: string;
    traumaBaysAvailable: number;
    status: 'Accepting' | 'At Capacity' | 'On Diversion';
}
