import React, { useState } from "react";
import LogoImageBlack from "../../../Components/Images/LogoImageBlack";
import Button from "../../../Components/buttons/Button";

const Summary = () => {
    const [isDownloaded,setIsDownloaded] = useState(false)
  const sampleData = JSON.parse(sessionStorage.getItem("data"));
  const devTunnelUrl = import.meta.env.VITE_DEV_TUNNEL_URL;
  const encryptedToken = localStorage.getItem("authCookie");
  const authToken = atob(encryptedToken);
  const data = JSON.parse(sessionStorage.getItem("data"));
  
  let user_data = JSON.parse(sessionStorage.getItem("user_data"));
  const rateType = user_data.select;

  user_data = {
    brand_id: user_data.brand_id,
    budget: user_data.budget,
    client_id: user_data.client_id,
    dates: user_data.dates,
    day_part: user_data.day_part,
    genre: user_data.genre,
    no_of_copies: user_data.no_of_copies,
    select: user_data.select,
    download: true,
  };
  console.log("🚀 ~ Summary ~ user_data:", user_data);

  const formData = new FormData();

  formData.append("user_data", JSON.stringify(user_data));
  formData.append("user_data_key", data.user_data_key);
if (data.rate_file_key) formData.append("rate_file_key", data.rate_file_key);

  const handleDownload = async () => {
    fetch(`${devTunnelUrl}generate-ratings-report`, {
      method: "POST",
      headers: {
        Authorization: `${authToken}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
     
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.arrayBuffer();
      })
      .then((buffer) => {
        console.log("Buffer data:", buffer);


        const blob = new Blob([buffer]);
        console.log("🚀 ~ .then ~ blob:", blob)
        const url = URL.createObjectURL(blob);
        console.log("🚀 ~ .then ~ url:", url)

        // Create a download link (for example)
        const a = document.createElement("a");
        a.href = url;
        a.download = "summary.xlsx"; 
        a.click();

        URL.revokeObjectURL(url);
        setIsDownloaded(true);
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
     {!isDownloaded &&(   <Button
          text="Download Tv Schedule"
          styling="px-2"
          onClick={handleDownload}
        />)}
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
                {sampleData?.channel_summary?.length > 0 &&
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
