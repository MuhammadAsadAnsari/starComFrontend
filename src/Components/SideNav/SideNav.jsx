import React, { useEffect, useState } from "react";
import { RiFileHistoryLine } from "react-icons/ri";
import { useNavigate, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
const SideNav = ({setFields}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("authCookie");
    window.location.href = "/login";
   localStorage.clear();
  };


  return (
    <div className="pt-2 flex flex-row-reverse basis-[6%] h-full md:flex-col md:pt-0">
      <div className="md:basis-[10%]"></div>
      <div className="flex flex-col h-full basis-[90%] justify-center">
        <div className="flex flex-col-reverse w-full h-full md:h-1/3 md:flex-row">
          <div className="relative basis-[20%] md:basis-[40%]">
          
          </div>
          <div className="pr-5 gap-5 flex justify-end basis-[70%] md:pr-0 md:gap-0 md:basis-[60%] md:flex-col md:justify-evenly">
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke={"#F58220"}
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setFields({})
                  localStorage.removeItem('user_data');
                  localStorage.removeItem("data");

                  navigate("/");
                      window.location.reload(true);

                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            </div>
 
         
          </div>
          <div className="basis-[10%] md:basis-0 "></div>
        </div>
      </div>
      <div className=" flex flex-col gap-4 align-middle items-center justify-center h-full basis-[10%] md:basis-[10%]">
        <LogoutIcon
          sx={{ color: "white", fontSize: "30px" }}
          onClick={() => handleLogout()}
        />
        {/* <div className="relative   bg-[url('https://i.ibb.co/vmdhzZy/avatar-removebg-preview.png')] bg-cover h-[40px] w-[40px] md:mb-4  ">
          <div className="absolute h-8 w-8 border-[3px] border-white rounded-full left-1  top-1.5 "></div>
        </div> */}
      </div>
    </div>
  );
};

export default SideNav;
