import { useState } from "react";
import Logo from "/Logo.png";
import StickyLabel from "./StickyLabel";
import Button from "./Button";
import { HashLink } from "react-router-hash-link";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const getNavLinkClassName = (isActive) =>
  `relative font-poppins font-medium text-md
    after:content-[''] after:absolute after:h-0.5 after:bg-blue-800 after:bottom-0 after:transition-all after:duration-300
    hover:text-darkblue
    ${
      isActive
        ? "text-darkblue after:left-0 lg:after:w-full after:w-14"
        : "text-darkblack after:left-1/2 after:w-0 hover:after:w-14 lg:hover:after:w-full hover:after:left-0"
    }`;

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="fixed w-full h-20 z-40 bg-lightbg flex justify-between items-center px-6 lg:px-10">
        {/* Logo */}
        <div>
          <img
            className="w-52"
            src="/Logo.png"
            alt="Di'arva text in dark blue colour with healthcare staffing solution text at bottom in black color"
          />
        </div>

        {/* Desktop Nav (Large screens) */}
        <ul className="hidden xl:flex gap-12">
          <li className={getNavLinkClassName(location.hash === "#home")}>
            <HashLink smooth to="/#home">
              Home
            </HashLink>
          </li>
          <li className={getNavLinkClassName(location.hash === "#aboutus")}>
            <HashLink smooth to="/#aboutus">
              About
            </HashLink>
          </li>
          <li className={getNavLinkClassName(location.hash === "#features")}>
            <HashLink smooth to="/#features">
              Features
            </HashLink>
          </li>
          <li className={getNavLinkClassName(location.hash === "#faq")}>
            <HashLink smooth to="/#faq">
              Faq
            </HashLink>
          </li>
          <li className={getNavLinkClassName(location.hash === "#contactus")}>
            <HashLink smooth to="/#contactus">
              Contact Us
            </HashLink>
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden xl:flex gap-6">
          <Button variant="light" size="md" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button variant="dark" size="md">
            Create Account
          </Button>
        </div>

        {/* Mobile / iPad Burger Icon */}
        <div className="xl:hidden">
          <button
            className="hover:cursor-pointer"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X size={28} className="text-darkblue" />
            ) : (
              <Menu size={28} className="text-darkblue" />
            )}
          </button>
        </div>

        {/* Mobile / Tablet Dropdown with Slide Animation */}
        <div
          className={`fixed  top-20 left-0 w-full flex justify-center  transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="bg-lightbg shadow-md z-80 w-full py-6 px-6 flex flex-col gap-6">
            <ul className="flex flex-col gap-6">
              <li
                className={`${getNavLinkClassName(
                  location.hash === "#home"
                )} w-max`}
              >
                <HashLink smooth to="/#home" onClick={toggleMenu}>
                  Home
                </HashLink>
              </li>
              <li
                className={`${getNavLinkClassName(
                  location.hash === "#aboutus"
                )} w-max`}
              >
                <HashLink smooth to="/#aboutus" onClick={toggleMenu}>
                  About Us
                </HashLink>
              </li>
              <li
                className={`${getNavLinkClassName(
                  location.hash === "#features"
                )} w-max`}
              >
                <HashLink smooth to="/#features" onClick={toggleMenu}>
                  Features
                </HashLink>
              </li>
              <li
                className={`${getNavLinkClassName(
                  location.hash === "#faq"
                )} w-max`}
              >
                <HashLink smooth to="/#faq" onClick={toggleMenu}>
                  Faq
                </HashLink>
              </li>
              <li
                className={`${getNavLinkClassName(
                  location.hash === "#contactus"
                )} w-max`}
              >
                <HashLink smooth to="/#contactus" onClick={toggleMenu}>
                  Contact Us
                </HashLink>
              </li>
            </ul>

            <div className="flex flex-col gap-4">
              <Button
                variant="light"
                size="md"
                onClick={() => {
                  navigate("/login");
                  toggleMenu();
                }}
              >
                Login
              </Button>
              <Button variant="dark" size="md">
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <StickyLabel />
    </>
  );
};

export default Navigation;
