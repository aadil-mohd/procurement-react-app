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
        return 'bg-blue-500/30 text-blue-900 min-w-16';
      // case 'not_started':
      // case 'open':
      //   return 'bg-orange-500/40 text-orange-900 min-w-16';
      case 0:
        return 'bg-orange-500/40 text-orange-900 min-w-16';
      case 7:
        return 'bg-orange-500/40 text-orange-900 min-w-16';
      case 4:
        return 'bg-orange-500/40 text-orange-900 min-w-16';
      case 2:
        return 'bg-red-500/40 text-red-900 min-w-16';
      case 5:
        return 'bg-green-500/30 text-green-900 min-w-16';
      case 6:
        return 'bg-green-500/30 text-green-900 min-w-16';
      default:
        return 'bg-gray-500/30 text-gray-900 min-w-16';
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
    <button className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass()}`}>
      {getStatusLabel()}
    </button>
  );
};

export default ShowStatus;
