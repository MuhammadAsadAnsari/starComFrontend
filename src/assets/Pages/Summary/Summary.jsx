import React, { useState } from "react";
import LogoImageBlack from "../../../Components/Images/LogoImageBlack";
import Button from "../../../Components/buttons/Button";
import SideNav from "../../../Components/SideNav/SideNav";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Summary = () => {
  const navigate = useNavigate();
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sampleData = JSON.parse(localStorage.getItem("data"));
  const devTunnelUrl = import.meta.env.VITE_DEV_TUNNEL_URL;
  const encryptedToken = localStorage.getItem("authCookie");
  const authToken = atob(encryptedToken);
  const data = JSON.parse(localStorage.getItem("data"));

  let user_data = JSON.parse(localStorage.getItem("user_data"));
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

  const formData = new FormData();

  formData.append("user_data", JSON.stringify(user_data));
  formData.append("user_data_key", data.user_data_key);
  if (data.rate_file_key) formData.append("rate_file_key", data.rate_file_key);

  const handleDownload = async () => {
    setIsLoading(true);
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

        const blob = new Blob([buffer]);
        const url = URL.createObjectURL(blob);

        // Create a download link (for example)
        const a = document.createElement("a");
        a.href = url;
        a.download = "summary.xlsx";
        a.click();

        URL.revokeObjectURL(url);
        setIsDownloaded(true);
      })
      .catch((error) => {
        toast.error("Error downloading file.");
        setIsLoading(false);
      });
  };
  const handleChanges = async () => {
   
    navigate("/")
  };
  return (
    <div className='flex flex-col md:flex-row w-full h-screen bg-cover bg-center bg-no-repeat bg-[url("https://i.ibb.co/S69yyvw/thumbnail.jpg")]'>
      <SideNav />
      <ToastContainer autoClose={2000} position="top-center" />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin border-4 border-t-4 border-gray-200 border-t-blue-600 w-16 h-16 rounded-full"></div>{" "}
          {/* Tailwind spinner */}
        </div>
      )}
      <div className="p-6 space-y-3 bg-white basis-[94%] ">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <LogoImageBlack styling="w-24 h-24" color="black" />
          </div>

          {!isDownloaded && (
            <Button
              text={isLoading ? "Please Wait..." : "Download Tv Schedule"}
              styling="px-2"
              onClick={handleDownload}
            />
          )}
        </div>

        {/* Schedule Created Text */}
        <div className="flex justify-between items-center bg-yellow-100 p-2 rounded-lg">
          <p>
            Schedule created on:{" "}
            <span className="font-bold">
              {rateType.split("R")[0]} R{rateType.split("R")[1]}
            </span>
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Section (Channel Table) */}
          <div className="space-y-6">
            <div
              className="overflow-auto"
              style={{ maxHeight: "calc(100vh - 280px)" }}
            >
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
            <Button text="Back" styling="px-6" onClick={handleChanges} />
          </div>
          {/* Right Section (Day Part and Genre Tables) */}
          <div className="space-y-6">
            {/* Day Part Table */}
            <div
              className="overflow-auto"
              style={{ maxHeight: "calc(100vh - 400px)" }}
            >
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
            <div
              className="overflow-auto"
              style={{ maxHeight: "calc(100vh - 400px)" }}
            >
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
    </div>
  );
};

export default Summary;
