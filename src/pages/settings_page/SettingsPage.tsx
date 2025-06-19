import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DepartmentManagment from '../../components/settings/department_managment/DepartmentManagment';
import ApprovalWorkflow from '../../components/settings/approval_workflow/ApprovalWorkflow';
import UserManagement from '../../components/settings/user_managment/UserManagment';
import RolesPermissions from '../../components/settings/roles_and_permissions/RolesPermissions';

type SettingsSection =
  | 'User management'
  | 'Manage department'
  | 'Roles & permissions'
  | 'Approval workflow'
  | 'Budget allocation';

interface SettingsRoute {
  name: SettingsSection;
  path: string;
}

const SettingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SettingsSection>('User management');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const navigationItems: SettingsRoute[] = [
    { name: 'User management', path: '/settings/user-managment' },
    { name: 'Manage department', path: '/settings/department-managment' },
    { name: 'Roles & permissions', path: '/settings/roles-managment' },
    { name: 'Approval workflow', path: '/settings/workflow-managment' },
    // { name: 'Budget allocation', path: '/settings/budget-management' },
  ];

  // Set active section based on current URL path
  useEffect(() => {
    const currentPath = location.pathname;
    const matchingRoute = navigationItems.find(item => item.path === currentPath);

    if (matchingRoute) {
      setActiveSection(matchingRoute.name);    
    } else {
      // Default to User management if no match
      setActiveSection('User management');
      navigate('/settings/user-managment');
      console.log("user");
      
    }
  }, [location.pathname]);

  // Check for mobile/desktop size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigation = (route: SettingsRoute) => {
    navigate(route.path);
    setActiveSection(route.name);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'User management':
        return <UserManagement />;
        return <></>;
      case 'Manage department':
        return <DepartmentManagment />;
      case 'Budget allocation':
        //return <BudgetAllocation />;
        return <></>;
      case 'Roles & permissions': 
        return <RolesPermissions />;
      case 'Approval workflow':
        return <ApprovalWorkflow />;
        //return <></>;
      default:
        return <UserManagement />;
    }
  };

  // Mobile version with tabs
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Tab Navigation for Mobile */}
        <div className="bg-white border-b border-gray-200 sticky top-20 z-10 ">
          <div className="overflow-x-auto">
            <div className="flex whitespace-nowrap">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 focus:outline-none flex-shrink-0 ${
                    activeSection === item.name 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content for Mobile */}
        <div className="p-4">
          {renderContent()}
        </div>
      </div>
    );
  }

  // Desktop version with sidebar
  return (
    <div className="desktop-wide:flex desktop-wide:justify-center">
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar Navigation for Desktop */}
        <div className="w-[234px] bg-white border-r border-gray-200 p-4">
          <h1 className="text-xl font-semibold mb-6">Settings</h1>
          <nav>
            {navigationItems.map((item) => (
              <div
                key={item.name}
                onClick={() => handleNavigation(item)}
                className={`flex items-center px-3 py-2 rounded-lg mb-1 cursor-pointer ${
                  activeSection === item.name ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-[14px]">{item.name}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content for Desktop */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;