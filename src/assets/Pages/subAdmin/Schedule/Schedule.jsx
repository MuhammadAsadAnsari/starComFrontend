import React, { useRef, useState } from "react";
import LogoImageBlack from "../../../../Components/Images/LogoImageBlack";
import SideNav from "../../../../Components/SideNav/SideNav";
import Button from "../../../../Components/buttons/Button";
import DropDown from "../../../../Components/DropDown/DropDown";
import TableHeading from "../../../../Components/table/TableHeading";
import TableData from "../../../../Components/table/TableData";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Schedule = () => {
  const navigate = useNavigate();
  const devTunnelUrl = import.meta.env.VITE_DEV_TUNNEL_URL;
  const encryptedToken = localStorage.getItem("authCookie");
  const authToken = atob(encryptedToken);
  const fileInputRef = useRef(null);
  const [uploadRates, setUploadRates] = useState("Upload file");
  const [downloadRates, setDownloadRates] = useState("Download file");
  const [selectedClient, setSelectedClient] = useState("");
  const [clientData, setClientData] = useState([]);
  const [downloadEnabled, setDownloadEnabled] = useState(false);
  const [dataFounds, setDataFounds] = useState();
  const [fileData, setFileData] = useState([]);
    localStorage.setItem("hideHomeIcon", true);
  const fetchClientData = async () => {
    try {
      const response = await fetch(`${devTunnelUrl}get_clients`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authToken}`,
        },
      });
      if (!response.ok) return toast.error("Error fetching client data");

      const data = await response.json();
      setClientData(data.data);
    } catch (error) {
      toast.error("Failed to fetch client data");
    }
  };
  fetchClientData();

  const handleUpload = async () => {
    fileInputRef.current.click();
  };
  const handleDownload = async () => {
    fetch(
      `${devTunnelUrl}/download_client_rates?client_id=${selectedClient}&download=true`,
      {
        method: "GET",
        headers: {
          Authorization: `${authToken}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.arrayBuffer();
      })
      .then((buffer) => {

        // Convert buffer to a Blob or save it as a file
        const blob = new Blob([buffer]);
        const url = URL.createObjectURL(blob);

        // Create a download link (for example)
        const a = document.createElement("a");
        a.href = url;
        a.download = "client_rates.xlsx"; // Change file extension accordingly
        a.click();

        // Revoke object URL to free memory
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        toast.error("Error fetching the buffer:", error);
      });
  };
  const handleClientChange = async (value) => {
    setSelectedClient(value);
    try {
      const response = await fetch(
        `${devTunnelUrl}get_client_rates?client_id=${value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
        }
      );
      if (response.status == 404) {
        setFileData(null);
        setDownloadEnabled(false);
        setDownloadRates("Downloading Exists");
        setDataFounds("No Data Found.Please Upload file");
        return;
      } else if (!response.ok) return toast.error("Failed to get client rates");

      const data = await response.json();
      setFileData(data.data);
      setDownloadEnabled(true);
    } catch (error) {
      toast.error("Error while fetching file");
    }
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file.name.split(".")[1] != "xlsx" && file.name.split(".")[1] != "xls") {
      toast.error(
        "Invalid file format. Please upload an Excel (.xlsx) or Excel (.xls) file."
      );
      return;
    }
    if (file) {
      setUploadRates(file.name);
    }
    try {
      const formData = new FormData();
      formData.append("client_id", selectedClient);
      formData.append("file", file);

      const response = await fetch(`${devTunnelUrl}upload_client_data`, {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `${authToken}`,
        },
        body: formData,
      });
      if (!response.ok) return toast.error("File to fetch.");
      else if (response.status == 200) {
        const data = await response.json();
        toast.success(data.message);
        handleClientChange(selectedClient);
      }
    } catch (error) {
      toast.error("Failed to upload file");
    }
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }); // Format: hh:mm AM/PM
    return `${formattedTime}`;
  };
  const handleDeleteRates = async () => {
    try {
      const response = await fetch(
        `${devTunnelUrl}delete_client_rates/${selectedClient}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
        }
      );

      if (!response.ok) return toast.error("Error deleting client rates.");
      const data = await response.json();

      toast.success(data.message);
      setFileData(null);
      setDownloadEnabled(false);
      setDataFounds("No Data Found.Please Upload file");
      return;
    } catch (error) {
      toast.error("Error while deleting rates.");
    }
  };
  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-cover bg-center bg-no-repeat bg-[url('https://i.ibb.co/S69yyvw/thumbnail.jpg')]">
      <SideNav />
      <ToastContainer autoClose={2000} position="top-center" />

      <div className="flex flex-col w-full bg-white md:py-0 md:h-100%">
        {/* Header Section */}
        <div className="flex pt-6 w-full items-center justify-between px-[10%]">
          <LogoImageBlack styling="w-24 h-24" color="black" />
          <div>
            <Button
              text="Exit"
              styling="mr-[33%] lg:mr-[25%] px-8"
              onClick={() => navigate("/")}
            />
          </div>
        </div>

        <div className="flex flex-col pl-[10%] w-[40%]">
          <div className="flex items-center justify-between">
            <DropDown
              labeltext="Client"
              placeholdertext="Select Client"
              data={clientData}
              onChange={(e) => handleClientChange(e.target.value)}
              value={selectedClient}
            />
            <Button
              text="DELETE"
              styling={`px-10 mt-6 ${
                !selectedClient || !downloadEnabled
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              onClick={() =>
                selectedClient && downloadEnabled && handleDeleteRates()
              }
            />
          </div>
          <div className="flex gap-10 my-2 lg:my-4">
            <div className="w-full flex flex-col">
              <label className="text-sm text-[#282828] font-poppins ss:text-lg mb-2">
                Upload Rates
              </label>
              <div
                className={`flex items-center justify-between w-full border-[1px] py-3 rounded-lg cursor-pointer ${
                  !selectedClient ? "cursor-not-allowed opacity-50" : ""
                }`}
                onClick={() => selectedClient && handleUpload()}
              >
                <span className="text-[#53615A] ml-2">{uploadRates}</span>
                <img
                  src="https://i.ibb.co/FW7SPPc/upload.png"
                  className="mr-2"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className="w-full flex flex-col">
              <label className="text-sm text-[#282828] font-poppins ss:text-lg mb-2">
                Download Rates
              </label>
              <div
                className={`flex items-center justify-between w-full border-[1px] py-3 rounded-lg cursor-pointer ${
                  !selectedClient || !downloadEnabled
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                onClick={() =>
                  selectedClient && downloadEnabled && handleDownload()
                }
              >
                <span className="text-[#53615A] ml-2">{downloadRates}</span>
                <img
                  src="https://i.ibb.co/Sy1mghL/download.png"
                  className="mr-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-2 px-[10%]">
          <div
            className="overflow-y-auto border border-gray-300 rounded-lg 
            max-h-64 2xl:max-h-80
        
       "
          >
            {fileData && fileData.length > 0 ? (
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr>
                    <TableHeading heading="Start Time" />
                    <TableHeading heading="End Time" />
                    <TableHeading heading="Channel" />
                    <TableHeading heading="Tariff" />
                    <TableHeading heading="% Discount" />
                    <TableHeading heading="Client Rate" />
                    <TableHeading heading="Application Form" />
                    <TableHeading heading="Application Till" />
                  </tr>
                </thead>
                <tbody>
                  {fileData.map((row, index) => (
                    <tr key={index} className="border-b">
                      <TableData data={formatDateTime(row.start_time)} />
                      <TableData data={formatDateTime(row.end_time)} />
                      <TableData data={row.channel_name} />
                      <TableData data={row.tariff} />
                      <TableData data={row.discount} />
                      <TableData data={row.client_rate} />
                      <TableData data={row.applicable_from} />
                      <TableData data={row.applicable_to} />
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-bold text-red-500 text-center font-bold">
                {dataFounds && dataFounds}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
