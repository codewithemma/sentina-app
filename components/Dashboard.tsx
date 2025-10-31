
import React from 'react';
import { UserRole } from '../types';
import HomeostasisScore from './HomeostasisScore';
import PatientTable from './PatientTable';
import DynamicZoning from './DynamicZoning';
import AmbulancePrediction from './AmbulancePrediction';
import EquityWatch from './EquityWatch';
import TriageForm from './TriageForm';

interface DashboardProps {
  userRole: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 xl:col-span-3 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HomeostasisScore />
          <AmbulancePrediction />
          <EquityWatch />
        </div>
        <PatientTable />
      </div>

      {/* Right Column */}
      <div className="lg:col-span-1 xl:col-span-1 space-y-6">
        <DynamicZoning userRole={userRole} />
        <TriageForm />
      </div>
    </div>
  );
};

export default Dashboard;
