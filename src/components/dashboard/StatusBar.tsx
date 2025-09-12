import React from "react";

// Define the type for the data array passed to StatusBar
interface StatusBarProps {
  statuses: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string; 
    textColor: string; 
  }[];
}

const StatusBar: React.FC<StatusBarProps> = ({ statuses }) => {
  return (
    <>
      {statuses.map((status, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-lg ${status.color} ${status.textColor} flex items-center justify-center shadow-sm`}>
              {status.icon}
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-gray-900">{status.value}</p>
              <p className="text-sm font-medium text-gray-600">{status.label}</p>
            </div>
            <div className="text-right">
              <div className={`w-3 h-3 rounded-full ${status.color.replace('bg-', 'bg-').replace('-500', '-200')} mb-1`}></div>
              <div className="text-xs text-gray-500">Status</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default StatusBar;
