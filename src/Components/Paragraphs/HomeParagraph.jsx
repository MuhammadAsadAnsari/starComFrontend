import React from 'react'

const HomeParagraph = ({text,styling}) => {
  return (
    <p className={`font-poppins  font-medium text-[#282828]  ${styling && styling} text-lg  ss:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl`}>
      {text}
    </p>
  );
}

export default HomeParagraph
