import Features from "./Components/Features";
import Contact from "./Components/Contact";
import Faq from "./Components/Faq";
import Footer from "./Components/Footer";
import About from "./Components/About";
import Hero from "./Components/Hero";

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-lightbg  ">
        <Hero />
        <div className="flex-grow ml-10 ">
          <About />
          <Features />
          <Faq />
          <Contact />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
