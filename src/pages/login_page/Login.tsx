import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { LoginComponent } from "../../components/login/LoginComponent";
import backgroundImage from "../../assets/login/login_background_image.jpg";
import ProcurementLogo from "../../assets/procurement_logo/procurement-logo.svg";

// Fixing the prop type for setExpenditureTypes
interface LoginProps {
  setUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

export const Login: React.FC<LoginProps> = ({ setUserLoggedIn }) => {
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
          <p className="text-2xl mb-2 text-left font-semibold">
            Transform Your Procurement Process
          </p>
          <p className="text-left text-base">
            Efficiently manage your purchases, optimize costs, and accelerate your project's success — all from one seamless platform.
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
            <LoginComponent setUserLoggedIn={setUserLoggedIn}/>
          </div>
        </div>

      </div>
    </div>
  );
};
