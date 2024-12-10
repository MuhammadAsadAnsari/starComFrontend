import React from "react";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-4 space-x-2">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        className="bg-gradient-to-r from-[#E73C30] to-[#F58220] transition duration-500 ease-in-out text-white py-1 px-3 rounded-full text-sm font-semibold hover:bg-gradient-to-r hover:from-[#ffffff] hover:to-[#ffffff] hover:text-[#E73C30] hover:border-[#E73C30] border-2"
      >
        Previous
      </button>

      {pages.map((page) => {
        
        return(
        <button
          key={page}
          onClick={() => {
            setCurrentPage(page)}}
          className={`font-semibold px-4 py-2 rounded-full transition duration-300 ${
            currentPage === page
              ? "bg-gradient-to-r from-[#E73C30] to-[#F58220] text-white border"
              : "bg-white text-[#E73C30] border border-[#E73C30] hover:bg-gray-200 hover:bg-gradient-to-r hover:from-[#E73C30] hover:to-[#F58220] hover:border-0"
          }`}
        >
          {page}
        </button>
      )})}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        className="bg-gradient-to-r from-[#E73C30] to-[#F58220] transition duration-500 ease-in-out text-white py-1 px-3 rounded-full text-sm font-semibold hover:bg-gradient-to-r hover:from-[#ffffff] hover:to-[#ffffff] hover:text-[#E73C30] hover:border-[#E73C30] border-2"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
