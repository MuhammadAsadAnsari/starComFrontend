import React from 'react'
import { FiSearch } from "react-icons/fi";

const Search = ({searchTerm,handleSearch,searchText}) => {
  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder={`Search ${searchText}...`}
        className="w-full p-3 pl-10 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <FiSearch className="absolute top-4 left-3 text-gray-500" />
    </div>
  );
}

export default Search
