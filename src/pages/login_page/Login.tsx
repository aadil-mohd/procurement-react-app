import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { LoginComponent } from "../../components/login/LoginComponent";
import backgroundImage from "../../assets/login/login_background_image.jpg";
import ProcurementLogo from "../../assets/procurement_logo/procurement-logo.svg";

// Fixing the prop type for setExpenditureTypes
interface LoginProps {

}

export const Login: React.FC<LoginProps> = ({  }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isTokenExist = Cookies.get("token");
    if (isTokenExist) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="desktop-wide:flex desktop-wide:justify-center">
      <div className="flex w-screen h-screen">

        {/* Left Section */}
        <div
          className="hidden lg:flex flex-col justify-end items-start w-2/5 h-full bg-cover bg-no-repeat bg-center text-white px-[50px] pb-[70px]"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(1, 1, 1, 0.2)), url(${backgroundImage})`,
          }}
        >
          <p className="text-xl mb-2 text-left">
            We’ve been using Untitled to kick start every new project
          </p>
          <p className="text-left">
            Urna pellentesque proin nulla quis feugiat scelerisque aliquam. Diam pellentesque quis ullamcorper quis molestie ut sit donec.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-col justify-center items-center w-full lg:w-3/5 xl:w-3/5 h-full bg-white">
          <div className="text-start">
            <div className="flex items-center justify-start ml-5">
              <img
                src={ProcurementLogo}
                className="w-[60px] h-[60px]"
                alt="Procurement Logo"
              />
              <p className="text-[34px] ml-2"></p>
            </div>
            {/* Pass setExpenditureTypes properly to LoginComponent */}
            <LoginComponent/>
          </div>
        </div>

      </div>
    </div>
  );
};
