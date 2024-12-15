import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LogoImage from "../../../../../Components/Images/LogoImage";
import Button from "../../../../../Components/buttons/Button";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../../../../../App";

const AdminLogin = () => {
  const devTunnelUrl = import.meta.env.VITE_DEV_TUNNEL_URL;

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginClick = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${devTunnelUrl}admin_login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.status && data.token) {
        toast.success("Login successful.");
        const encryptedCookie = btoa(data.token);
        localStorage.setItem("userRole", data.data.role);

        localStorage.setItem("authCookie", encryptedCookie);
        handleLogin(data.data.role);
        setTimeout(() => navigate("/admin/users"), 1000);
        
      } else {
        toast.error(data.message || "Invalid Credentials.");
      }
    } catch (error) {
      setIsLoading(false);
      setError("An error occurred during login. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className='flex flex-col md:flex-row w-full h-screen bg-cover bg-center bg-no-repeat bg-[url("https://i.ibb.co/S69yyvw/thumbnail.jpg")]'>
      <ToastContainer autoClose={2000} position="top-center" />
      <div className="flex basis-[94%] h-full items-center justify-center">
        <div className="flex flex-col h-screen w-5/6 justify-evenly min-[600px]:w-3/5 md:w-1/3">
          <div className="flex flex-col space-y-6 xxl:px-12 2xl:px-16">
            <div className="flex justify-center">
              <LogoImage />
            </div>
            <div className="flex flex-col">
              <label className="font-poppins font-semibold text-white leading-6 mb-2 text-xs lg:text-sm">
                Email Address
              </label>
              <div className="flex bg-white rounded-md py-3 items-baseline">
                <div className="px-2">
                  <MailOutlineIcon className="stroke-[#53615A] stroke-0 opacity-50 mb-1" />
                </div>
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-poppins bg-transparent text-[15px] text-[#53615A] font-medium text-xs leading-4 outline-none w-[100%]"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between">
                <label className="font-poppins font-semibold text-white leading-6 mb-2 text-xs lg:text-sm">
                  Password
                </label>
                {/* <label className="font-poppins font-semibold leading-6 text-[#FCB426] text-xs lg:text-sm">
                  Forgot Password?
                </label> */}
              </div>
              <div className="flex bg-white rounded-md py-3 items-center justify-between">
                <div className="flex">
                  <div className="px-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#53615A"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                      />
                    </svg>
                  </div>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="font-poppins bg-transparent text-[15px] text-[#53615A] font-medium text-xs leading-4 outline-none"
                  />
                </div>
                {passwordVisible ? (
                  <VisibilityOffOutlinedIcon
                    className="stroke-[#53615A] stroke-0 opacity-50 mr-2 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <VisibilityOutlinedIcon
                    className="stroke-[#53615A] stroke-0 opacity-50 mr-2 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
            </div>

            <Button
              text={isLoading ? "Please wait..." : "Login"}
              onClick={!isLoading ? handleLoginClick : undefined}
            />
            <div className="flex justify-center">
              <p className="font-poppinstext-xs font-medium leading-7 text-left text-white xl:text-sm 2xl:text-lg">
                If you don't have an account?
                <span className="text-[#f58220]"> SIGNUP</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
