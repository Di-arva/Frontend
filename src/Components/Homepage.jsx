import Features from "./Features";
import Contact from "./Contact";
import Faq from "./Faq";

import About from "./About";
import Hero from "./Hero";

const Homepage = () => {
  return (
    <>
      <Hero />
      <div className="flex-grow ml-10 ">
        <About />
        <Features />
        <Faq />
        <Contact />
      </div>
    </>
  );
};

export default Homepage;
