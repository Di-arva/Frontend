import { useState, useEffect } from "react";

const StickyLabel = () => {
  const languages = [
    "We provide support in English",
    "ਅਸੀਂ ਪੰਜਾਬੀ ਵਿੱਚ ਸਹਾਇਤਾ ਪ੍ਰਦਾਨ ਕਰਦੇ ਹਾਂ ।",
    "zapewniamy wsparcie w języku polskim",
    "हम हिन्दी में सहायता प्रदान करते हैं।",
    "અમે ગુજરાતીમાં મદદ કરીએ છીએ.",
  ];
  const MAX_VISIBLE = 4;
  const [visibleLanguages, setVisibleLanguages] = useState(
    languages.slice(0, MAX_VISIBLE)
  );
  const [fadeIndex, setFadeIndex] = useState(0);

  useEffect(() => {
    if (languages.length <= MAX_VISIBLE) return;

    const interval = setInterval(() => {
      setFadeIndex((prev) => (prev + 1) % languages.length);
      setVisibleLanguages((prev) => {
        const next = [...prev];
        next.shift(); // remove first
        next.push(languages[(fadeIndex + MAX_VISIBLE) % languages.length]); // add next language
        return next;
      });
    }, 3000); // change every 3 seconds

    return () => clearInterval(interval);
  }, [fadeIndex, languages]);

  return (
    <div
      className=" w-full  bg-darkblue opacity-85 mt-4 flex items-center fixed font-poppins  md:text-md font-medium py-2  top-16
                    h-auto  px-2 text-base md:h-auto"
    >
      <ul className="flex flex-wrap justify-around gap-2     text-lightbg w-full  ">
        {visibleLanguages.map((language, index) => (
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
