// DataTable.js
import React from "react";

const DataTable = ({
  headers,
  data,
  onRowClick,
  brandInputs,
  setBrandInputs,
  handleAddBrand,
  styling,
  openModal,
  openAlert,
}) => {
  return (
    <div className="border border-gray-300 rounded-lg shadow-md">
      <div
        className="overflow-auto"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        <table
          className="min-w-full border border-gray-300 bg-white text-gray-800 rounded-lg shadow-md overflow-hidden"
          style={{ tableLayout: "fixed" }}
        >
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`py-3 px-4 ${styling && styling}`}
                  style={{ width: "25%" }} // Adjust width here
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => {
                return (
                  <tr
                    key={index + 1}
                    className="border border-gray-300 bg-white hover:bg-gray-100"
                    onClick={() => onRowClick && onRowClick(item)}
                  >
                    <td
                      className={`${styling && "p-3"} py-3 text-center`}
                      style={{
                        width: `${
                          brandInputs && setBrandInputs ? "40%" : "30%"
                        }`,
                      }}
                    >
                      {item?.client?.name ||
                        item?.name ||
                        item?.timing ||
                        item.channel}
                    </td>
                    <td
                      className={`${styling && "p-3"} py-3 text-center`}
                      style={{
                        width: `${
                          brandInputs && setBrandInputs ? "40%" : "30%"
                        }`,
                      }}
                    >
                      {brandInputs && setBrandInputs && (
                        <>
                          {item.client.brands?.length > 0 && (
                            <div
                              className="max-h-20 overflow-y-auto border border-gray-300 p-2 rounded"
                              style={{
                                scrollbarColor: "#E73C30 #F58220",
                                scrollbarWidth: "thin",
                              }}
                            >
                              {item.client.brands.map((brand, brandIndex) => (
                                <div
                                  key={brandIndex}
                                  className="py-1 px-2 text-gray-700"
                                >
                                  {brand.name}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="mt-2 flex">
                            <input
                              type="text"
                              value={brandInputs[index]}
                              onChange={(e) => {
                                const newBrandInputs = [...brandInputs];
                                newBrandInputs[index] = e.target.value;
                                setBrandInputs(newBrandInputs);
                              }}
                              placeholder="Add Brand"
                              className="border border-gray-300 p-2 rounded-l-lg w-full"
                            />
                            <button
                              onClick={() => handleAddBrand(index)}
                              className="bg-gradient-to-r from-[#E73C30] to-[#F58220] text-white font-semibold p-2 rounded-r-lg w-1/3 hover:bg-white hover:text-[#E73C30] hover:border-2 hover:border-[#E73C30] transition duration-300"
                            >
                              Add Brand
                            </button>
                          </div>
                        </>
                      )}
                      {item?.email && item?.email}
                      {item?.dayPartType && item?.dayPartType}
                      {item?.genre && item?.genre}
                    </td>
                    {/* Role */}
                    {item?.role && (
                      <td className="py-3 text-center" style={{ width: "5%" }}>
                        {item?.role === "super_user" ? "sub Admin" : "user"}
                      </td>
                    )}
                    {/* Actions */}
                    {openModal && !item?.dayPartType && (
                      <td
                        className="py-2 px-4 border-b text-center"
                        style={{ width: "25%" }}
                      >
                        <button
                          onClick={() => openModal("edit", item)}
                          className="bg-gradient-to-r from-[#E73C30] to-[#F58220] transition duration-500 ease-in-out text-white py-1 px-3 rounded-full text-sm font-semibold hover:bg-gradient-to-r hover:from-[#ffffff] hover:to-[#ffffff] hover:text-[#E73C30] hover:border-[#E73C30] border-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            openAlert(
                              "edit",
                              item?.id || item?.client?.id,
                              item?.active || item?.client?.active
                            )
                          }
                          className="bg-gradient-to-r from-[#E73C30] to-[#F58220] transition duration-500 ease-in-out text-white py-1 px-3 rounded-full text-sm font-semibold hover:bg-gradient-to-r hover:from-[#ffffff] hover:to-[#ffffff] hover:text-[#E73C30] hover:border-[#E73C30] border-2"
                        >
                          {item.active || item?.client?.active
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="py-2 px-4 text-center text-gray-500">
                  No Data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
