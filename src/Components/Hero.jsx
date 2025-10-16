import Button from "./Button";

import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative bg-lightblue px-4 sm:px-8 lg:px-16">
      <div className="relative max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 items-center lg:items-center py-10">
        <div className="relative z-10 flex flex-col w-full">
          <h1
            className="font-bold text-darkblue 
                 text-4xl sm:text-5xl md:text-6xl
                 tracking-wider leading-tight text-center lg:text-left"
          >
            Professional staffing solutions for
            {/* This is the "window" that clips the content */}
            <span className="ml-4 relative inline-block h-[1.2em] overflow-hidden align-bottom">
              {/* This is the sliding container that moves up and down */}
              <span className="block transition-transform duration-700 ease-in-out text-darkblue/60">
                Dental services
              </span>
            </span>
          </h1>
          <p
            className="font-poppins mt-4 text-darkblack 
                         text-base sm:text-lg md:text-lg lg:text-lg 
                         max-w-2xl text-center lg:text-left"
          >
            We provide comprehensive health solutions tailored to your needs.
            With advanced medical practices, modern technology, and a patient
            first approach, we ensure high quality care at accessible costs
            supporting your well being at every stage of life.
          </p>
          <div className="flex  mt-6 gap-3 mb-10 sm:gap-5 md:gap-5 lg:gap-6 flex-wrap justify-center lg:justify-start">
            <Link to="/officesignup">
              <Button
                variant="dark"
                size="md"
                className="hover:cursor-pointer hover:bg-darkblue/70"
              >
                Office Sign Up
              </Button>
            </Link>
            <Link to="/candidatesignup">
              <Button
                variant="dark"
                size="md"
                className="hover:cursor-pointer hover:bg-darkblue/70"
              >
                Candidates Sign Up
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative w-full h-full flex justify-center items-center">
          <div
            className="font-bold text-darkblue 
                         text-4xl sm:text-5xl md:text-6xl lg:text-7xl
                         tracking-widest leading-tight 
                         text-center lg:text-left"
          >
            <h1
              className="font-bold text-darkblue 
                         text-4xl sm:text-5xl md:text-6xl lg:text-7xl
                         tracking-widest lg:leading-32 leading-snug
                         text-center lg:text-left "
            >
              Quality Staff <br />
              Trusted Care <br />
              Every Shift
            </h1>
          </div>

          <div
            className="absolute text-[300px] lg:text-[500px] font-bold text-darkblue opacity-10 leading-none 
                           pointer-events-none z-0"
          >
            •D•
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
