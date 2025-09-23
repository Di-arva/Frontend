import { useState, useEffect } from "react";

const StickyLabel = () => {
  const languages = [
    "We provide support in English",
    "ਅਸੀਂ ਪੰਜਾਬੀ ਵਿੱਚ ਸਹਾਇਤਾ ਪ੍ਰਦਾਨ ਕਰਦੇ ਹਾਂ ।",
    "zapewniamy wsparcie w języku polskim",
    "हम हिन्दी में सहायता प्रदान करते हैं।",
    "અમે ગુજરાતીમાં મદદ કરીએ છીએ.",
  ];

  return (
    <div
      className=" w-full  bg-darkblue opacity-85 mt-4 flex z-30 items-center fixed font-poppins  md:text-md font-medium py-2  top-16
                    h-auto   px-2 text-base md:h-auto lg:text-sm lg:px-20 lg:py-3  lg:items-start"
    >
      <ul className="flex flex-wrap justify-around gap-2     text-lightbg w-full  ">
        {languages.map((language, index) => (
          <li
            key={index}
            className="whitespace-nowrap text-center md:text-left"
          >
            {language}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StickyLabel;
