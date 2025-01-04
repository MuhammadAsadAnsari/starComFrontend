import React, { useState } from 'react'
import CheckIcon from "@mui/icons-material/Check";
const AdminInput = ({text,value ,setValue,handleValue,type}) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div
      className={`w-1/5 flex items-center justify-between  p-3 rounded-lg border border-gray-300 shadow-sm ${
        isFocused ? "ring-2 ring-orange-500" : ""
      }`}
    >
      <div>
        <label className="font-bold">{text}</label>
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onFocus={() => setIsFocused(true)} // Set focus state when input is focused
          onBlur={() => setIsFocused(false)} // Remove focus state when input loses focus
          className="focus:outline-none w-8" // Prevent default focus styles
        />
      </div>
      <CheckIcon
        className="text-gray-500 cursor-pointer"
        onClick={() => handleValue(type)}
      />
    </div>
  );
}

export default AdminInput
