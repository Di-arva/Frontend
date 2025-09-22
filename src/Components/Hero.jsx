import Button from "./Button";

const Hero = () => {
  return (
    <div id="home" className="">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left Content - 70% */}
        <div className="flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-10 md:py-0 w-full md:w-[70%] z-20">
          <h1 className="font-bold text-darkblue text-7xl tracking-wider">
            Quality Staff <br />
            Trusted Care <br />
            Every Shift
          </h1>

          <p className="font-poppins mt-6 text-darkblack text-md w-full">
            We provide comprehensive health solutions tailored to your needs.
            With advanced medical practices, modern technology, and a patient
            first approach, we ensure high quality care at accessible costs
            supporting your well-being at every stage of life.
          </p>

          <div className="flex mt-8 gap-4 md:gap-6 lg:gap-8 flex-wrap">
            <Button variant="light" size="md">
              Create Account
            </Button>
            <Button variant="dark" size="md">
              Talk to us
            </Button>
          </div>
        </div>

        {/* Right Decorative Background - 30% */}
        <div className="w-full md:w-full -ml-40 bg-lightblue flex items-center justify-center overflow-hidden">
          <div className="flex items-center justify-center gap-2 md:gap-6">
            <div className="text-[500px] font-bold text-darkblue opacity-20 leading-none">
              •D•
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
