import React from "react";

const TableHeading = ({ heading }) => {
  return (
    <th className="py-3 px-4 text-sm font-medium text-gray-700">
      <div className="flex items-center gap-2">
        <span>{heading}</span>
        <div className="flex flex-col items-center gap-0.5">
          <img
            src="https://i.ibb.co/vdDf4Zm/VectorUp.png"
            alt="Sort Up"
            className="w-2 h-2"
          />
          <img
            src="https://i.ibb.co/YjTRzts/Vector-Down.png"
            alt="Sort Down"
            className="w-2 h-2"
          />
        </div>
      </div>
    </th>
  );
};

export default TableHeading;
