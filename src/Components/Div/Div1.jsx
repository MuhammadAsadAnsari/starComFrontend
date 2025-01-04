import React, { useState, useRef, useEffect } from "react";
import DropDown from "../DropDown/DropDown";
import Button from "../buttons/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const Div1 = ({ setFields }) => {
  const devTunnelUrl = import.meta.env.VITE_DEV_TUNNEL_URL;

  const encryptedToken = localStorage.getItem("authCookie");
  const authToken = atob(encryptedToken);

  const [newClient, setNewClient] = useState();
  const [newBrand, setNewBrand] = useState();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateError, setDateError] = useState("");

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  let fileRateInputRef = useRef(null);
  const fileRatingInputRef = useRef(null);

  const [ratingFileName, setRatingFileName] = useState("Upload Rating File");
  const [rateFileName, setRateFileName] = useState("Upload Rate File");

  const [clients, setClients] = useState([]);
  const [brands, setBrands] = useState([]);
  const [ratingFile, setRatingFile] = useState(null);
  const [rateFile, setRateFile] = useState(null);

  const [rate, setRate] = useState("");

  const fetchClient = async () => {
    try {
      const response = await fetch(`${devTunnelUrl}get_clients`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authToken}`,
        },
      });

      if (!response.ok) return toast.error("Cannot fetch client.");

      const data = await response.json();
      setClients(data.data);
    } catch (error) {
      toast.error("An error occurred while fetching Clients.");
    }
  };

  useEffect(() => {
    fetchClient();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch(
        `${devTunnelUrl}client/${newClient}/brands`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
        }
      );

      if (!response.ok) return toast.error("Cannot fetch brands.");

      const data = await response.json();
      setBrands(data.brands);
    } catch (error) {
      toast.error("An error occurred while fetching Brands");
    }
  };

  useEffect(() => {
    if (newClient) fetchBrands();
  }, [newClient]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date >= endDate) {
      setDateError("End date must be greater than start date.");
    } else {
      setDateError("");
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate && date <= startDate) {
      setDateError("End date must be greater than start date.");
    } else {
      setDateError("");
    }
  };

  const handleRatingFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop();
    if (!["xlsx", "xls"].includes(fileExtension)) {
      toast.error(
        "Invalid file format. Please upload an Excel (.xlsx) or (.xls) file."
      );
      return;
    }

    setRatingFile(file);
    setRatingFileName(file.name);
  };

  const handleRateFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop();
    if (!["xlsx", "xls"].includes(fileExtension)) {
      toast.error(
        "Invalid file format. Please upload an Excel (.xlsx) or (.xls) file."
      );
      return;
    }

    setRateFile(file);
    setRateFileName(file.name);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleContinue = () => {
    if (newClient && newBrand && startDate && endDate && ratingFile) {
      const fields = {
        client_id: parseInt(newClient),
        brand_id: parseInt(newBrand),
        input_file: ratingFile,
        ...(rate === "uploadRateFile" && rateFile
          ? { rate_file: rateFile }
          : {}),
        select: rate || "",
        dates: {
          Start_Date: formatDate(startDate),
          End_Date: formatDate(endDate),
        },
      };

      setFields(fields);
    }
  };

  const handleClientChange = async (value) => {
    setNewClient(value);
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
        toast.error("No Data found for client");
        return;
      } else if (!response.ok) return toast.error("Failed to get client rates");
    } catch (error) {
      toast.error("Error while fetching file");
    }
  };
  useEffect(() => {
    if (rate != "uploadRateFile") {
      setRateFileName("Upload Rate File");
      fileRateInputRef = null;
    }
  }, [rate]);

  const isContinueDisabled = !(
    newClient &&
    newBrand &&
    startDate &&
    endDate &&
    ratingFile &&
    ((rate === "uploadRateFile" && rateFile) || rate !== "uploadRateFile")
  );
  return (
    <div className="flex flex-col pl-[10%] pr-[6%] py-[2%] basis-[60%] md:py-0 ">
      <div className="flex flex-col pr-12 ss:pr-20 lg:pr-32">
        <div className="flex flex-col gap-[5%] lg:flex-row">
          <DropDown
            labeltext="Client"
            placeholdertext="Select Client"
            value={newClient}
            onChange={(e) => handleClientChange(e.target.value)}
            data={clients}
            styling="lg:w-[47.5%]"
          />
          <DropDown
            labeltext="Brand"
            placeholdertext="Select Brand"
            data={brands}
            value={newBrand}
            setValue={setNewBrand}
            styling="lg:w-[47.5%]"
          />
        </div>

        <div className="w-full flex flex-col my-2 lg:my-2">
          <label className="text-sm text-[#282828] font-poppins ss:text-lg mb-2">
            Upload Rating File
          </label>
          <div
            className="border rounded-lg p-3 mt-2 flex items-center justify-between cursor-pointer"
            onClick={() => fileRatingInputRef.current.click()}
          >
            <span className="text-[#53615A] ml-2">{ratingFileName}</span>
            <img src="https://i.ibb.co/FW7SPPc/upload.png" className="mr-2" />
            <input
              type="file"
              placeholder="upload file"
              ref={fileRatingInputRef}
              style={{ display: "none" }}
              onChange={handleRatingFileChange}
            />
          </div>
        </div>

        <div className="w-full flex flex-col mb-2 lg:mb-6">
          <label className="mt-2 2xl:mt-4 text-sm font-semibold">Select Rates</label>
          <div className="flex items-center gap-4 mt-2">
            <label>
              <input
                type="radio"
                name="rates"
                value="systemRates"
                onChange={(e) => setRate(e.target.value)}
                checked={rate === "systemRates"}
              />{" "}
              System Rates
            </label>
            <label>
              <input
                type="radio"
                name="rates"
                value="tariffRates"
                onChange={(e) => setRate(e.target.value)}
                checked={rate === "tariffRates"}
              />{" "}
              Tariff Rates
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="rates"
                value="uploadRateFile"
                onChange={(e) => setRate(e.target.value)}
                checked={rate === "uploadRateFile"}
              />{" "}
              <div
                className={`ml-2 border rounded-lg px-3 py-1 cursor-pointer ${
                  rate === "uploadRateFile" ? "bg-white" : "bg-gray-200"
                }`}
                onClick={() =>
                  rate === "uploadRateFile" && fileRateInputRef.current.click()
                }
              >
                {rateFileName}
                <input
                  type="file"
                  ref={fileRateInputRef}
                  onChange={handleRateFileChange}
                  style={{ display: "none" }}
                />
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-col basis-[10%] md:gap-[2%] lg:flex-row mt-2">
          <div className="w-full flex flex-col">
            <label className="text-sm text-[#282828] font-poppins ss:text-lg mr-2 mb-2">
              Plan Start date
            </label>
            <div className="relative w-full flex items-center border-[1px] px-2 py-2 border-[#DEDEDE] rounded-lg">
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                dateFormat="yyyy/MM/dd"
                placeholderText="Starting Date"
                className="w-full focus:outline-none focus:ring-0 pointer-events-none" // Disable pointer events
                ref={startDateRef}
              />

              <FaCalendarAlt
                className="absolute right-2 top-3 text-[#53615A] cursor-pointer pointer-events-auto" // Re-enable pointer events for the icon
                onClick={() => startDateRef.current.setFocus()}
              />
            </div>
          </div>
          <div className="w-full flex flex-col mt-2 lg:mt-0 lg:ml-4">
            <label className="text-xs text-[#282828] font-poppins ss:text-lg mr-2 mb-2">
              Plan End date
            </label>
            <div className="relative w-full flex items-center border-[1px] px-2 py-2 border-[#DEDEDE] rounded-lg">
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                dateFormat="yyyy/MM/dd"
                placeholderText="Ending Date"
                className="w-full focus:outline-none focus:ring-0 pointer-events-none"
                ref={endDateRef}
              />
              <FaCalendarAlt
                className="absolute right-2 top-3 text-[#53615A] cursor-pointer pointer-events-auto"
                onClick={() => endDateRef.current.setFocus()}
              />
            </div>
          </div>
        </div>
        {dateError && <p className="text-red-500 text-sm mt-2">{dateError}</p>}
      </div>
      <Button
        text="CONTINUE"
        styling="mt-4 2xl:mt-8 mr-12 ss:mr-20 lg:mr-32"
        disabled={isContinueDisabled}
        onClick={handleContinue}
      />
    </div>
  );
};

export default Div1;
