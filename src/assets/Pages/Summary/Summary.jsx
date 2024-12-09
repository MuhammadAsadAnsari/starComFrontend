import React, { useState } from "react";
import LogoImageBlack from "../../../Components/Images/LogoImageBlack";
import Button from "../../../Components/buttons/Button";

const Summary = () => {
  const sampleData = JSON.parse(sessionStorage.getItem("data"));
  const devTunnelUrl = import.meta.env.VITE_DEV_TUNNEL_URL;
  const encryptedToken = localStorage.getItem("authCookie");
  const authToken = atob(encryptedToken);

  const user_data = JSON.parse(sessionStorage.getItem("user_data"));
  console.log("🚀 ~ Summary ~ user_data:", user_data);
  const rateType = user_data.select;

  const retrieveFileFromSession = (key) => {
    const base64File = sessionStorage.getItem(key);
    if (!base64File) return null;

    const byteString = atob(base64File.split(",")[1]);
    const mimeString = base64File.split(",")[0].split(":")[1].split(";")[0];
    const arrayBuffer = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      arrayBuffer[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  };

  // Example usage

  const handleDownload = async () => {
    const inputFileBlob = retrieveFileFromSession("input_file");
    const rateFileBlob = retrieveFileFromSession("rateFileBlob");

    if (!inputFileBlob) return toast.error(`Something went wrong downloading`);
    const formData = new FormData();
    formData.append("input_file", inputFileBlob, "input_file.xlsx");
    if (rateFileBlob)
      formData.append("rate_file", rateFileBlob, "rate_file.xlsx");
    formData.append("user_data", JSON.stringify(user_data));

    fetch(`${devTunnelUrl}/download_client_rates?download=true`, {
      method: "POST",
      headers: {
        Authorization: `${authToken}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          // console.log("response.arrayBuffer()", response.arrayBuffer());
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.arrayBuffer();
      })
      .then((buffer) => {
        console.log("Buffer data:", buffer);

        // Convert buffer to a Blob or save it as a file
        const blob = new Blob([buffer]);
        const url = URL.createObjectURL(blob);

        // Create a download link (for example)
        const a = document.createElement("a");
        a.href = url;
        a.download = "summary.xlsx"; // Change file extension accordingly
        a.click();

        // Revoke object URL to free memory
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error fetching the buffer:", error);
      });
  };
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <LogoImageBlack styling="w-24 h-24" color="black" />
        </div>
        {/* <button className="bg-gradient-to-r from-[#E73C30] to-[#F58220] text-white px-4 py-2 rounded-md">
          Download TV Schedule
        </button> */}
        <Button
          text="Download Tv Schedule"
          styling="px-2"
          onClick={handleDownload}
        />
      </div>

      {/* Schedule Created Text */}
      <div className="flex justify-between items-center bg-yellow-100 p-2 rounded-lg">
        <p>
          Schedule created on: <span className="font-bold">{rateType}</span>
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Section (Channel Table) */}
        <div className="space-y-6">
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">Channel</th>
                  <th className="px-4 py-2 text-left">Cost</th>
                  <th className="px-4 py-2 text-left">SOS</th>
                  <th className="px-4 py-2 text-left">GRPs</th>
                  <th className="px-4 py-2 text-left">SOV</th>
                </tr>
              </thead>
              <tbody>
                {sampleData?.channel_summary?.lenght > 0 &&
                  sampleData?.channel_summary?.map?.((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.cost}</td>
                      <td className="px-4 py-2">{item.sos}</td>
                      <td className="px-4 py-2">{item.grps}</td>
                      <td className="px-4 py-2">{item.sov}</td>
                    </tr>
                  ))}
                <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-bold">Grand Total</td>
                  <td className="px-4 py-2 font-bold">
                    {sampleData?.grand_total?.cost}
                  </td>
                  <td className="px-4 py-2 font-bold">
                    {sampleData?.grand_total?.sos}
                  </td>
                  <td className="px-4 py-2 font-bold">
                    {sampleData?.grand_total?.grps}
                  </td>
                  <td className="px-4 py-2 font-bold">
                    {sampleData.grand_total?.sov}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Section (Day Part and Genre Tables) */}
        <div className="space-y-6">
          {/* Day Part Table */}
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">Day Part</th>
                  <th className="px-4 py-2 text-left">Cost</th>
                  <th className="px-4 py-2 text-left">SOS</th>
                  <th className="px-4 py-2 text-left">GRPs</th>
                  <th className="px-4 py-2 text-left">SOV</th>
                </tr>
              </thead>
              <tbody>
                {sampleData?.day_part_summary?.length > 0 &&
                  sampleData?.day_part_summary?.map?.((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.cost}</td>
                      <td className="px-4 py-2">{item.sos}</td>
                      <td className="px-4 py-2">{item.grps}</td>
                      <td className="px-4 py-2">{item.sov}</td>
                    </tr>
                  ))}
                <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-bold">Grand Total</td>
                  <td className="px-4 py-2 font-bold">
                    {sampleData?.grand_total_day_part?.cost}
                  </td>
                  <td className="px-4 py-2 font-bold">
                    {sampleData.grand_total_day_part.sos}
                  </td>
                  <td className="px-4 py-2 font-bold">
                    {sampleData.grand_total_day_part.grps}
                  </td>
                  <td className="px-4 py-2 font-bold">
                    {sampleData.grand_total_day_part.sov}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Genre Table */}
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">Genre</th>
                  <th className="px-4 py-2 text-left">Cost</th>
                  <th className="px-4 py-2 text-left">SOS</th>
                  <th className="px-4 py-2 text-left">GRPs</th>
                  <th className="px-4 py-2 text-left">SOV</th>
                </tr>
              </thead>
              <tbody>
                {sampleData?.genre_summary.length > 0 &&
                  sampleData?.genre_summary?.map?.((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.cost}</td>
                      <td className="px-4 py-2">{item.sos}</td>
                      <td className="px-4 py-2">{item.grps}</td>
                      <td className="px-4 py-2">{item.sov}</td>
                    </tr>
                  ))}
                <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-bold">Grand Total</td>
                  <td className="px-4 py-2 font-bold">
                    {sampleData.grand_total_genre.cost}
                  </td>
                  <td className="px-4 py-2 font-bold">
                    {sampleData.grand_total_genre.sos}
                  </td>
                  <td className="px-4 py-2 font-bold">
                    {sampleData.grand_total_genre.grps}
                  </td>
                  <td className="px-4 py-2 font-bold">
                    {sampleData.grand_total_genre.sov}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
