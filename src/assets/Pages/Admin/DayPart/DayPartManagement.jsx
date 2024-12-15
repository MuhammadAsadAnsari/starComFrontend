import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "../../../../Components/Pagination/Pagination";
import ToastNotification from "../../../../Components/Toasts/ToastNotification";
import DataTable from "../../../../Components/DataTable/DataTable";
import { toast } from "react-toastify";
import AdminSideNav from "../../../../Components/SideNav/AdminSideNav";
import EnumDropDown from "../../../../Components/DropDown/EnumDropDown";
import AddButton from "../../../../Components/buttons/AddButton";
import CheckIcon from "@mui/icons-material/Check";
const DayPartManagement = () => {
  const devTunnelUrl = import.meta.env.VITE_DEV_TUNNEL_URL;
  const encryptedToken = localStorage.getItem("authCookie");
  const authToken = atob(encryptedToken);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [updatedDayPart, setUpdatedDayPart] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dayPartEnum, setDayPartEnum] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deviation,setDeviation] = useState(0)
  const [pointValue, setPointValue] = useState(0);

  const [deviationId,setDeviationId] = useState(1);
  const [pointValueId, setPointValueId] = useState(1);

const [dayPartType,setDayPartType] = useState("")
  const limit = 12;

  const fetchDeviation = async() =>{
  try {
 
    const response = await fetch(`${devTunnelUrl}get_utilities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${authToken}`,
      },
    });

  
   

    if (response.ok) {
        const data = await response.json();
     setDeviationId(data.data[0].id);
     setPointValueId(data.data[1].id);

     setDeviation(data.data[0].value);
     setPointValue(data.data[1].value);
    } else {
      toast.error(data.message || "Failed to fetch standard Deviation.");
    }
  } catch (error) {
    console.error("Error fetching day parts:", error);
    toast.error("An error occurred while fetching standard Deviation.");
  }
  }
  const fetchDayParts = async () => {
    try {
      const response = await fetch(
        `${devTunnelUrl}get_dayparts?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
        }
      );
      const dayPartReponse = await fetch(`${devTunnelUrl}get_daypart_types`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authToken}`,
        },
      });

      const data = await response.json();
      const dayPartEnumData = await dayPartReponse.json();
      console.log("🚀 ~ fetchDayParts ~ dayPartEnumData:", dayPartEnumData);

      if (response.ok && dayPartReponse.ok) {
        setTimeSlots(data.data);
        setTotalRecords(data.total);
        setDayPartEnum(dayPartEnumData);
      } else {
        console.error("Failed to fetch day parts:", data.message);
        toast.error(data.message || "Failed to fetch day parts.");
      }
    } catch (error) {
      console.error("Error fetching day parts:", error);
      toast.error("An error occurred while fetching day parts.");
    }
  };

  useEffect(() => {
fetchDeviation();
    fetchDayParts();
    
  }, [devTunnelUrl, authToken, currentPage]);

