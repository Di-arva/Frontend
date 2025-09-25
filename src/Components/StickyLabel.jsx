const StickyLabel = () => {
  const languages = [
    "We provide support in English",
    "ਅਸੀਂ ਪੰਜਾਬੀ ਵਿੱਚ ਸਹਾਇਤਾ ਪ੍ਰਦਾਨ ਕਰਦੇ ਹਾਂ ।",
    "zapewniamy wsparcie w języku polskim",
    "हम हिन्दी में सहायता प्रदान करते हैं।",
    "અમે ગુજરાતીમાં મદદ કરીએ છીએ.",
  ];

  return (
    <div className="w-full bg-darkblue opacity-85 mt-4 flex z-30 items-center fixed font-poppins font-medium top-16 text-base lg:text-sm py-2 px-2 lg:px-20 lg:py-3">
      {/* 📱 Mobile view - Marquee */}
      <div className="block md:hidden w-full overflow-hidden relative">
        <div className="inline-block whitespace-nowrap animate-scroll">
          {languages.map((language, index) => (
            <span key={index} className="mx-8 text-lightbg">
              {language}
            </span>
          ))}
        </div>
      </div>

      {/* 💻 Desktop view - Static */}
      <ul className="hidden md:flex flex-wrap justify-around gap-2 text-lightbg w-full">
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
