import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/basic_components/Sidebar';


import Dashboard from '../pages/dashboard/Dashboard';
import Register from '../pages/login_page/Register';
import ForgotPassPage from '../pages/forgot_pass_page/ForgotPass';
import ResetPassPage from '../pages/forgot_pass_page/ResetPass';
import { Login } from '../pages/login_page/Login';
import Navbar from '../components/basic_components/Navbar';
import SettingsPage from '../pages/settings_page/SettingsPage';


const RouteComponent: React.FC = () => {
  // State for mobile detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // State for user login status
  // TODO: Update this state via Login component or auth system
  const [userLoggedIn, _] = useState(true);

  // Update isMobile based on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-full">
      {/* <ErrorBoundary> */}
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            <div className="w-full">
              <Login />
            </div>
          }
        />

        <Route
          path="/register"
          element={
            <div className="w-full">
              <Register />
            </div>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <div className="w-full">
              <ForgotPassPage />
            </div>
          }
        />
        <Route
          path="/reset-password"
          element={
            <div className="w-full">
              <ResetPassPage />
            </div>
          }
        />
        {/* Authenticated Routes with Sidebar/Navbar */}
        <Route
          path="*"
          element={
            <div className="flex min-h-screen">
              {isMobile ? <Navbar notifications={[]} trigger={()=>{}}/> : <Sidebar notifications={[]} trigger={()=>{}}/>}
              <div
                className={`flex-1 min-h-screen bg-bgBlue ${isMobile ? 'mt-20' : 'ml-[78px]'
                  }`}
              >
                {userLoggedIn ? (
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/settings/user-managment" element={<SettingsPage />} />
                    <Route path="/settings/department-managment" element={<SettingsPage />} />
                    <Route path="/settings/workflow-managment" element={<SettingsPage />} />
                  </Routes>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">
                      Please log in to access the procurement system
                    </p>
                  </div>
                )}
              </div>
            </div>
          }
        />
      </Routes>
      {/* </ErrorBoundary> */}
    </div>
  );
};

export default RouteComponent;