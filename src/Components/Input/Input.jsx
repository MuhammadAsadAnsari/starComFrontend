import React from "react";

const Input = ({ text, value, onChange, styling }) => {
  return (
    <div
      className={`flex ${
        styling && styling
      } flex-col border-[1px] py-1 pl-2 lg:py-2 border-[#DEDEDE] rounded-lg 2xl:py-3`}
    >
      <input
        type="number"
        placeholder={text}
        value={value}
        onChange={onChange}
        className="placeholder:text-s md:placeholder:text-base lg:placeholder:text-lg md:text-xs lg:text-base"
      />
    </div>
  );
};

export default Input;
