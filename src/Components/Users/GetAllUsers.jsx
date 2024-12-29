import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Search from "../Search/Search";
import AddButton from "../buttons/AddButton";
import Pagination from "../Pagination/Pagination";
import DataTable from "../DataTable/DataTable";
import EnumDropDown from "../DropDown/EnumDropDown";
import FilterDropDown from "../DropDown/FilterDropDown";

const GetAllUsers = () => {
  const devTunnelUrl = import.meta.env.VITE_DEV_TUNNEL_URL;
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [filter,setFilter]= useState("active")
  const [userId,setUserId] = useState()
  const [selectedUser, setSelectedUser] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [active, setActive] = useState(false);
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const usersPerPage = 13;
  const encryptedToken = localStorage.getItem("authCookie");
  const authToken = atob(encryptedToken);

  const handleClientDelete = async(userId,clientId) => {
    console.log("🚀 ~ handleClientDelete ~ clientId:", clientId)
    console.log("🚀 ~ handleClientDelete ~ userId:", userId)
    return {
  }
    

  }
    const fetchUsers = async (page=1 ,limit=10) => {
      try {
        const status = filter !="all" ? (filter=="active"?"true":"false") : "all";
        console.log("🚀 ~ fetchUsers ~ status:", status)
        const response = await fetch(
          `${devTunnelUrl}get_users?page=${page}&limit=${limit}&search=${searchTerm}&active=${status}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${authToken}`,
            },
          }
        );
        const data = await response.json();
      // const data = {
      //   data: [
      //     {
      //       active: true,
      //       clients: [
      //         {
      //           active: true,
      //           id: 45,
      //           name: "Vital Products",
      //         },
      //         {
      //           active: true,
      //           id: 46,
      //           name: "Zameen Media",
      //         },
      //       ],
      //       email: "babaranis@yahoo.com",
      //       id: 27,
      //       name: "Babar Anis",
      //       role: "super_user",
      //     },
      //     {
      //       active: true,
      //       clients: [],
      //       email: "owaisoddo@ando.com",
      //       id: 26,
      //       name: "Asadraza 34",
      //       role: "super_user",
      //     },
      //     {
      //       active: true,
      //       clients: [],
      //       email: "tayyab@gmail.com",
      //       id: 25,
      //       name: "Tayyab",
      //       role: "user",
      //     },
      //     {
      //       active: true,
      //       clients: [],
      //       email: "talib@gmail.com",
      //       id: 24,
      //       name: "Talib",
      //       role: "user",
      //     },
      //     {
      //       active: true,
      //       clients: [],
      //       email: "majid@gmail.com",
      //       id: 23,
      //       name: "Majid",
      //       role: "user",
      //     },
      //     {
      //       active: true,
      //       clients: [],
      //       email: "bilal@gmail.com",
      //       id: 22,
      //       name: "Bilal",
      //       role: "user",
      //     },
      //     {
      //       active: true,
      //       clients: [],
      //       email: "ali@gmail.com",
      //       id: 21,
      //       name: "Ali",
      //       role: "user",
      //     },
      //     {
      //       active: true,
      //       clients: [],
      //       email: "hasan@gmail.com",
      //       id: 20,
      //       name: "Hasan",
      //       role: "user",
      //     },
      //     {
      //       active: true,
      //       clients: [],
      //       email: "wahib@gmail.com",
      //       id: 19,
      //       name: "Wahib",
      //       role: "user",
      //     },
      //     {
      //       active: true,
      //       clients: [],
      //       email: "daniyal@gmail.com",
      //       id: 18,
      //       name: "Daniyal",
      //       role: "user",
      //     },
      //   ],
      //   total: 26,
      // };
      if (response.ok) {
        console.log("🚀 ~ fetchUsers ~ data:", data)
       setUsers(data.data);
       const _totalRecords = data.total;
       setTotalRecords(_totalRecords);
   
        } else {
          toast.error(data.message || "Failed to fetch users.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching users.");
      }
    };
  useEffect(() => {
    fetchUsers(currentPage, usersPerPage);
  }, [devTunnelUrl, currentPage, searchTerm, active,filter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page on a new search
  };

  const totalPages = Math.ceil(totalRecords / usersPerPage);
  
  const openModal = (type="add", user = {}) => {
    setModalType(type);
    setSelectedUser(
      type === "edit"
        ? { ...user, confirmPassword: "" }
        : {
            id: null,
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
          }
    );
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);
  const closeDeleteModal = () => setOpenDeleteModel(false);

  const handleSubmit = async (type) => {
    if (
      selectedUser?.confirmPassword &&
      selectedUser?.password !== selectedUser?.confirmPassword
    ) {
      toast.error("Passwords do not match.");
      return; // Prevent form submission if passwords don't match
    }


    if (modalType === "add") {
      const { name, email, password, confirmPassword, role } = selectedUser;
      if (!name || !email || !password || !confirmPassword || !role) {
        toast.error("All fields are required.");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Password and Confirm Password do not match.");
        return;
      }
    }

    const newUser = {
      ...(selectedUser?.name && { name: selectedUser.name }),
      ...(selectedUser?.email && { email: selectedUser.email }),
      ...(selectedUser?.password && { password: selectedUser.password }),
      ...(selectedUser?.role && { role: selectedUser.role }),
    };


    try {
      let response;
      let data;
      if (modalType === "add") {
        // Add user (POST request)
        response = await fetch(`${devTunnelUrl}add_user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
          body: JSON.stringify(newUser),
        });
        data = await response.json();

        if (response.ok) {
          toast.success("User added successfully!");
          fetchUsers(currentPage,usersPerPage)
          // setUsers((prevUsers) => [data.user, ...prevUsers]); // Add the new user to the list
          closeModal();
        } else {
          toast.error(data.message || "Failed to add user.");
        }
      } else if (modalType === "edit") {
    
        // Update user (PUT request)
        const id = type == "delete" ? userId:selectedUser.id
        response = await fetch(
          `${devTunnelUrl}update_user/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${authToken}`,
            },
            body: JSON.stringify((type=="delete" ? {active: !active} :newUser )),
          }
        );
        data = await response.json();

        if (response.ok) {
          toast.success("User updated successfully!");
          // Update local state after successful API call
          setUsers(
            users.map((user) =>
              user.id === selectedUser.id
                ? {
                    ...user,
                    // Only update fields that were changed
                    ...newUser, // Apply the changes to the user object
                  }
                : user
            )
          );
          setActive((prev) => !prev )
          closeModal();
          closeDeleteModal();

        } else {
          toast.error(data.message || "Failed to update user.");
        }
      }
    } catch (error) {
      toast.error("An error occurred while saving the user.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => ({ ...prev, [name]: value }));
  };
  const openAlert = (type,Id,active) => {
    setActive(active)
    setUserId(Id)
    setModalType(type)
    setOpenDeleteModel(true);
  };

  return (
    <div className="p-6 bg-white min-h-screen text-gray-800">
      <ToastContainer autoClose={2000} position="top-center" />

      <div className="flex justify-between mb-6 space-x-4">
        <div className="relative w-1/3">
          <Search
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            searchText="users"
          />
        </div>

        <div className="w-1/3">
          <AddButton openModal={openModal} text="Add User" />
        </div>
      </div>
  <FilterDropDown value={filter} setValue={setFilter} />
      <div
        className="overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        <DataTable
          headers={["NAME", "EMAIL", "ROLE", "CLIENTS", "ACTIONS"]}
          data={users}
          openModal={openModal}
          openAlert={openAlert}
          handleClientDelete = {handleClientDelete}
        />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-orange-600">
                {modalType === "add" ? "Add New User" : "Edit User"}
              </h2>
              <button onClick={closeModal} className="text-gray-500">
                <FaTimes />
              </button>
            </div>
            <input
              type="text"
              name="name"
              value={selectedUser.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="email"
              name="email"
              value={selectedUser.email}
              onChange={handleInputChange}
              placeholder="Email"
              className={`w-full mb-4 p-3 border border-gray-300 rounded-lg ${
                modalType === "edit" ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              disabled={modalType === "edit"}
            />
            <input
              type="password"
              name="password"
              value={selectedUser.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="password"
              name="confirmPassword"
              value={selectedUser.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
            />
            <select
              name="role"
              value={selectedUser.role}
              onChange={handleInputChange}
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
            >
              {modalType == "add" && <option value="">Select Role</option>}
              <option value="user">User</option>
              <option value="super_user">Sub Admin</option>
            </select>

            <AddButton
              text={modalType === "add" ? "Add User" : "Save Changes"}
              handleSubmit={handleSubmit}
              update={true}
            />
          </div>
        </div>
      )}
      {openDeleteModel && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-1/3 ">
            <div className="flex justify-end items-center mb-4">
              <button onClick={closeDeleteModal} className="text-gray-500">
                <FaTimes />
              </button>
            </div>
            <div className="flex justify-center pb-4">
              <h1 className="text-4xl font-bold text-orange-600 justify-center">
                Do you want to {active ? "Deactivate" : "Activate"} this User?
              </h1>
            </div>
            <AddButton text="Yes" handleSubmit={() => handleSubmit("delete")} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllUsers;
