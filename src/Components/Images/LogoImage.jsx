import React from "react";

const LogoImage = ({ styling, color }) => {
  // Determine the correct image URL based on the color prop
  const imageUrl =
    color == "black"
      ? "https://i.ibb.co/s1Th5r3/OPTA-logo-4.png"
      : "";
  // const imageUrl = "https://i.postimg.cc/wxGG73C3/OPTA-logo-4.png";
  return (
    <div
      className={`bg-[url(https://i.ibb.co/LQzwKX1/OPTA-logo-4-2.png)] bg-contain bg-no-repeat bg-center ${
        styling ? styling : "w-48 h-24"
      }`}
    ></div>
  );
};

export default LogoImage;
