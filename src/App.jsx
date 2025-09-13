import Contact from "./Components/Contact";
import Footer from "./Components/Footer";

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-lightbg ">
        <div className="flex-grow ml-10"><Contact/></div>
        <Footer />
      </div>
    </>
  );
}

export default App;
