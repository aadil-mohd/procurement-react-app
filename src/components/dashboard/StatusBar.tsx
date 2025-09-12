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
        <div key={index} className="bg-white rounded-2xl shadow-lg border-0 p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-slate-50 to-gray-50 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl ${status.color} ${status.textColor} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                {status.icon}
              </div>
              <div className="text-right">
                <div className={`w-4 h-4 rounded-full ${status.color.replace('bg-', 'bg-').replace('-500', '-200')} mb-2`}></div>
                <div className="text-caption">Active</div>
              </div>
            </div>
                        <div className="space-y-2">
                          <div className="text-3xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors duration-300">{status.value}</div>
                          <div className="text-caption">{status.label}</div>
                        </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default StatusBar;
