import StickyLabel from "./StickyLabel";

const Hero = () => {
  return (
    <div id="home" className="mb-20">
      <div className="flex ml-55">
        <div className="flex flex-col z-10 justify-center h-screen ">
          <h1 className="text-9xl font-bold text-darkblue">
            Quality staff Trusted care Every shift
          </h1>
          <p className="font-poppins w-200 mt-12 text-darkblack">
            We comprehensive health solutions tailored to your needs. With
            advanced medical practices, modern technology, and a patient first
            approach, we ensure high-quality care at accessible costs supporting
            your well-being at every stage of life.
          </p>
          <div className="flex mt-8 gap-8">
            <button className="bg-white text-sm  font-poppins text-darkblue border border-darkblue px-6 py-3 font-semibold rounded-full  hover:cursor-pointer">
              Create Account
            </button>
            <button className="bg-darkblue text-lightbg px-6 py-3 rounded-full font-semibold hover:cursor-pointer">
              Talk to us
            </button>
          </div>
        </div>
        <div className="flex w-full -ml-90 bg-lightblue">
          <div className="text-[650px] -mr-30 font-bold  items-center  text-darkblue opacity-20 ">
            •
          </div>
          <div className="text-[750px] font-bold justify-center items-center flex text-darkblue opacity-20 ml-30">
            D
          </div>
          <div className="text-[650px] font-bold  items-center  text-darkblue opacity-20 ">
            •
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
