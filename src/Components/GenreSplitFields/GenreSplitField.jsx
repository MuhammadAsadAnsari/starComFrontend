import React from "react";
import Input from "../Input/Input";

const GenreSplitField = ({ text, value, onChange, error }) => {
  return (
    <div className="flex flex-col lg:py-[0.5%] lg:flex-row lg:items-start lg:justify-between lg:pr-[26%] xxl:pr-[28%] 2xl:pr-[27%] 3xl:pr-[25%]">
      <p className="text-[#282828] text-s lg:py-[2%] font-poppins ss:text-lg">
        {text}
      </p>
      <div className="w-2/3 lg:w-3/5 xxl:w-2/3">
        <Input text="Enter percentage" value={value} onChange={onChange} />
        {error && <p className="text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default GenreSplitField;
