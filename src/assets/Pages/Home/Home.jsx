import LogoImageBlack from "../../../Components/Images/LogoImageBlack";
import SideNav from "../../../Components/SideNav/SideNav";
import React, { useEffect, useState } from "react";
import Button from "../../../Components/buttons/Button";

import SelectedDropDown from "../../../Components/SelectedDropDown/SelectedDropDown";
import HomeParagraph from "../../../Components/Paragraphs/HomeParagraph";
import Input from "../../../Components/Input/Input";
import GenreSplitField from "../../../Components/GenreSplitFields/GenreSplitField";
import Div2 from "../../../Components/Div/Div2";
import Div3 from "../../../Components/Div/Div3";
import Div1 from "../../../Components/Div/Div1";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
const Home = () => {
  const navigate = useNavigate();
  const devTunnelUrl = import.meta.env.VITE_DEV_TUNNEL_URL;
  const encryptedToken = localStorage.getItem("authCookie");
  const authToken = atob(encryptedToken);

  const [isLoading, setIsLoading] = useState(false);
  const [budgetError, setBudgetError] = useState("");
  const user_data = JSON.parse(localStorage.getItem("user_data"));
  const fileData = JSON.parse(localStorage.getItem("data"));

  const [fields, setFields] = useState(user_data || {});

  const [noOfCopies, setNoOfCopies] = useState({});
  const [dayPartEnum, setDayPartEnum] = useState([]);

  const [grpTarget, setGrpTarget] = useState("");
  const [budget, setBudget] = useState();
  const [selectedCopies, setSelectedCopies] = useState();

  const [dayParts, setDayParts] = useState({});
  const [genreSplitFields, setGenreSplitFields] = useState({});
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [durations, setDurations] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [validateCopies, setValidatesCopies] = useState(false);
  const role = localStorage.getItem("userRole");
  const [clientName, setClientName] = useState("");
  const [brandName, setBrandName] = useState("");
localStorage.setItem("hideHomeIcon", false);

  let validatebudget = !fields.budget;
  useEffect(() => {
    if (!budget) {
      setBudgetError("Budget is required");
    } else if (budget < 50000 || budget > 500000000) {
      setBudgetError("Budget must be between 50K and 500M");
    } else {
      validatebudget = false;
      setBudgetError("");
    }
    // Check if any fields are empty or invalid to disable/enable the button
    const areDayPartFieldsValid =
      validateField("grpTarget", grpTarget, false) &&
      Object.entries(dayParts).every(([key, value]) =>
        validateField(key, value, false)
      );
    const areGenreSplitFieldsValid = Object.entries(genreSplitFields).every(
      ([key, value]) => validateField(key, value, false)
    );
    setIsButtonDisabled(
      !areDayPartFieldsValid ||
        !areGenreSplitFieldsValid ||
        validatebudget ||
        !validateCopies
    );
  }, [
    grpTarget,
    dayParts,
    genreSplitFields,
    budget,
    budgets,
    durations,
    selectedCopies,
    noOfCopies,
    validateCopies,
    validatebudget,
  ]);

  const getClientDetails = async (clientId) => {
    try {
      const clientDetailsResponse = await fetch(
        `${devTunnelUrl}get_client_name/${clientId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
        }
      );
      const data = await clientDetailsResponse.json();

      setClientName(data.data.client.name);
    } catch (error) {
      toast.error("An error occurred..");
    }
  };

  const getBrandDetails = async (brandId) => {
    try {
      const brandDetailsResponse = await fetch(
        `${devTunnelUrl}get_brand_name/${brandId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
        }
      );

      const data = await brandDetailsResponse.json();

      setBrandName(data.brand.name);
    } catch (error) {
      toast.error("An error occurred.");
    }
  };
  const fetchDayPartsTypes = async () => {
    try {
      const dayPartReponse = await fetch(
        `${devTunnelUrl}get_associated_daypart_types`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
        }
      );
      const dayPartEnumData = await dayPartReponse.json();

      if (!dayPartReponse.ok)
        return toast.error(data.message || "Failed to fetch day parts.");
      setDayPartEnum(dayPartEnumData.dropdown);
      const daypartSplit = dayPartEnumData.dropdown.reduce((acc, item) => {
        acc[item.name.toLowerCase()] = fields?.day_part
          ? fields?.day_part[item.name.toLowerCase()]
          : "";
        return acc;
      }, {});
      setDayParts(daypartSplit);
    } catch (error) {
      toast.error("An error occurred while fetching day parts.");
    }
  };
  useEffect(() => {
    if (Object.keys(fields).length > 0) {
      fetchDayPartsTypes();
    }
    if (fields?.budget) setBudget(budget);
  }, [fields]);

  let isValid = true;
  const validateField = (field, value, showErrors = true) => {
    let newErrors = { ...errors };

    if (field in dayParts) {
      if (!value) {
        if (showErrors) newErrors[field] = `${field} is required`;
        isValid = false;
      } else if (isNaN(value) || value < 0) {
        if (showErrors)
          newErrors[field] = "Value must be greater than or equal to 0";
        isValid = false;
      } else {
        delete newErrors[field];
      }

      // Validate Total Percentage
      let totalPercentage = Object.entries(dayParts).reduce(
        (acc, [key, val]) => {
          return (
            acc +
            (key === field ? parseFloat(value) || 0 : parseFloat(val) || 0)
          );
        },
        0
      );

      if (totalPercentage !== 100) {
        if (showErrors)
          newErrors.totalDayPart = "Total percentage must be 100%";
        isValid = false;
      } else {
        delete newErrors.totalDayPart;
      }
    }
    if (field in genreSplitFields) {
      if (!value) {
        if (showErrors) {
          newErrors[field] = `${field} is required`;
          isValid = false;
        }
      } else if (isNaN(value) || value < 0) {
        if (showErrors)
          newErrors[field] = "Value must be greater than or equal to  0";
        isValid = false;
      } else {
        delete newErrors[field];
      }
      let totalPercentage = Object.entries(genreSplitFields).reduce(
        (acc, [key, val]) => {
          return (
            acc +
            (key === field ? parseFloat(value) || 0 : parseFloat(val) || 0)
          );
        },
        0
      );

      if (totalPercentage !== 100) {
        if (showErrors)
          newErrors.totalGenreSplit = "Total percentage must be 100%";
        isValid = false;
      } else {
        delete newErrors.totalGenreSplit;
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field, value) => {
    if (field === "grpTarget") {
      setGrpTarget(value);
    } else if (field in dayParts) {
      setDayParts((prev) => ({ ...prev, [field]: value }));
    } else if (field in genreSplitFields) {
      setGenreSplitFields((prev) => ({ ...prev, [field]: value }));
    }
    validateField(field, value);
  };

  const handleSubmit = async () => {
    if (!fields?.input_file && !fileData?.user_data_key)
      return toast.error("Rating file is required. ");
    if (isValid) {
      setIsLoading(true);

      const newfields = {
        brand_id: fields.brand_id,
        client_id: fields.client_id,
        select: fields.select,
        dates: fields.dates,
        budget: parseInt(budget) || fields?.budget,
        no_of_copies: noOfCopies,
        day_part: dayParts,
        genre: genreSplitFields,
        download: false,
      };

      // return
      const formData = new FormData();
      formData.append("user_data", JSON.stringify(newfields));

      if (fields?.input_file) formData.append("input_file", fields.input_file);

      if (fields?.rate_file) formData.append("rate_file", fields.rate_file);

      if (fileData?.user_data_key)
        formData.append("user_data_key", fileData.user_data_key);

      if (fileData?.rate_file_key)
        formData.append("rate_file_key", fileData.rate_file_key);

      try {
        // Store input_file and rate_file in local as Base64

        const response = await fetch(`${devTunnelUrl}generate-ratings-report`, {
          method: "POST",
          headers: {
            Authorization: `${authToken}`,
          },
          body: formData,
        });
        if (!response.ok)
          return toast.error("Error creating summary:", response?.message);

        const data = await response.json();

        localStorage.setItem("data", JSON.stringify(data));
        localStorage.setItem("user_data", JSON.stringify(newfields));

        navigate("/summary");
      } catch (error) {
        toast.error(response?.message);
      } finally {
        setIsLoading(false);
      }
    }
      
  };
  const toTitleCase = (str) => {
    return str
      .replace(/([A-Z])/g, " $1") // Add a space before each uppercase letter
      .replace(/^./, (char) => char.toUpperCase()) // Capitalize the first character
      .split(" ") // Split the string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(" "); // Join them back with a space
  };
  return (
    <div className='flex flex-col md:flex-row w-full h-screen bg-cover bg-center bg-no-repeat bg-[url("https://i.ibb.co/S69yyvw/thumbnail.jpg")]'>
      <SideNav setFields={setFields} />
      <ToastContainer autoClose={2000} position="top-center" />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin border-4 border-t-4 border-gray-200 border-t-blue-600 w-16 h-16 rounded-full"></div>{" "}
          {/* Tailwind spinner */}
        </div>
      )}
      <div
        className={`flex flex-col h-full md:flex-row md:pt-0 md:basis-[94%] overflow-y-auto ${
          Object.keys(fields).length > 0 && "bg-white"
        }`}
      >
        <div className="flex flex-col w-full basis-[50%] bg-white md:basis-[55%] md:py-0 md:h-100% ">
          <div className="flex justify-between basis-[20%] ">
            <div className="flex flex-col pt-[2%]  w-full justify-end px-[10%]  md:py-0 basis-[20%] ">
              <LogoImageBlack styling="w-24 h-24" color="black" />
            </div>
            {role != "user" && Object.keys(fields).length == 0 && (
              <Button
                text="Admin Panel"
                styling="w-32 h-16 mt-16 mr-4"
                onClick={() => {
                
                  navigate("/file-history");
                }}
              />
            )}
          </div>
          <div
            className={`flex py-[2%] pl-[10%]  ${
              Object.keys(fields).length === 0
                ? " content-center items-center basis-[10%] mb-4"
                : " justify-center basis-[13%] flex-col xxl:flex-row xxl:justify-start xxl:items-center"
            } md:py-0`}
          >
            <HomeParagraph
              text={
                Object.keys(fields).length === 0
                  ? "Make selections below to get optimized media plans"
                  : `Media Brief`
              }
              styling={` ${
                Object.keys(fields).length === 0 ? "pr-[7%]" : "pr-[0%]"
              }`}
            />
            {Object.keys(fields).length > 0 &&
              Object.entries(fields).map(([key, value]) => {
                if (key === "dates") {
                  return (
                    <React.Fragment key="dates">
                      <SelectedDropDown
                        key="start_Date"
                        text={`Start Date: ${value.Start_Date}`}
                        styling="s:mx-1 s:w-[25%] s:justify-between"
                      />
                      <SelectedDropDown
                        key="end_Date"
                        text={`End Date: ${value.End_Date}`}
                        styling="s:mx-1 s:w-[25%] s:justify-between"
                      />
                    </React.Fragment>
                  );
                } else if (key == "client_id") {
                  getClientDetails(value);
                  return (
                    <SelectedDropDown
                      key={key} // Ensures unique key for each item
                      text={clientName}
                      styling="s:mx-1 s:w-[25%] s:justify-between"
                    />
                  );
                } else if (key == "brand_id") {
                  getBrandDetails(value);
                  return (
                    <SelectedDropDown
                      key={key} // Ensures unique key for each item
                      text={brandName}
                      styling="s:mx-1 s:w-[25%] s:justify-between"
                    />
                  );
                } else if (key == "select") {
                  return (
                    <SelectedDropDown
                      key={key} // Ensures unique key for each item
                      text={key === "select" ? toTitleCase(value) : ""}
                      styling="s:mx-1 s:w-[25%] s:justify-between"
                    />
                  );
                }
                return null; // Ensures no warnings for unmatched cases
              })}
          </div>

          {Object.keys(fields).length > 0 ? (
            <>
              <Div2
                budget={budget}
                setBudget={setBudget}
                budgetError={budgetError}
                durations={durations}
                setNoOfCopies={setNoOfCopies}
                setDurations={setDurations}
                budgets={budgets}
                setBudgets={setBudgets}
                selectedCopies={selectedCopies}
                setSelectedCopies={setSelectedCopies}
                fields={fields}
                setValidatesCopies={setValidatesCopies}
                setFields = {setFields}
              />
              <Div3
                genreSplitFields={genreSplitFields}
                setGenreSplitFields={setGenreSplitFields}
                handleInputChange={handleInputChange}
                errors={errors}
                fields={fields}
              />
            </>
          ) : (
            <Div1 setFields={setFields} />
          )}
        </div>
        <div
          className={`w-full basis-[50%] md:basis-[45%] ${
            Object.keys(fields).length === 0
              ? ""
              : "flex flex-col pl-[10%]   py-10 md:py-0 md:px-0 "
          }`}
        >
          {/* Render this div only between 440px and 767px */}

          {/* Render this image only below 440px and above 767px */}
          {Object.keys(fields).length === 0 && (
            <img
              src="https://i.ibb.co/sFVtyf3/rightbannerhome.jpg"
              alt=""
              className="bg-cover w-full h-full"
            />
          )}
          {Object.keys(fields).length > 0 && (
            <>
              <div className="basis-[15%]"></div>
              <div className="flex flex-col basis-[65%] ">
                <div className="flex flex-col basis-[10%] gap-[1%] pr-[1%] md:pr-0 md:gap-[6%] lg:flex-row"></div>
                <div className="flex flex-col basis-[42%] justify-center">
                  <HomeParagraph text="Day Part" />
                  {dayPartEnum.map((part) => (
                    <GenreSplitField
                      key={part.id}
                      text={part.name}
                      value={
                        dayParts[part.id] || dayParts[part.name.toLowerCase()]
                      }
                      onChange={(e) =>
                        handleInputChange(
                          part.name.toLowerCase(),
                          e.target.value
                        )
                      }
                      error={errors[part.name.toLowerCase()]}
                    />
                  ))}
                  {errors.totalDayPart && (
                    <p className="text-red-500 mt-1">{errors.totalDayPart}</p>
                  )}
                </div>
                <div className="flex basis-[70px] lg:basis-[50px] 2xl:basis-[70px]"></div>
                <Button
                  text={isLoading ? "Please Wait..." : "Create TV Schedule"}
                  styling="mr-[33%] lg:mr-[25%]"
                  onClick={handleSubmit}
                  disabled={isButtonDisabled}
                />

                <div className="basis-[20%]"></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
