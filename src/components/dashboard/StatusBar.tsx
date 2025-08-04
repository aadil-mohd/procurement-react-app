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
    <div className="flex flex-col justify-center items-start desktop:flex-row desktop:items-center desktop:justify-start rounded-lg desktop:space-x-4 space-y-4 desktop:space-y-0">
      {statuses.map((status, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center space-x-2">
            <button
              className={`w-[1.5rem] h-[1.5rem] rounded-full ${status.color} ${status.textColor} flex items-center justify-center p-1`}
            >
              {status.icon}
            </button>
            <div className="flex items-center">
              <p className="text-2xl font-semibold">{status.value}</p>
              <span className="text-sm text-gray-500 ml-1">{status.label}</span>
            </div>
          </div>
          {index < statuses.length - 1 && (
            <p className="hidden desktop:block text-md text-gray-300">|</p>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StatusBar;
