import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShowStatus from "../buttons/ShowStatus";
// import { getCapexRequestsFilterAsync } from "../../services/capexService";
import { IModalProps, INotificationItem } from "../../types/commonTypes";
//import { deleteNotificationAsync, updateNotificationAsync } from "../../services/capexService";
import { convertCurrencyLabel } from "../../utils/common";

interface INotificationContent extends IModalProps {
  data?: INotificationItem[]; // Optional prop to receive data from parent
}

const NotificationContent: React.FC<INotificationContent> = ({ data, closeModal, trigger }) => {
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [notifications, setNotifications] = useState<INotificationItem[]>([]);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [enableOptions, setEnableOptions] = useState<number | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    setNotifications(data || []);
  }, [data]);

  const handleFilterChange = (newFilter: 'all' | 'read' | 'unread') => {
    setFilter(newFilter);
  };

  const handleDeleteNotifications = async (index: number) => {
    try {
      setEnableOptions(null);
      console.log(index);
      //await deleteNotificationAsync([filteredNotifications[index].id])
      console.log("deleted");
      trigger();
    } catch (err) {

    }
  }

  const handleNotificationClick = async (notification: INotificationItem) => {
    // Mark as read when clicked
    // if (!notification.isRead) {
    //   markAsRead(notification.id);
    // }
    notification.isRead = true;
    //await updateNotificationAsync(notification.id, notification)
    // Navigate to the capex request detail page
    navigate(`/request/${notification.capexRequestId}`);
    closeModal()
  };

  useEffect(() => {
    const handleScroll = () => {
      if (openDropdown !== null) {
        setOpenDropdown(null);
      }
    };

    const tableContainer = tableContainerRef.current;
    if (tableContainer) {
      tableContainer.addEventListener('scroll', handleScroll);
    }
    window.addEventListener('scroll', handleScroll);

    return () => {
      if (tableContainer) {
        tableContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [openDropdown]);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'read') return notification.isRead === true;
    if (filter === 'unread') return notification.isRead === false;
    return true;
  });

  return (
    <div className="rounded-lg w-full h-full p-4 flex flex-col overflow-y-auto" style={{ minWidth: "400px" }}>
      {/* Filter Options */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b w-full">
        <div className="flex gap-4">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-3 py-1 rounded text-sm ${filter === 'all'
              ? "font-semibold text-customBlue"
              : "text-gray-600 hover:text-customBlue"}`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange('unread')}
            className={`px-3 py-1 rounded text-sm ${filter === 'unread'
              ? "font-semibold text-customBlue"
              : "text-gray-600 hover:text-customBlue"}`}
          >
            Unread
          </button>
          <button
            onClick={() => handleFilterChange('read')}
            className={`px-3 py-1 rounded text-sm ${filter === 'read'
              ? "font-semibold text-customBlue"
              : "text-gray-600 hover:text-customBlue"}`}
          >
            Readed
          </button>
        </div>
        <div>
          <span className="text-xs text-gray-500">
            {filteredNotifications.length} {filteredNotifications.length === 1 ? 'notification' : 'notifications'}
          </span>
        </div>
      </div>

      {/* Fixed-height container for the notification list */}
      <div className="flex-grow overflow-y-auto w-full" ref={tableContainerRef} onClick={() => {
        enableOptions != null &&
          setEnableOptions(null);
      }}>
        {/* Notification List */}
        <ul className="flex flex-col gap-4 w-full">
          {filteredNotifications.map((notification, i) => (
            <li
              key={notification.id}
              className="flex justify-between items-start border-b pb-3 last:border-none w-full"
            >
              <div
                className={`flex-grow w-full cursor-pointer ${!notification.isRead ? 'bg-blue-50 rounded py-2 px-2' : 'bg-white rounded py-2 px-2'}`}
                onClick={() => { enableOptions == null && handleNotificationClick(notification) }}
              >
                <div className="flex items-start justify-between w-full">
                  <p className="text-sm font-medium text-gray-800">
                    {!notification.isRead && (
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    )}
                    {notification.projectName && notification.projectName.length > 25 ? `${notification.projectName.slice(0,25)}...` : notification.projectName} <span className="text-xs text-gray-400 mt-1">
                    {new Date(notification.updatedAt).toLocaleDateString()}
                  </span>
                  </p>
                  <div className="flex items-center ml-2">
                    <ShowStatus status={notification.status.toLowerCase()} type="request" />
                    <div className="ml-2 dropdown relative">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={(e) => {
                          setEnableOptions(i)
                          e.stopPropagation();
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      <div className={`dropdown-menu absolute right-0 mt-2 bg-white shadow-lg rounded-md py-1 ${i == enableOptions ? "" : "hidden"}`} >
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent navigation
                            handleDeleteNotifications(i);
                          }}
                          className="block w-full text-left px-4 py-1 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col mt-1">
                  <span className="text-xs text-gray-500">{notification.expenditureType} • {notification.departmentName}</span>
                  <span className="text-xs text-gray-500 mt-1">{convertCurrencyLabel(notification.currency || "USD")} {notification.estimatedBudget?.toLocaleString()}</span>
                </div>
              </div>
            </li>
          ))}
          {filteredNotifications.length === 0 && (
            <div className="w-full min-h-32 flex items-center justify-center">
              <p className="text-sm text-gray-500 text-center py-4">No notifications found.</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NotificationContent;