import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage";
import Footer from "./Components/Footer";
import FollowUs from "./Components/FollowUs";
import Navigation from "./Components/Navigation";
import Login from "./Components/Login";
import CreateAccount from "./Components/CreateAccount";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-lightbg">
          <Navigation />
          <FollowUs />
          <main className="flex-1 mt-16">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<CreateAccount />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
