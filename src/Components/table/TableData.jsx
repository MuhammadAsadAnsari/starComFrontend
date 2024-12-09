import React from "react";

const TableData = ({ data, styling }) => {
  return (
    <td className={`px-4 py-2 text-sm text-gray-600 truncate ${styling || ""}`}>
      {data}
    </td>
  );
};

export default TableData;
