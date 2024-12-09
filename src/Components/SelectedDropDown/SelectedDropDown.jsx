import React from 'react'
import CloseIcon from "@mui/icons-material/Close";

const SelectedDropDown = ({text,styling}) => {
  return (
    <div
      className={`flex  xxl:justify-between  xxl:items-center bg-[#DEDEDE] rounded-md ${
        styling && styling
      }  s:w-auto s:justify-start`}
    >
      <span className="font-poppins  text-s  text-[#53615A] py-1 px-1   3xl:text-xl 4xl:text-2xl">
        {text}
      </span>
      <CloseIcon className="text-[#53615A] " />
    </div>
  );
}

export default SelectedDropDown
