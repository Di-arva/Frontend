import Button from "./Button";

const Hero = () => {
  return (
    <div className="relative bg-lightblue py-10 px-4 sm:px-8 lg:px-16">
      {/* Inner container with max width */}
      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row">
        {/* Watermark "•D•" for large screens */}
        <div className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 text-[400px] font-bold text-darkblue opacity-20 leading-none pointer-events-none">
          •D•
        </div>

        {/* Left Content (Heading + Text + Buttons) */}
        <div className="flex mt-24 flex-col w-full lg:w-[80%] items-center lg:items-start z-10 ">
          <h1
            className="font-bold text-darkblue 
             text-4xl sm:text-5xl md:text-6xl lg:text-7xl
             tracking-wider leading-tight 
             text-center lg:text-left"
          >
            Quality Staff <br />
            Trusted Care <br />
            Every Shift
          </h1>

          <p
            className="font-poppins mt-3 text-darkblack 
                         text-base sm:text-lg md:text-lg lg:text-lg 
                         text-center lg:text-left max-w-2xl lg:w-[80%]"
          >
            We provide comprehensive health solutions tailored to your needs.
            With advanced medical practices, modern technology, and a
            patient-first approach, we ensure high-quality care at accessible
            costs supporting your well-being at every stage of life.
          </p>

          <div className="flex mt-6 gap-3 sm:gap-5 md:gap-5 lg:gap-6 flex-wrap justify-center lg:justify-start">
            <Button variant="light" size="md">
              Create Account
            </Button>
            <Button variant="dark" size="md">
              Talk to us
            </Button>
          </div>
        </div>

        {/* Right Content for Mobile / iPad Pro */}
        <div className="flex items-center justify-center mt-10 lg:hidden w-full">
          <div className="font-bold text-darkblue opacity-20 leading-none text-[150px] sm:text-[220px]">
            •D•
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
