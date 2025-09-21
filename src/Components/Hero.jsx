import Button from "./Button";

const Hero = () => {
  return (
    <div id="home" className="mt-60 sm:mt-80 md:mt-0">
      <div className="flex flex-col md:flex-row items-center md:items-stretch">
        {/* Left Content */}
        <div className="flex flex-col z-10 justify-center h-auto md:h-screen px-4 sm:px-8 md:px-0 py-10 md:py-0 max-w-2xl lg:max-w-3xl">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-bold text-darkblue leading-tight">
            Quality Staff <br className="hidden sm:block" />
            Trusted Care <br className="hidden sm:block" />
            Every Shift
          </h1>

          <p className="font-poppins w-full md:w-4/5 lg:w-3/5 mt-4 sm:mt-6 md:mt-8 lg:mt-12 text-darkblack text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
            We provide comprehensive health solutions tailored to your needs.
            With advanced medical practices, modern technology, and a patient
            first approach, we ensure high-quality care at accessible costs
            supporting your well-being at every stage of life.
          </p>

          <div className="flex mt-6 md:mt-8 gap-4 md:gap-6 lg:gap-8 flex-wrap">
            <Button variant="light" size="md">
              Create Account
            </Button>
            <Button variant="dark" size="md">
              Talk to us
            </Button>
          </div>
        </div>

        {/* Right Decorative Background */}
        <div className="flex w-full md:flex-1 justify-center md:justify-start mt-10 md:mt-0 bg-lightblue relative overflow-hidden">
          <div className="text-[120px] sm:text-[200px] md:text-[300px] lg:text-[500px] xl:text-[650px] font-bold text-darkblue opacity-20 -mr-2 md:-mr-10 flex items-center">
            •
          </div>
          <div className="text-[160px] sm:text-[250px] md:text-[400px] lg:text-[600px] xl:text-[750px] font-bold text-darkblue opacity-20 ml-2 md:ml-10 flex justify-center items-center">
            D
          </div>
          <div className="text-[120px] sm:text-[200px] md:text-[300px] lg:text-[500px] xl:text-[650px] font-bold text-darkblue opacity-20 flex items-center">
            •
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
