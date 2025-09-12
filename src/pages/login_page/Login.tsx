import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { LoginComponent } from "../../components/login/LoginComponent";
import ProcurementLogo from "../../assets/procurement_logo/procurement-logo.png";

interface LoginProps {
  setUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Login: React.FC<LoginProps> = ({ setUserLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isTokenExist = Cookies.get("token");
    if (isTokenExist) {
      //navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex">
      {/* Left Side - Branding & Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <img className="h-16 w-16 mr-4" src={ProcurementLogo} alt="Procurement Logo" />
              <div>
                <h1 className="text-3xl font-bold">TenderFlow</h1>
                <p className="text-blue-200 text-sm">Procurement Management System</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold mb-4">Streamline Your Procurement Process</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Manage tenders, vendors, and approvals with our comprehensive procurement management platform.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-blue-100">Automated Tender Management</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-blue-100">Vendor Evaluation & Approval</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-blue-100">Real-time Analytics & Reporting</span>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-blue-400 border-opacity-30">
            <p className="text-blue-200 text-sm">
              Trusted by 500+ organizations worldwide
            </p>
          </div>
        </div>
      </div>
      
      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <img className="h-12 w-12 mr-3" src={ProcurementLogo} alt="Procurement Logo" />
              <div>
                <h1 className="text-2xl font-bold text-white">TenderFlow</h1>
                <p className="text-gray-300 text-sm">Procurement Management</p>
              </div>
            </div>
          </div>
          
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your TenderFlow account</p>
            </div>
            
            <LoginComponent setUserLoggedIn={setUserLoggedIn} />
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account? 
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium ml-1">
                  Contact Administrator
                </a>
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-xs">
              © 2024 TenderFlow. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};