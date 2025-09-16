const Hero = () => {
  return (
    <div className="mb-20">
      <div className="w-full bg-darkblue h-10 opacity-85 flex items-center fixed font-poppins text-md font-normal  top-0  ">
        <ul className=" flex gap-4 text-lightbg mx-4  w-full justify-around ">
          <li>We provide support in English</li>
          <li>ਅਸੀਂ ਪੰਜਾਬੀ ਵਿੱਚ ਸਹਾਇਤਾ ਪ੍ਰਦਾਨ ਕਰਦੇ ਹਾਂ ।</li>
          <li>zapewniamy wsparcie w języku polskim</li>
          <li>हम हिन्दी में सहायता प्रदान करते हैं।</li>
          <li>અમે ગુજરાતીમાં મદદ કરીએ છીએ.</li>
        </ul>
      </div>

      <div className="flex mt-10 ml-10">
        <div className="flex flex-col   justify-center">
          <h1 className="text-9xl font-bold text-darkblue">
            Support that <br /> you can trust
          </h1>
          <p className="font-poppins w-148  ml-2 mt-10 text-darkblack">
            We comprehensive health solutions tailored to your needs. With
            advanced medical practices, modern technology, and a patient first
            approach, we ensure high-quality care at accessible costs supporting
            your well-being at every stage of life.
          </p>
        </div>
        <div className="flex-1 w-full border z-10  border-red-500 bg-lightblue pl-180"></div>
      </div>
    </div>
  );
};

export default Hero;
