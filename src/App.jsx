import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import Candidatedashboard from "./Components/Dashboard/Candidatedashboard";

// Layout wrapper for public pages
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-lightbg">
      <Navigation />
      <FollowUs />
      <main className="flex-1 mt-22">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin dashboard */}
        <Route path="/admin/*" element={<Admindashboard />} />
          <Route path="/candidate/*" element={<Candidatedashboard />} />

        {/* Public routes wrapped in PublicLayout */}
        <Route
          path="/*"
          element={
            <PublicLayout>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<CreateAccount />} />
                <Route path="/officesignup" element={<Officesignup />} />
                <Route path="/candidatesignup" element={<Candidatesignup />} />
                <Route
                  path="/individualsignup"
                  element={<Individualsignup />}
                />
              </Routes>
            </PublicLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
