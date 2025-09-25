import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage";
import Footer from "./Components/Footer";
import FollowUs from "./Components/FollowUs";
import Navigation from "./Components/Navigation";
import Login from "./Components/Login";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-lightbg">
          <Navigation />
          <FollowUs />
          <main className="flex-1 mt-30">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
