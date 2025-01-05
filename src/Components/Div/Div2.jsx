import React, { useState, useEffect } from "react";
import Input from "../Input/Input";
import DropDown from "../DropDown/DropDown";
import HomeParagraph from "../Paragraphs/HomeParagraph";
import { duration } from "@mui/material";

const Div2 = ({
  budget,
  setBudget,
  setNoOfCopies,
  budgetError,
  durations,
  setDurations,
  budgets,
  setBudgets,
  selectedCopies,
  setSelectedCopies,
  fields,
  setValidatesCopies,
  setFields
  // errors
}) => {
  const copies = [
    { _id: 1, value: 1 },
    { _id: 2, value: 2 },
    { _id: 3, value: 3 },
  ];

  const [errors, setErrors] = useState({});
  const [defualtError, setDefualtError] = useState(false);
  const [isBugdetPercentageValid, setIsBudgetPercentageValid] = useState(false);
  const [isDurationValid, setIsDurationValid] = useState(false);
  
  useEffect(() => {
    if(fields?.budget) {setBudget((prev)=> prev=fields.budget)
      
    };
    if (fields.no_of_copies && Object.keys(fields.no_of_copies).length > 0) {
 
      setSelectedCopies(Object.keys(fields.no_of_copies).length);
      setDurations(
        Object.values(fields.no_of_copies).map((item) => item.Duration)
      );
      setBudgets(Object.values(fields.no_of_copies).map((item) => item.budget));
      setIsBudgetPercentageValid(true);
      setIsDurationValid(true);
    }
  }, [fields]);
  const handleBudgetChange = (e) => {
    setDefualtError(true);
    const value = e.target.value;

    setBudget(value);
    
  };
  useEffect(() => {
    if (
      durations.length === budgets.length &&
      budgets.length === selectedCopies
    ) {
      const noOfCopies = {};
      for (let i = 0; i < selectedCopies; i++) {
        noOfCopies[`copy_${i + 1}`] = {
          Duration: durations[i] || "",
          budget: budgets[i] || "",
        };
      }
      setNoOfCopies(noOfCopies);
    }

    // Check if budget and selectedCopies are not empty, then enable the button
  }, [durations, selectedCopies, budgets]);

  const handleDurationChange = (index, value) => {
    if (!value) setIsDurationValid(false);

    const newDurations = [...durations];
    newDurations[index] = value;
    setDurations(newDurations);
    validateDuration(index, value);
  };

  const handleBudgetPercentageChange = (index, value) => {
    const newBudgets = [...budgets];
    newBudgets[index] = value;
    setBudgets(newBudgets);
    validateBudgetPercentage(index, value);
  };

  const validateDuration = (index, value) => {
    let durationError = "";
    if (value <= 0) {
      durationError = "Duration must be greater than 0 seconds";
      setIsDurationValid(false);
    } else if (value > 120) {
      durationError = "Duration must not exceed 120 seconds";
      setIsDurationValid(false);
    }
    const newErrors = { ...errors, [`duration${index}`]: durationError };
    setErrors(newErrors);
    setIsDurationValid(true);
  };

  const validateBudgetPercentage = (index, value) => {
    const percentageError =
      value <= 0 ? "Budget percentage must be greater than 0" : "";
    const newErrors = { ...errors, [`budget${index}`]: percentageError };
    setErrors(newErrors);
  };

  const validateTotalBudgetPercentage = () => {
    const total = budgets.reduce((acc, curr) => acc + parseFloat(curr || 0), 0);
    if (total !== 100) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        totalBudget: "Total budget percentages must equal 100%",
      }));
      setIsBudgetPercentageValid(false);
    } else {
      setErrors((prevErrors) => {
        const { totalBudget, ...rest } = prevErrors;
        return rest;
      });
      setIsBudgetPercentageValid(true);
    }
  };

  useEffect(() => {
    validateTotalBudgetPercentage();
  }, [budgets]);

  useEffect(() => {
    setValidatesCopies(isBugdetPercentageValid && isDurationValid);
  }, [isBugdetPercentageValid, isDurationValid]);

  const handleCopiesChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setSelectedCopies(value);
    if (fields.no_of_copies) {
      const slicedCopies = Object.values(fields.no_of_copies).slice(
        0,
        e.target.value
      );

  
      setDurations(slicedCopies.map((item) => item.Duration));
      setBudgets(slicedCopies.map((item) => item.budget));
    }
    setErrors({});
  };
  return (
    <div className="flex flex-col pl-[10%] pr-[11%] basis-[22%] justify-center">
      <div className="flex flex-col pr-12 ss:pr-24 md:pr-20 xxl:pr-32">
        <div className="flex flex-col mb-[1%]">
          <label className="text-[#282828] text-s font-poppins ss:text-lg">
            Budget
          </label>
          <Input
            text="Enter amount between 50K to 500M"
            value={budget || fields.budget}
            onChange={handleBudgetChange}
            // onClick ={()=>handleOnbudgetClick()}
          />
          {defualtError && budgetError && (
            <span className="text-red-500">{budgetError}</span>
          )}
        </div>
        <DropDown
          labeltext="No Of Copies"
          placeholdertext="Select number of copies"
          data={copies}
          onChange={handleCopiesChange}
          value={selectedCopies}
        />
        {selectedCopies > 0 && (
          <div className="my-4">
            <div className="flex justify-around">
              <p className=""></p>
              <div className="basis-[30%] py-[1%] ">
                <HomeParagraph text="Duration" />
              </div>
              <div className="basis-[20%] md:basis-[20%] py-[1%] ">
                <HomeParagraph text="Budget%" />
              </div>
            </div>
            {Array.from({ length: selectedCopies }).map((_, index) => {
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-[#282828] font-poppins text-m lg:text-ll">
                    Copy {index + 1}
                  </div>
                  <div className="flex flex-col mb-[1%] w-2/5">
                    <Input
                      text="Duration in Sec"
                      value={durations[index]}
                      onChange={(e) =>
                        handleDurationChange(index, e.target.value)
                      }
                      error={errors[`duration${index}`]}
                    />
                    {errors[`duration${index}`] && (
                      <span className="text-red-500">
                        {errors[`duration${index}`]}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col mb-[1%] w-2/5">
                    <Input
                      text="%"
                      value={budgets[index]}
                      onChange={(e) =>
                        handleBudgetPercentageChange(index, e.target.value)
                      }
                      error={errors[`budget${index}`]}
                    />
                    {errors[`budget${index}`] && (
                      <span className="text-red-500">
                        {errors[`budget${index}`]}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {errors.totalBudget && (
              <span className="text-red-500">{errors.totalBudget}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Div2;
