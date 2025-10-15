import Button from "./Button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const words = ["dental", "homecare", "rehabilitation"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000); // every 2s
    return () => clearInterval(interval);
  }, []);

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
            <span className="relative inline-block h-[1.2em] overflow-hidden align-bottom">
              {/* This is the sliding container that moves up and down */}
              <span
                className="block transition-transform duration-700 ease-in-out"
                style={{
                  // The magic happens here: we move the entire block of words up
                  // by the height of one item (1.2em) multiplied by the current index.
                  transform: `translateY(-${index * 1.2}em)`,
                }}
              >
                {/* Map through the words and render each one */}
                {words.map((word) => (
                  <div key={word} className="h-[1.2em]">
                    {word}
                  </div>
                ))}
              </span>
            </span>{" "}
            services
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
              <Button variant="dark" size="md">
                Office Sign Up
              </Button>
            </Link>
            <Link to="/candidatesignup">
              <Button variant="dark" size="md">
                Candidates Sign Up
              </Button>
            </Link>
            <Link to="/individualsignup">
              <Button variant="dark" size="md">
                Individual / Family Sign Up
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