const addDayPartTpye = async()=>{
   try {
    console.log("DayParts added",dayPartType)
    
     const response = await fetch(`${devTunnelUrl}add_daypart_type`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         Authorization: `${authToken}`,
       },
       body: JSON.stringify({ name:dayPartType }),
     });
  if(response.ok){
    toast.success('Day part added successfully!');
    fetchDayParts();
    setDayPartType(null);
    closeModal();
  }else{
    const data = await response.json();
    toast.error(data.message || "Failed to add day part");
  }
   } catch (error) {
     console.error("Error adding genre:", error);
     toast.error("An error occurred while adding the genre.");
   }
}

  const openModal = (type = "edit", slot) => {
    if (type == "add") {
      setIsModalOpen(true);
      return;
    }
    setSelectedSlot(slot);
    setUpdatedDayPart(slot.dayPartTypeId);
  };
  const closeModal=()=>{
    setIsModalOpen(false);
    setSelectedSlot(null);
    setUpdatedDayPart(1);
  }

  const handleUpdate = async () => {
    try {
      console.log("��� ~ handleUpdate ~ updatedDayPart:", updatedDayPart);
      const response = await fetch(
        `${devTunnelUrl}update_daypart/${selectedSlot.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
          body: JSON.stringify({
            day_part_type_id: updatedDayPart,
          }),
        }
      );
      if (response.ok) {
        toast.success("Day part updated successfully!");

        const updatedSlots = timeSlots.map((slot) =>
          slot.id === selectedSlot.id
            ? { ...slot, dayPart: updatedDayPart }
            : slot
        );
        setTimeSlots(updatedSlots);

        setSelectedSlot((prev) => ({ ...prev, dayPart: updatedDayPart }));
        setTimeout(() => setSelectedSlot(null), 500);
        fetchDayParts();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to update day part");
      }
    } catch (error) {
      console.error("Error updating day part:", error);
      toast.error("An error occurred while updating the day part.");
    }
  };
  const handleDeviation = async(type)=>{
    console.log("Deviation clicked",typeof deviation,deviationId,type)
    const id = type == "Standard Deviation" ? deviationId: pointValueId;
    const value = type == "Standard Deviation" ? parseFloat(deviation): parseFloat(pointValue)
    try {
       const response = await fetch(
         `${devTunnelUrl}update_utility/${id}`,
         {
           method: "PUT",
           headers: {
             "Content-Type": "application/json",
             Authorization: `${authToken}`,
           },
           body: JSON.stringify({ name: type, value }),
         }
       );
       const data = await response.json();
       if(response.ok){
         toast.success('Utility updated successfully!');
         
       }
       else{
    toast.error(data.message || "Failed to update day part");
       }
    } catch (error) {
      console.error("Error updating standard deviation", error);
      toast.error("An error occurred while updating the standard deviation");
    }
  }

  const totalPages = Math.ceil(totalRecords / limit);

  return (
    <div className='flex flex-col md:flex-row w-full h-screen bg-cover bg-center bg-no-repeat bg-[url("https://i.ibb.co/S69yyvw/thumbnail.jpg")]'>
      <AdminSideNav />
      <div className="p-6 min-h-screen text-gray-800 bg-white basis-[95%]">
        <ToastNotification />
        <div className="flex justify-between mb-6 space-x-4 align-middle">
          <div className="relative w-1/3">
            <input
              type="text"
              value={deviation}
              onChange={(event) => setDeviation(event.target.value)}
              className="w-2/3 p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <CheckIcon
              className="absolute top-4 right-44 text-gray-500"
              onClick={() => handleDeviation("Standard Deviation")}
            />
          </div>
          <div className="relative w-1/3">
            <input
              type="text"
              value={pointValue}
              onChange={(event) => setPointValue(event.target.value)}
              className="w-2/3 p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <CheckIcon
              className="absolute top-4 right-44 text-gray-500"
              onClick={() => handleDeviation("Threshold")}
            />
          </div>
          <div className="w-1/3">
            <AddButton openModal={openModal} text="Add Day Part" />
          </div>
        </div>

        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <DataTable
            headers={["TIMINGS", "DAY PART"]}
            data={timeSlots}
            openModal={openModal}
          />
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h3 className="text-lg font-semibold mb-4 text-[#E73C30]">
                Add Day Part
              </h3>
              <input
                type="text"
                value={dayPartType}
                onChange={(e) => setDayPartType(e.target.value)}
                placeholder="Add Day Part"
                className="border border-gray-300 p-2 w-full rounded-lg mb-4"
              />

              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={addDayPartTpye}
                  className="bg-gradient-to-r from-[#E73C30] to-[#F58220] text-white font-semibold px-6 py-2 rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
        {selectedSlot && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h3 className="text-lg font-semibold mb-4 text-[#E73C30]">
                Update Day Part
              </h3>

              <EnumDropDown
                data={dayPartEnum.dropdown}
                value={updatedDayPart}
                setValue={setUpdatedDayPart}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="font-semibold px-4 py-2 rounded-full transition duration-300 bg-gray-300 text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="font-semibold px-4 py-2 rounded-full transition duration-300 bg-gradient-to-r from-[#E73C30] to-[#F58220] text-white hover:bg-white hover:text-[#E73C30] hover:border-2 hover:border-[#E73C30]"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayPartManagement;
