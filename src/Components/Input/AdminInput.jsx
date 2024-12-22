import React, { useState } from 'react'
import CheckIcon from "@mui/icons-material/Check";
const AdminInput = ({text,value ,setValue,handleValue,type}) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div
      className={`relative w-1/4 p-3 rounded-lg border border-gray-300 shadow-sm ${
        isFocused ? "ring-2 ring-orange-500" : ""
      }`}
    >
      <label className="font-bold">{text}</label>
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onFocus={() => setIsFocused(true)} // Set focus state when input is focused
        onBlur={() => setIsFocused(false)} // Remove focus state when input loses focus
        className="focus:outline-none" // Prevent default focus styles
      />
      <CheckIcon
        className="absolute top-3 right-2 text-gray-500 cursor-pointer"
        onClick={() => handleValue(type)}
      />
    </div>
  );
}

export default AdminInput
