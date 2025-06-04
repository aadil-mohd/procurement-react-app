// import React, { useState } from 'react';
// import { Form, Input, Button, Checkbox, Layout, Card, Typography, Divider, message } from 'antd';
// import { UserOutlined, LockOutlined } from '@ant-design/icons';
// import { userLoginAsync } from '../../services/userService';

// const { Content } = Layout;
// const { Title, Text, Link } = Typography;

// // Define interface for form values
// interface LoginFormValues {
//   username: string;
//   password: string;
//   remember?: boolean;
// }

// const LoginPage: React.FC = () => {
//   const [loading, setLoading] = useState<boolean>(false);
  
//   const onFinish = async (values: LoginFormValues): Promise<void> => {
//     setLoading(true);
    
//     try {
//       // Call API to login user using the service function
//       const token = await userLoginAsync({
//         username: values.username,
//         password: values.password
//       });
      
//       // If we get here, login was successful
//       console.log('Login successful:', token);
//       message.success('Login successful!');
      
//       // Save token to local storage
//       localStorage.setItem('auth_token', token);
      
//       // You could redirect to dashboard or home page here
//       // window.location.href = '/dashboard';
      
//     } catch (error: unknown) {
//       console.error('Error during login:', error);
//       const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
//       message.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//     <Layout className="min-h-screen bg-gray-100">
//       <Content className="flex items-center justify-center py-12">
//         <Card 
//           className="w-full max-w-md shadow-lg rounded-lg" 
//           bordered={false}
//           style={{ padding: '24px' }}
//         >
//           {/* Logo Area */}
//           <div className="text-center mb-6">
//             <div className="mx-auto w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
//               <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M12 2L2 7l10 5 10-5-10-5z" />
//                 <path d="M2 17l10 5 10-5" />
//                 <path d="M2 12l10 5 10-5" />
//               </svg>
//             </div>
//             <Title level={2} className="mt-6">Welcome Back</Title>
//             <Text type="secondary">Sign in to your account</Text>
//           </div>
          
//           {/* Form */}
//           <Form<LoginFormValues>
//             name="login"
//             initialValues={{ remember: true }}
//             onFinish={onFinish}
//             layout="vertical"
//             size="large"
//           >
//             <Form.Item
//               name="username"
//               rules={[{ required: true, message: 'Please input your username!' }]}
//             >
//               <Input 
//                 prefix={<UserOutlined className="text-gray-400" />} 
//                 placeholder="Username" 
//               />
//             </Form.Item>
            
//             <Form.Item
//               name="password"
//               rules={[{ required: true, message: 'Please input your password!' }]}
//             >
//               <Input.Password 
//                 prefix={<LockOutlined className="text-gray-400" />} 
//                 placeholder="Password" 
//               />
//             </Form.Item>
            
//             <Form.Item>
//               <div className="flex justify-between">
//                 <Form.Item name="remember" valuePropName="checked" noStyle>
//                   <Checkbox>Remember me</Checkbox>
//                 </Form.Item>
//                 <Link href="/forgot-password" className="text-blue-600 hover:text-blue-500">
//                   Forgot password?
//                 </Link>
//               </div>
//             </Form.Item>
            
//             <Form.Item>
//               <Button 
//                 type="primary" 
//                 htmlType="submit" 
//                 className="w-full bg-blue-600 hover:bg-blue-700" 
//                 loading={loading}
//               >
//                 {loading ? 'Signing in...' : 'Sign in'}
//               </Button>
//             </Form.Item>
//           </Form>
          
//           <Divider plain className="my-4">
//             <Text type="secondary" className="text-sm">OR</Text>
//           </Divider>
          
//           <div className="text-center">
//             <Text type="secondary" className="text-sm">
//               New user?{' '}
//               <Link href="/register" className="text-blue-600 hover:text-blue-500">
//                 Register here
//               </Link>
//             </Text>
//           </div>
//         </Card>
//       </Content>
//     </Layout>
//   );
// };

// export default LoginPage;

import React, { useEffect } from "react";
// import backgroundImage from "../../assets/login/background_image.png";
// import capexLogo from "../../assets/capex_logo/capex-logo.png";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { LoginComponent } from "../../components/login/LoginComponent";

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
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(1, 1, 1, 0.2)), url(${""})`,
          }}
        >
          <p className="text-xl mb-2 text-left">
            Power Your Investments with Confidence
          </p>
          <p className="text-left">
            Manage your capital, optimize your strategy, and achieve financial success — all in one place.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-col justify-center items-center w-full lg:w-3/5 xl:w-3/5 h-full bg-white">
          <div className="text-start">
            <div className="flex items-center justify-start ml-5">
              <img
                src={""}
                className="w-[60px] h-[60px]"
                alt="Capex Logo"
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
