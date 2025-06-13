import React, { useState } from "react";
import TextField from "../basic_components/TextField";
import { userLoginAsync } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { Loader2Icon } from "lucide-react";
import type { ILogin } from "../../types/Types";
import Cookies from "js-cookie";
import { parseJwt } from "../../utils/common";

// Define props type
interface LoginComponentProps {
  setUserLoggedIn:React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginComponent: React.FC<LoginComponentProps> = ({setUserLoggedIn}) => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState<ILogin>({
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof ILogin, value: string) => {
    setLoginData((prevData) => ({ ...prevData, [field]: value }));
  };

  async function userLogin(): Promise<void> {
    setIsLoading(true);
    try {
      const token = await userLoginAsync({
        username: loginData.username,
        password: loginData.password,
      });

      // Save token to localStorage
      // localStorage.setItem("auth_token", token);

      Cookies.set("token", token as string);
      const decoded_data = parseJwt(token as string);
      Cookies.set("userId", decoded_data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
      Cookies.set("role", decoded_data["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
      Cookies.set("name", decoded_data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name  "]);
      Cookies.set("tenantId", decoded_data["tenantId"]);
      Cookies.set("companyId", decoded_data["companyId"]);
      Cookies.set("branchId", decoded_data["branchId"]);
      Cookies.set("exp", decoded_data["exp"]);

      notification.success({
        message: "Login successful",
        description: "You have been logged in successfully.",
      });     

      // Redirect to dashboard or home
      setUserLoggedIn(true);
      navigate("/");
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed. Please try again.";
      notification.error({
        message: "Login error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          userLogin();
        }}
        className="bg-white rounded px-8 py-[50px] w-full sm:w-full md:w-full lg:w-[402px] xl:w-[402px]"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome back</h2>
        <p className="text-gray-500 text-sm mb-8">
          Welcome back! Please enter your details.
        </p>
        <TextField
          id="login-username"
          setValue={(value: string) => handleChange("username", value.trim())}
          title="Username or Email"
          field="username"
          type="text"
          width="w-full"
          style="mb-2"
          value={loginData.username}
        />
        <TextField
          id="login-password"
          setValue={(value: string) => handleChange("password", value.trim())}
          title="Password"
          field="password"
          type="password"
          eye={true}
          width="w-full"
          style=""
          value={loginData.password}
        />
        <p className="text-right mt-2 mb-3 text-sm text-[#1A73E8] cursor-pointer">
          <u className="text-sm font-bold no-underline">Forgot password?</u>
        </p>
        <button
          id="login-btn"
          type="submit"
          className="w-full bg-[#1A73E8] flex justify-center items-center hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {isLoading ? <Loader2Icon className="animate-spin" /> : "Login"}
        </button>
      </form>
    </div>
  );
};
