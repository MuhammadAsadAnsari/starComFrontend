import React from "react";

const AddButton = ({ openModal, handleSubmit, text,update}) => {
  return (
    <div>
      <button
        onClick={() =>
          (openModal && openModal("add")) || (handleSubmit && handleSubmit(!update ? "delete": "edit" ))
        }
        className="w-full p-3 bg-gradient-to-r from-[#E73C30] hover:to-[#ffffff] hover:bg-gradient-to-r hover:from-[#ffffff] to-[#F58220] hover:text-[#E73C30] border-2  hover:border-[#E73C30] text-white rounded-lg shadow-sm font-semibold transition duration-500 ease-in-out"
      >
        {text}
      </button>
    </div>
  );
};

export default AddButton;
