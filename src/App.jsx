import Features from "./Components/Features";
import Contact from "./Components/Contact";
import Faq from "./Components/Faq";
import Footer from "./Components/Footer";

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-lightbg ">
        <div className="flex-grow ml-10">
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
