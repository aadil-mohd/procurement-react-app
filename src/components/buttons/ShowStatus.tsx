import React from 'react';
import { projectStatuses, rfpStatuses } from '../../utils/constants';

interface ShowStatusProps {
  status: number;
  type: 'proposal' | 'vendors' | 'rfps';
}

const ShowStatus: React.FC<ShowStatusProps> = ({ status, type }) => {
  const getStatusClass = () => {
    switch (status) {
      // Common Statuses

      // case 'on_hold':
      // case 'delayed':
      //   return 'bg-red-500/50 text-red-900 min-w-16';
      // case 'on_track':
      case 1:
        return 'bg-blue-100 text-blue-700 border-blue-500 max-w-16';
      // case 'not_started':
      // case 'open':
      //   return 'bg-orange-500/40 text-orange-900 min-w-16';
      
      case 0:
        return 'bg-orange-100 text-orange-700 border-orange-500 max-w-32';
      case 7:
        return 'bg-orange-100 text-orange-700 border-orange-500 max-w-32';
      case 4:
        return 'bg-orange-100 text-orange-700 border-orange-500 max-w-32';
      case 2:
        return 'bg-red-100 text-red-700 border-red-500';
      case 5:
        return 'bg-green-100 text-green-700 border-green-500';
      case 6:
        return 'bg-green-100 text-green-700 border-green-500';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-500';
    }
  };

  // Find the label dynamically based on type
  const getStatusLabel = () => {
    const statusList =
      type === 'proposal' ? projectStatuses :
        type === 'vendors' ? rfpStatuses :
          rfpStatuses; // default to requestStatuses

    return statusList.find((e: any) => e.value === status)?.label || status;
  };

  return (
    <button className={`py-1 px-2 text-xs border rounded-full flex justify-center ${getStatusClass()}`}>
      {getStatusLabel()}
    </button>
  );
};

export default ShowStatus;
