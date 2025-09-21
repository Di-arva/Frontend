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
      className="w-full bg-darkblue opacity-85 mt-4 flex items-center fixed font-poppins  md:text-md font-medium p-4 z-20 top-16
                    h-auto md:h-10 px-2 text-base "
    >
      <ul className="flex flex-wrap md:flex-nowrap gap-2 md:gap-4 text-lightbg w-full justify-center md:justify-around">
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
