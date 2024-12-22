import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import AddButton from "../../../../Components/buttons/AddButton";
import Search from "../../../../Components/Search/Search";
import Pagination from "../../../../Components/Pagination/Pagination";
import ToastNotification from "../../../../Components/Toasts/ToastNotification";
import AdminSideNav from "../../../../Components/SideNav/AdminSideNav";
import DataTable from "../../../../Components/DataTable/DataTable";
import { FaTimes } from "react-icons/fa";
import EnumDropDown from "../../../../Components/DropDown/EnumDropDown";

const GenreManagement = () => {
  const devTunnelUrl = import.meta.env.VITE_DEV_TUNNEL_URL;
  const encryptedToken = localStorage.getItem("authCookie");
  const authToken = atob(encryptedToken);

  const [genres, setGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [newChannel, setNewChannel] = useState("");
  const [active, setActive] = useState(false);
  const [channelId, setChannelId] = useState();
  const [newGenre, setNewGenre] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 20; // Number of records per page
  const [genreEnum, setGenreEnum] = useState([]);
  const [openDeleteModel, setOpenDeleteModel] = useState(false);

  // Fetch genres from the backend with pagination and search
  const fetchGenres = async (page = 1, limit = 13) => {
    try {
      const response = await fetch(
        `${devTunnelUrl}/get_channels?page=${page}&limit=${limit}&search=${searchTerm}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
        }
      );

      const genreResponse = await fetch(`${devTunnelUrl}/get_genres`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authToken}`,
        },
      });

      const data = await response.json();
      const genreEnumData = await genreResponse.json();

      if (!response.ok || genreResponse.ok) {
        setGenres(
          data.data.map((item) => ({
            ...item,
            genre_id: item.genre_id, // Ensure genre_id is available
          }))
        );
        setGenreEnum(genreEnumData.genre_options);
        setTotalRecords(data.total);
      } else {
        toast.error(data.message || "Failed to fetch genres.");
      }
    } catch (error) {
      console.error("Error fetching genres:", error);
      toast.error("An error occurred while fetching genres.");
    }
  };

  useEffect(() => {
    fetchGenres(currentPage, limit);
  }, [currentPage, searchTerm]);


  const openAlert = (type, Id, active) => {
    setActive(active);
    setChannelId(Id);
    setOpenDeleteModel(true);
  };
  // Open modal for adding or editing
  const openModal = (type, genre = null) => {
    setIsModalOpen(true);
    setIsEditMode(!!genre);
    setSelectedGenre(genre);
    setNewChannel(genre ? genre.channel : "");
    setNewGenre(genre ? genre.genre_id : 1); // Use genre_id for editing
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setNewChannel("");
    setNewGenre();
    setSelectedGenre(null);
  };
  const closeDeleteModal = () => setOpenDeleteModel(false);

  // Add new genre
  const addGenre = async () => {
    try {
      const response = await fetch(`${devTunnelUrl}add_channel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authToken}`,
        },
        body: JSON.stringify({ channel: newChannel, genre_id: newGenre }),
      });

      if (response.ok) {
        toast.success("Genre added successfully!");
        fetchGenres(currentPage, limit); // Refresh the list after addition
        closeModal();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to add genre.");
      }
    } catch (error) {
      console.error("Error adding genre:", error);
      toast.error("An error occurred while adding the genre.");
    }
  };

  // Update existing genre
  const updateGenre = async () => {
    try {

      // return
      const response = await fetch(
        `${devTunnelUrl}update_channel/${selectedGenre?.id || channelId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
          body: JSON.stringify({
            ...(!newGenre  && { active: !active }),
            ...(newChannel && { channel: newChannel }),
            ...(newGenre && { genre_id: newGenre }),
          }),
        }
      );

      if (response.ok) {
        toast.success("Genre updated successfully!");
        fetchGenres(currentPage, limit); // Refresh the list after update
        setActive((prev) => !prev);

        closeModal();
        closeDeleteModal();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to update genre.");
      }
    } catch (error) {
      console.error("Error updating genre:", error);
      toast.error("An error occurred while updating the genre.");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page for new search
  };

  const totalPages = Math.ceil(totalRecords / limit);

  return (
    <div className='flex flex-col md:flex-row w-full h-screen bg-cover bg-center bg-no-repeat bg-[url("https://i.ibb.co/S69yyvw/thumbnail.jpg")]'>
      <AdminSideNav />
      <div className="p-6 min-h-screen text-gray-800 bg-white basis-[95%]">
        <ToastNotification />

        <div className="flex justify-between mb-6 space-x-4">
          <div className="relative w-1/3">
            <Search
              searchTerm={searchTerm}
              handleSearch={handleSearch}
              searchText="genre"
            />
          </div>
          <div className="w-1/3">
            <AddButton openModal={openModal} text="Add Channel" />
          </div>
        </div>

        {/* Genre Table */}
      
          <DataTable
            headers={["CHANNEL", "GENRE", "ACTIONS"]}
            data={genres}
            openModal={openModal}
            openAlert={openAlert}
          />

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />

        {/* Modal for Adding/Editing Genre */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h3 className="text-lg font-semibold mb-4 text-[#E73C30]">
                {isEditMode ? "Edit Channel" : "Add Channel"}
              </h3>
              <input
                type="text"
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value)}
                placeholder="Channel"
                className="border border-gray-300 p-2 w-full rounded-lg mb-4"
              />
              <EnumDropDown 
                value={newGenre}
                setValue={setNewGenre}
                data={genreEnum}
              />

              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={isEditMode ? updateGenre : addGenre}
                  className="bg-gradient-to-r from-[#E73C30] to-[#F58220] text-white font-semibold px-6 py-2 rounded-lg"
                >
                  {isEditMode ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
        {openDeleteModel && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-1/3 ">
              <div className="flex justify-end items-center mb-4">
                <button onClick={closeDeleteModal} className="text-gray-500">
                  <FaTimes />
                </button>
              </div>
              <div className="flex justify-center pb-4">
                <h1 className="text-4xl font-bold text-orange-600 justify-center">
                  Do you want to {active ? "Deactivate" : "Activate"} this
                  Genre?
                </h1>
              </div>
              <AddButton text="Yes" handleSubmit={updateGenre} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenreManagement;
