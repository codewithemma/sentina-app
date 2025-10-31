import React from 'react';

const PredictiveAlertCard: React.FC = () => {
    return (
        <div className="bg-background-secondary p-6 rounded-2xl h-full flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-semibold text-text-secondary mb-2">Predictive Alerts</h3>
                <p className="text-2xl font-bold text-accent-orange">4-Hour Bottleneck Forecast</p>
                <p className="text-text-primary mt-2">Increased acuity expected. Trauma bay and isolation room demand will exceed capacity.</p>
            </div>
            <button className="w-full mt-4 bg-accent-orange/80 hover:bg-accent-orange text-white font-bold py-3 px-4 rounded-lg transition-all">
                View Proactive Resource Alerts
            </button>
        </div>
    );
};

export default PredictiveAlertCard;
