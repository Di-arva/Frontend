import Button from "./Button";

const Hero = () => {
  return (
    <div id="home">
      <div className="flex bg-lightblue  md:flex-row md:min-h-screen lg:min-h-[850px]">
        {/* Left Content - 50% */}
        <div
          className="flex flex-col justify-center 
                       sm:px-8  lg:px-20 xl:px-32 
                        py-10 md:py-0 w-full md:w-1/2"
        >
          <h1
            className="font-bold text-darkblue 
                         text-4xl sm:text-5xl md:text-5xl lg:text-7xl xl:text-8xl 
                         tracking-wider leading-tight"
          >
            Quality Staff <br />
            Trusted Care <br />
            Every Shift
          </h1>

          <p
            className="font-poppins mt-6 text-darkblack 
                        text-sm sm:text-base md:text-lg 
                        w-full max-w-[600px]"
          >
            We provide comprehensive health solutions tailored to your needs.
            With advanced medical practices, modern technology, and a patient
            first approach, we ensure high quality care at accessible costs
            supporting your well-being at every stage of life.
          </p>

          <div className="flex mt-8 gap-4 sm:gap-5 md:gap-6 lg:gap-8 flex-wrap">
            <Button variant="light" size="md">
              Create Account
            </Button>
            <Button variant="dark" size="md">
              Talk to us
            </Button>
          </div>
        </div>

        {/* Right Decorative Background - 50% */}
        <div className="w-full md:w-1/2 hidden md:flex items-center justify-center overflow-hidden">
          <div className="flex items-center justify-center w-full h-full">
            <div
              className="font-bold text-darkblue opacity-20 leading-none
                 text-[180px] sm:text-[250px] md:text-[300px] lg:text-[450px] xl:text-[550px]
                 max-w-full"
            >
              •D•
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
