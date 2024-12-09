import React from "react";

const Button = ({ text, styling, disabled, onClick }) => {
  return (
    <button
      className={`font-poppins bg-gradient-to-r from-[#E73C30] to-[#F58220] text-white font-normal py-4 rounded-lg shadow-md text-sm ${
        styling && styling
      } lg:text-base ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
