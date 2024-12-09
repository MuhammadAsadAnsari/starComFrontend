import React, { useEffect, useState } from "react";
import { HiOutlineUserAdd } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import CategoryIcon from "@mui/icons-material/Category";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; 
import GroupIcon from "@mui/icons-material/Group"; // Client icon
import BusinessIcon from "@mui/icons-material/Business"; 
const AdminSideNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedIcon, setSelectedIcon] = useState("icon3");

  useEffect(() => {}, [selectedIcon]);

  const handleLogout = () => {
    localStorage.removeItem("authCookie");
    window.location.href = "/admin";
    localStorage.removeItem("lastVisitedRoute");
    localStorage.removeItem("userRole");

  };

  useEffect(() => {
    switch (location.pathname) {
      case "/admin/users":
        setSelectedIcon("icon1");
        break;
      case "/admin/genre":
        setSelectedIcon("icon2");
        break;
      case "/admin/day/part":
        setSelectedIcon("icon3");
        break;
      case "/admin/client/brand":
        setSelectedIcon("icon4");
        break;
      default:
        setSelectedIcon("icon1");
    }
  }, [location.pathname]);

  return (
    <div className="pt-2 flex flex-row-reverse basis-[6%] h-full md:flex-col md:pt-0">
      <div className="md:basis-[10%]"></div>
      <div className="flex flex-col h-full basis-[90%] justify-center">
        <div className="flex flex-col-reverse w-full h-full md:h-1/3 md:flex-row">
          <div className="relative basis-[20%] md:basis-[40%]">
            <div
              className={`absolute top-0 right-3 transform -translate-x-1/2 w-5 h-1 bg-[#F58220] transition-right duration-300 md:transition-top ${
                selectedIcon === "icon1"
                  ? "right-[100px] md:top-[13%]"
                  : selectedIcon === "icon2"
                  ? "right-[56px] md:top-[36%]"
                  : selectedIcon === "icon3"
                  ? "right-[33px] md:top-[58%]"
                 
                  : selectedIcon === "icon4"
                  ? "right-[10px] md:top-[78%]"
                  : "right-[11px] md:top-[72%]"
              } md:left-1 md:w-1 md:h-5 custom_class1`}
            ></div>
          </div>
          <div className="pr-5 gap-5 flex justify-end basis-[70%] md:pr-0 md:gap-0 md:basis-[60%] md:flex-col md:justify-evenly">
            <div className="relative flex group">
              <HiOutlineUserAdd
                className={`w-6 h-6 cursor-pointer ${
                  selectedIcon === "icon1" ? "text-orange-500" : "text-white"
                }`}
                onClick={() => {
                  setSelectedIcon("icon1");
                  navigate("/admin/users");
                }}
              />
              {/* <span className="absolute bottom-8 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Users
              </span> */}
            </div>

            <div className="relative flex group">
              <CategoryIcon
                sx={{
                  color: selectedIcon === "icon2" ? "#F58220" : "#FFF",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedIcon("icon2");
                  navigate("/admin/genre");
                }}
              />
              {/* <span className="absolute bottom-8 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Genres
              </span> */}
            </div>
            <div className="relative flex group">
              <AccessTimeIcon
                sx={{
                  color: selectedIcon === "icon3" ? "#F58220" : "#FFF",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedIcon("icon3");
                  navigate("/admin/day/part");
                }}
              />
              {/* <span className="absolute bottom-10 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Day Parts
              </span> */}
            </div>
            <div className="relative flex group">
              <BusinessIcon
                sx={{
                  color: selectedIcon === "icon4" ? "#F58220" : "#FFF",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedIcon("icon4");
                  navigate("/admin/client/brand");
                }}
              />
              {/* <span className="absolute bottom-10 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Brands
              </span> */}
            </div>
          </div>
          <div className="basis-[10%] md:basis-0 "></div>
        </div>
      </div>
      <div className="flex flex-col gap-4 align-middle items-center justify-center h-full basis-[10%] md:basis-[10%]">
        <div className="relative group">
          <LogoutIcon
            sx={{ color: "white", fontSize: "30px" }}
            onClick={handleLogout}
          />
          <span className="absolute bottom-10 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Logout
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminSideNav;
