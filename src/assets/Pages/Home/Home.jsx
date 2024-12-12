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
  const [displayError, setDisplayError] = useState(false);

  const [fields, setFields] = useState({});
  const [user_data, setUserData] = useState({});

  const [data, setdate] = useState(["", ""]);
  const [noOfCopies, setNoOfCopies] = useState({});
  const [dayPartEnum, setDayPartEnum] = useState([]);

  const [grpTarget, setGrpTarget] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedCopies, setSelectedCopies] = useState();

  const [dayParts, setDayParts] = useState({});
  const [genreSplitFields, setGenreSplitFields] = useState({});
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [durations, setDurations] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const role = localStorage.getItem("userRole");


  useEffect(() => {
    let validatebudget = true;
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
      !areDayPartFieldsValid || !areGenreSplitFieldsValid || validatebudget
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
  ]);
  const fetchDayPartsTypes = async () => {
    try {
      const dayPartReponse = await fetch(`${devTunnelUrl}get_daypart_types`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authToken}`,
        },
      });
      const dayPartEnumData = await dayPartReponse.json();
      console.log(
        "🚀 ~ fetchDayPartsTypes ~ dayPartEnumData:",
        dayPartEnumData
      );

      if (!dayPartReponse.ok)
        return toast.error(data.message || "Failed to fetch day parts.");
      setDayPartEnum(dayPartEnumData.dropdown);
      const daypartSplit = dayPartEnumData.dropdown.reduce((acc, item) => {
        acc[item.name.toLowerCase()] = "";
        return acc;
      }, {});
      setDayParts(daypartSplit);
    } catch (error) {
      toast.error("An error occurred while fetching day parts.");
    }
  };
  useEffect(() => {
    if (Object.keys(fields).length > 0){console.log("fields",fields)
       fetchDayPartsTypes()};
  }, [fields]);

  let isValid = true;
  const validateField = (field, value, showErrors = true) => {
    let newErrors = { ...errors };

    // Validate GRP Target
    if (field === "grpTarget") {
      if (!value) {
        if (showErrors) newErrors.grpTarget = "GRP Target is required";
        isValid = false;
      } else if (isNaN(value) || value < 0) {
        if (showErrors)
          newErrors.grpTarget = "GRP Target must be greater than or equal to 0";
        isValid = false;
      } else {
        delete newErrors.grpTarget;
      }
    }

    // Validate Day Parts
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
  if (isValid) {
    setIsLoading(true);

    const newfields = {
      brand_id: fields.brand_id,
      client_id: fields.client_id,
      select: fields.select,
      dates: fields.dates,
      budget: parseInt(budget),
      no_of_copies: noOfCopies,
      day_part: dayParts,
      genre: genreSplitFields,
      download: false,
    };

    const formData = new FormData();
    console.log("fields.input_file", fields.input_file);
    formData.append("user_data", JSON.stringify(newfields));
    formData.append("input_file", fields.input_file);

    if (fields.rate_file) formData.append("rate_file", fields.rate_file);

    

    try {
      // Store input_file and rate_file in sessionStorage as Base64
    
    console.log("🚀 ~ handleSubmit ~ formData:", formData);

      const response = await fetch(`${devTunnelUrl}generate-ratings-report`, {
        method: "POST",
        headers: {
          Authorization: `${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("🚀 ~ handleSubmit ~ data:", data)
        sessionStorage.setItem("data", JSON.stringify(data));
        sessionStorage.setItem("user_data", JSON.stringify(newfields));

        navigate('/summary');
      } else {
        console.error("Error creating summary:", response.message);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setDisplayError(true);
    } finally {
      setIsLoading(false);
    }
  }


};


  return (
    <div className='flex flex-col md:flex-row w-full h-screen bg-cover bg-center bg-no-repeat bg-[url("https://i.ibb.co/S69yyvw/thumbnail.jpg")]'>
      <SideNav />
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
                onClick={() => navigate("/file-history")}
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
                    <>
                      <SelectedDropDown
                        key="start_Date"
                        text={`Start Date: ${value.Start_Date}`}
                        styling="s:mx-1 s:w-[25%] s:justify-between"
                      />
                      <SelectedDropDown
                        key="End_Date"
                        text={`End Date: ${value.End_Date}`}
                        styling="s:mx-1 s:w-[25%] s:justify-between"
                      />
                    </>
                  );
                } else if (
                  key == "client_id" ||
                  key == "brand_id" ||
                  key == "select"
                ) {
                  return (
                    <SelectedDropDown
                      key={key}
                      text={value}
                      styling="s:mx-1 s:w-[25%] s:justify-between"
                    />
                  );
                }
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
            <Div1 setFields={setFields} setdate={setdate} />
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
              <div className="basis-[35%]"></div>
              <div className="flex flex-col basis-[65%] ">
                <div className="flex flex-col basis-[10%] gap-[1%] pr-[1%] md:pr-0 md:gap-[6%] lg:flex-row"></div>
                <div className="flex flex-col basis-[42%] justify-center">
                  <div className="flex flex-col mb-[1%] w-2/3 lg:w-full lg:pr-[26%] xxl:pr-[28%] 2xl:pr-[27%] 3xl:pr-[25%]">
                    <label className="text-[#282828] text-s font-poppins ss:text-lg">
                      GRP Target
                    </label>
                    <Input
                      text="Enter GRP Target"
                      value={grpTarget}
                      onChange={(e) =>
                        handleInputChange("grpTarget", e.target.value)
                      }
                    />
                    {errors.grpTarget && (
                      <p className="text-red-500 mt-1">{errors.grpTarget}</p>
                    )}
                  </div>
                  <HomeParagraph text="Day Part" />
                  {dayPartEnum.map((part) => (
                    <GenreSplitField
                      key={part.id}
                      text={part.name}
                      value={dayParts[part.id]}
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
                {displayError && (
                  <div className="text-red-500 mt-4">
                    An error occurred while uploading files.
                  </div>
                )}
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
