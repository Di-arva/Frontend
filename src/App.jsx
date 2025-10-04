import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage";
import Footer from "./Components/Footer";
import FollowUs from "./Components/FollowUs";
import Navigation from "./Components/Navigation";
import Login from "./Components/Login";
import CreateAccount from "./Components/CreateAccount";
import Officesignup from "./Components/SignUp/Officesignup";
import Candidatesignup from "./Components/SignUp/Candidatesignup";
import Individualsignup from "./Components/SignUp/Individualsignup";
import Admindashboard from "./Components/Dashboard/Admindashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<Admindashboard />} />
        </Routes>
        <div className="min-h-screen flex flex-col bg-lightbg">
          <Navigation />
          <FollowUs />
          <main className="flex-1 mt-22">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<CreateAccount />} />
              <Route path="/officesignup" element={<Officesignup />} />
              <Route path="/candidatesignup" element={<Candidatesignup />} />
              <Route path="/individualsignup" element={<Individualsignup />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
