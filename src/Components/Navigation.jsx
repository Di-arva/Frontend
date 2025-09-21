import Logo from "/Logo.png";
import StickyLabel from "./StickyLabel";
import Button from "./Button";
import { HashLink } from "react-router-hash-link";
import { useLocation, useNavigate } from "react-router-dom";

// Helper function to create the common `li` className string
const getNavLinkClassName = (isActive) =>
  `relative font-poppins font-medium text-md
    after:content-[''] after:absolute after:h-0.5 after:bg-blue-800 after:bottom-0 after:transition-all after:duration-300
    hover:after:w-full hover:after:left-0 hover:text-darkblue
    ${
      isActive
        ? "text-darkblue after:w-full after:left-0"
        : "text-darkblack after:w-0 after:left-1/2"
    }`;

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <nav className="fixed w-full h-20 z-30 bg-lightbg flex justify-around items-center px-10">
        <div>
          <img
            className="w-3xs"
            src={Logo}
            alt="Di'arva text in dark blue colour with healthcare staffing solution text at bottom"
          />
        </div>
        <ul className="flex gap-12">
          <li className={getNavLinkClassName(location.hash === "#home")}>
            <HashLink smooth to="#home">
              Home
            </HashLink>
          </li>
          <li className={getNavLinkClassName(location.hash === "#aboutus")}>
            <HashLink smooth to="#aboutus">
              About Us
            </HashLink>
          </li>
          <li className={getNavLinkClassName(location.hash === "#features")}>
            <HashLink smooth to="#features">
              Features
            </HashLink>
          </li>
          <li className={getNavLinkClassName(location.hash === "#faq")}>
            <HashLink smooth to="#faq">
              Faq
            </HashLink>
          </li>
          <li className={getNavLinkClassName(location.hash === "#contactus")}>
            <HashLink smooth to="#contactus">
              Contact Us
            </HashLink>
          </li>
        </ul>
        <div className="flex gap-8">
          <Button variant="light" size="md" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button variant="dark" size="md">
            Talk to us
          </Button>
        </div>
      </nav>
      <StickyLabel />
    </>
  );
};

export default Navigation;
