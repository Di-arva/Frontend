const StickyLabel = () => {
  const languages = [
    "We provide support in English",
    "ਅਸੀਂ ਪੰਜਾਬੀ ਵਿੱਚ ਸਹਾਇਤਾ ਪ੍ਰਦਾਨ ਕਰਦੇ ਹਾਂ ।",
    "zapewniamy wsparcie w języku polskim",
    "हम हिन्दी में सहायता प्रदान करते हैं।",
    "અમે ગુજરાતીમાં મદદ કરીએ છીએ.",
  ];

  return (
    <div className="w-full bg-darkblue opacity-85 mt-4 flex z-30 items-center fixed font-poppins font-medium top-16 text-base lg:text-sm py-2 px-2 lg:px-20 lg:py-3 overflow-hidden">
      <div className="w-full overflow-hidden relative">
        <div className="flex whitespace-nowrap animate-scroll">
          {[...languages, ...languages].map((language, index) => (
            <span key={index} className="mx-8 text-lightbg">
              {language}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StickyLabel;
