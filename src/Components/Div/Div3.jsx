import React, { useEffect } from 'react';
import HomeParagraph from '../Paragraphs/HomeParagraph';
import GenreSplitField from '../GenreSplitFields/GenreSplitField';
import { toast } from 'react-toastify';
import { useState } from 'react';

const Div3 = ({
  genreSplitFields,
  handleInputChange,
  errors,
  setGenreSplitFields,
  fields
}) => {
  
  const devTunnelUrl = import.meta.env.VITE_DEV_TUNNEL_URL;
  const encryptedToken = localStorage.getItem("authCookie");
  const authToken = atob(encryptedToken);
  const [genreEnum, setGenreEnum] = useState([]);

  const fetchGenres = async () => {
    const genreResponse = await fetch(`${devTunnelUrl}get_asscoiated_genres`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${authToken}`,
      },
    });
    if (!genreResponse.ok) return toast.error("Failed to get genres");
    const genreEnumData = await genreResponse.json();
    setGenreEnum(genreEnumData.genre_options);

const genreSplit = genreEnumData.genre_options.reduce((acc, item) => {
  acc[item.name.toLowerCase()] =
    fields?.genre ?fields?.genre[item?.name?.toLowerCase()] : "";
  return acc;
}, {});
  setGenreSplitFields(genreSplit);
  };

  useEffect(() => {
    if(Object.keys(fields).length>0)
    fetchGenres();
  }, [fields]);

  return (
    <div className="flex flex-col basis-[45%]  w-full ">
      <div className="basis-[10%] py-[1%] ">
        <HomeParagraph text="Genre Split" styling="pl-[10%]" />
      </div>
      <div className="flex flex-col basis-[40%]  justify-center pl-[10%]">
        {genreEnum.map((genre) => {
          
          return (
            <GenreSplitField
              key={genre.id}
              text={genre.name}
              value={
                genreSplitFields[genre.id] ||
                genreSplitFields[genre.name.toLowerCase()]
              }
              onChange={(e) =>
                handleInputChange(genre.name.toLowerCase(), e.target.value)
              }
              error={errors[genre.name.toLowerCase()]}
            />
          );})}
        {errors.totalGenreSplit && (
          <p className="text-red-500 mt-1">{errors.totalGenreSplit}</p>
        )}
      </div>
    </div>
  );
};

export default Div3;
