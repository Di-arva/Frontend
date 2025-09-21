import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage";
import Footer from "./Components/Footer";

import Navigation from "./Components/Navigation";
import Login from "./Components/Login";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-lightbg  ">
          <Navigation />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
