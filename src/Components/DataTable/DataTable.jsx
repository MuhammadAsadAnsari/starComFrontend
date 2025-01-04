// DataTable.js
import React from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
const DataTable = ({
  headers,
  data,
  brandInputs,
  setBrandInputs,
  handleAddBrand,
  styling,
  openModal,
  openAlert,
  linkedClientWithUser,
  clientsUserData,
  dropdownVisible,
  setDropdownVisible,

  selectedClients,
  setSelectedClients,
  toggleTagsVisibility,
  isTagsVisible,
  handleClientDelete,
}) => {
  return (
    <div className="border border-gray-300 rounded-lg shadow-md">
      <div
        className="overflow-auto"
        style={{ maxHeight: "calc(100vh - 280px)" }}
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
                  // style={{ width: "25%" }} // Adjust width here
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
                    className={`border border-gray-300 bg-white hover:bg-gray-100 ${
                      dropdownVisible === item.id && "h-96"
                    } `}
                    onClick={() =>
                      openModal && item.dayPartType && openModal("edit", item)
                    }
                  >
                    <td
                      className={`${styling && "p-3"} py-3 text-center`}
                      style={{
                        width: `${
                          brandInputs && setBrandInputs ? "35%" : "30%"
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
                          brandInputs && setBrandInputs ? "35%" : "30%"
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
                    {item?.role && (
                      <td
                        className="py-3 text-center relative"
                        style={{ width: "20%", cursor: "pointer" }}
                        onClick={(e) => e.stopPropagation()} // Prevent triggering row click
                      >
                        <div className="flex flex-wrap gap-2 items-center relative">
                          {/* Client Tags */}
                          {isTagsVisible(item.id) &&
                            item.clients.map((client) => (
                              <span
                                key={client.id}
                                className="flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                              >
                                {client.name}
                                <button
                                  onClick={() =>
                                    handleClientDelete(item.id, client.id)
                                  }
                                  className="ml-2 text-red-500 hover:text-red-700"
                                >
                                  ×
                                </button>
                              </span>
                            ))}

                          {/* Input and Icon */}
                          <div className="relative w-full">
                            <div className="flex items-center">
                              <input
                                type="text"
                                placeholder="Search Client"
                                className={`border px-2 py-1 rounded-full text-sm bg-white flex-1 focus:ring-2 focus:ring-orange-700 outline-none transition-all duration-300`}
                                value={selectedClients?.[item?.id] || ""}
                                onChange={(e) => {
                                  const inputValue = e.target.value;

                                  if (item?.id) {
                                    setSelectedClients({
                                      ...selectedClients,
                                      [item.id]: inputValue,
                                    });

                                    // Show dropdown if the input value changes
                                    setDropdownVisible(item?.id);
                                  }
                                }}
                                onFocus={() => {
                                  // Show dropdown for this input
                                  setDropdownVisible(item?.id);
                                }}
                                onBlur={(e) => {
                                  // Check if focus moves outside both input and dropdown
                                  const isDropdownActive =
                                    dropdownVisible === item.id;
                                  const isFocusOutside = !(
                                    e.relatedTarget &&
                                    (e.relatedTarget.classList.contains(
                                      "dropdown-item"
                                    ) ||
                                      e.relatedTarget === e.target)
                                  );

                                  if (isFocusOutside && isDropdownActive) {
                                    setDropdownVisible(null); // Hide dropdown
                                    setSelectedClients({
                                      ...selectedClients,
                                      [item.id]: "", // Clear input value
                                    });
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()} // Prevent table row click
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    const inputValue =
                                      selectedClients?.[
                                        item?.id
                                      ]?.toLowerCase();

                                    // Find the client ID by matching the input value
                                    const selectedClient = clientsUserData.find(
                                      (client) =>
                                        client.client.name.toLowerCase() ===
                                        inputValue
                                    );

                                    if (selectedClient) {
                                      
                                      linkedClientWithUser(
                                        selectedClient.client.id,
                                        item.id
                                      );
                                    } else {
                                      return toast.error(
                                        "Please select an appropriate client."
                                      );
                                    }
                                  }
                                }}
                              />
                              <button
                                className={`absolute right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 top-1/2 `}
                                onClick={(e) => {
                                  toggleTagsVisibility(item.id); // Toggle tags visibility
                                }}
                              >
                                {isTagsVisible(item.id) ? (
                                  <FontAwesomeIcon icon={faEye} />
                                ) : (
                                  <FontAwesomeIcon icon={faEyeSlash} />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Dropdown for Client Names */}
                          {dropdownVisible === item?.id && (
                            <div
                              className="absolute top-full mt-1 max-h-40 w-56 overflow-y-auto bg-white border rounded-md shadow-lg z-10 flex flex-col"
                              onMouseDown={(e) => e.preventDefault()} // Prevent onBlur when clicking dropdown items
                            >
                              {/* Cancel Button */}
                              <div
                                className="text-right pr-2 pt-1 cursor-pointer text-gray-500 hover:text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();

                                  // Clear input if no match
                                  const inputValue =
                                    selectedClients?.[item?.id]?.toLowerCase();
                                  const matchesDropdown = clientsUserData.some(
                                    (client) =>
                                      client.client.name.toLowerCase() ===
                                      inputValue
                                  );

                                  if (!matchesDropdown) {
                                    setSelectedClients({
                                      ...selectedClients,
                                      [item.id]: "", // Clear invalid value
                                    });
                                  }

                                  setDropdownVisible(null); // Hide dropdown
                                }}
                              >
                                ✕
                              </div>

                              {clientsUserData
                                .filter(
                                  (client) =>
                                    !item.clients.some(
                                      (userClient) =>
                                        userClient.id === client.client.id
                                    ) &&
                                    client.client.name
                                      .toLowerCase()
                                      .includes(
                                        selectedClients?.[
                                          item?.id
                                        ]?.toLowerCase() || ""
                                      )
                                )
                                .slice(0, 5)
                                .map((client) => (
                                  <div
                                    key={client.client.id}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={(e) => {
                                      e.stopPropagation();

                                      // Set selected client name and hide dropdown
                                      setSelectedClients({
                                        ...selectedClients,
                                        [item.id]: client.client.name,
                                      });

                                      setDropdownVisible(null); // Hide dropdown
                                    }}
                                  >
                                    {client.client.name}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
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
