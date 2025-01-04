import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "../../../../Components/Pagination/Pagination";
import ToastNotification from "../../../../Components/Toasts/ToastNotification";
import DataTable from "../../../../Components/DataTable/DataTable";
import AdminSideNav from "../../../../Components/SideNav/AdminSideNav";
import Search from "../../../../Components/Search/Search";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import AddButton from "../../../../Components/buttons/AddButton";
import FilterDropDown from "../../../../Components/DropDown/FilterDropDown";

const ClientAndBrandManagement = () => {
  const devTunnelUrl = import.meta.env.VITE_DEV_TUNNEL_URL;

  const [clients, setClients] = useState([]);
  const [clientName, setClientName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [brandInputs, setBrandInputs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [newClient, setNewClient] = useState("");
  const [newClientId, setNewClientId] = useState(1);
  const [active,setActive] = useState(false);
  const [newBrands, setNewBrands] = useState([]); // List of brands for the modal
  const [selectedOptions, setSelectedOptions] = useState([]); // Selected brands in AsyncSelect
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
      const [filter,setFilter] = useState("active");

  const limit = 10;

  const encryptedToken = localStorage.getItem("authCookie");
  const authToken = atob(encryptedToken);

  const fetchClientsWithBrands = async (page = 1, limit = 10) => {
    try {
   const status =
     filter != "all" ? (filter == "active" ? "true" : "false") : "all";
      const response = await fetch(
        `${devTunnelUrl}get_clients_with_brands?page=${page}&limit=${limit}&search=${searchTerm}&active=${status}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
        }
      );

      if (response.ok) {
        const _data = await response.json();
        const data = _data.data;
        const totalRecords = _data.records;

        setTotalRecords(totalRecords);
        setClients(Array.isArray(data) ? data : []);
        setBrandInputs(Array.isArray(data) ? Array(data.length).fill("") : []);
      } else {
        console.error("Failed to fetch clients");
        setClients([]);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]);
    }
  };

  useEffect(() => {
    fetchClientsWithBrands(currentPage, limit);
  }, [devTunnelUrl, currentPage, searchTerm,active,filter]);

  const addClient = async (event) => {
    event.preventDefault();

    if (!clientName.trim()) {
      toast.error("Client name cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`${devTunnelUrl}add_client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authToken}`,
        },
        body: JSON.stringify({
          client: { name: clientName.trim() },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setClientName("");
        fetchClientsWithBrands(currentPage, limit);
        toast.success("Client added successfully!");
      } else {
        toast.error(data.message || "Failed to add client");
      }
    } catch (error) {
      console.error("Error adding client:", error);
      toast.error("An error occurred while adding the client.");
    }
  };

  const handleAddBrand = async (index) => {
    const brandInput = brandInputs[index];
    if (!brandInput) {
      toast.error("Brand cannot be empty.");
      return;
    }

    const client = clients[index];
    const clientId = client.client.id;
    const brands = brandInput
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name);

    try {
      const response = await fetch(
        `${devTunnelUrl}add_brands_to_client/${clientId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
          body: JSON.stringify({
            brands: brands.map((name) => ({ name })),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        fetchClientsWithBrands(currentPage, limit);
        const newBrandInputs = [...brandInputs];
        newBrandInputs[index] = "";
        setBrandInputs(newBrandInputs);
        toast.success("Brand added successfully!");
      } else {
        toast.error(data.message || "Failed to add brand");
      }
    } catch (error) {
      console.error("Error adding brand:", error);
      toast.error("An error occurred while adding the brand.");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const openModal = (type, data) => {
    setIsModalOpen(true);
    setNewClient(data.client.name);
    setNewClientId(data.client.id);

    setNewBrands(data.client.brands); // Populate existing brands in the modal
    setSelectedOptions(
      data.client.brands.map((brand) => ({
        label: brand.name,
        value: brand.id,
      }))
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewClient("");
    setNewBrands([]);
    setSelectedOptions([]);
  };

  const updateClientAndBrand = async (type) => {
    try {

     
      const response = await fetch(
        `${devTunnelUrl}update_client_or_brands/${newClientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
          body: JSON.stringify({
            client: {
              ...(type == "delete"
                ? { active: !active }
                : {
                    ...(newClient && { name: newClient }),
                    brands: selectedOptions.map((option) => ({
                      id: option.value,
                      name: option.label,
                    })),
                  }),
            },
          }),
        }
      );

      if (response.ok) {
        fetchClientsWithBrands(currentPage, limit);
        toast.success("Client and brands updated successfully!");
        setActive((prev) =>!prev)
        closeModal();
        closeDeleteModal();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to update client and brands");
      }
    } catch (error) {
      console.error("Error updating client and brands:", error);
      toast.error("An error occurred while updating.");
    }
  };

  const loadBrands = (inputValue) => {
    return Promise.resolve(
      newBrands
        .filter((brand) =>
          brand.name.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((brand) => ({ label: brand.name, value: brand.id }))
    );
  };

  const handleChange = (selected) => {
    setSelectedOptions(selected);
  };
  const openAlert = (type, Id, active) => {
    // return;
    setActive(active);
    setNewClientId(Id);
    setOpenDeleteModel(true);
  };
  const totalPages = Math.ceil(totalRecords / limit);
  const closeDeleteModal = () => setOpenDeleteModel(false);

  return (
    <div className='flex flex-col md:flex-row w-full h-screen bg-cover bg-center bg-no-repeat bg-[url("https://i.ibb.co/S69yyvw/thumbnail.jpg")]'>
      <AdminSideNav />

      <div className="p-6 bg-white min-h-screen text-gray-800 basis-[95%]">
        <ToastNotification />
        <div className="flex items-center justify-between">
          <div className="relative w-1/3">
            <Search
              searchText="clients or brands"
              searchTerm={searchTerm}
              handleSearch={handleSearch}
            />
          </div>
          <form
            className="flex  mt-4 mb-6 w-2/3 justify-end"
            onSubmit={addClient}
          >
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Add Client"
              className="border border-gray-300 p-2 rounded-l-lg w-1/2"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#E73C30] to-[#F58220] text-white font-semibold p-2 rounded-r-lg w-1/6 hover:bg-white hover:text-[#E73C30] hover:border-2 hover:border-[#E73C30] transition duration-300"
            >
              Add Client
            </button>
          </form>
        </div>

        <FilterDropDown value={filter} setValue={setFilter} />
        <DataTable
          headers={["CLIENTS", "BRANDS", "ACTIONS"]}
          data={clients}
          brandInputs={brandInputs}
          setBrandInputs={setBrandInputs}
          handleAddBrand={handleAddBrand}
          styling="w-1/2"
          openModal={openModal}
          openAlert={openAlert}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4 text-[#E73C30]">
              Update Client & Brands
            </h3>
            <div>
              <input
                type="text"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                placeholder="Client Name"
                className="border border-gray-300 p-2 mb-4 w-full rounded-lg"
              />
              <AsyncSelect
                isMulti
                cacheOptions
                defaultOptions={newBrands.map((brand) => ({
                  label: brand.name,
                  value: brand.id,
                }))}
                loadOptions={loadBrands}
                onChange={handleChange}
                value={selectedOptions}
                placeholder="Select Brands"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={()=>updateClientAndBrand("edit")}
                className="bg-gradient-to-r from-[#E73C30] to-[#F58220] text-white font-semibold p-2 rounded-lg mr-2 hover:bg-white hover:text-[#E73C30] hover:border-2 hover:border-[#E73C30] transition duration-300"
              >
                Save
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-200 text-gray-800 font-semibold p-2 rounded-lg hover:bg-gray-300 transition duration-300"
              >
                Cancel
              </button>
            </div>
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
                Do you want to {active == true ? "Deactivate" : "Activate"} this
                Client?
              </h1>
            </div>
            <AddButton text="Yes" handleSubmit={()=>updateClientAndBrand("delete")} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientAndBrandManagement;
