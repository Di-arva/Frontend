import { Link } from "react-router-dom";
import { FaPhoneVolume } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FiInstagram } from "react-icons/fi";
import { TbBrandFacebook } from "react-icons/tb";
import { LiaLinkedinIn } from "react-icons/lia";
import { FaLock } from "react-icons/fa6";

import Logo from "/Logo.png";
const Footer = () => {
  return (
    <>
      <div className="px-4 pt-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl border-t border-lightblue md:px-24 lg:px-8">
        <div className="grid gap-10 row-gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Link
              href="/"
              aria-label="Go home"
              title="Diarva"
              className="inline-flex items-center"
            >
              <img
                className="w-52"
                src="/Logo.png"
                alt="Di'arva text in dark blue colour with healthcare staffing solution text at bottom"
              />
            </Link>

            <div className="lg:max-w-sm">
              <p className="text-sm ml-3 text-darkblue font-medium font-poppins">
                Let's empower healthcare together.
              </p>
              <p className="text-sm mt-2 ml-3 text-darkblack font-poppins">
                we specialize in providing high quality temporary staffing
                solutions for dental practices, home care providers, and
                physiotherapy clinics.
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p className=" font-semibold tracking-wide text-darkblue font-poppins text-lg">
              Reach Us
            </p>
            <div className="flex items-center ">
              <p className="mr-1 text-lightbg border rounded-full p-2 bg-darkblue">
                <FaPhoneVolume />
              </p>
              <a
                href="tel:365-767-0707"
                aria-label="Phone number of Di’arva"
                target="_blank"
                rel="noopener noreferrer"
                title="Our phone"
                className="hover:text-darkblue font-poppins text-sm font-medium text-darkblack"
              >
                +1-365-767-0707
              </a>
            </div>
            <div className="flex items-center">
              <p className="mr-1 text-lightbg border rounded-full p-2 bg-darkblue">
                <IoMdMail />
              </p>
              <a
                href="mailto:info@diarva.org"
                aria-label="Di'arva email address"
                title="Our email"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-darkblue font-poppins text-sm font-medium text-darkblack"
              >
                info@diarva.org
              </a>
            </div>
            <div className="flex items-center">
              <p className="mr-1 text-lightbg border rounded-full p-2 bg-darkblue">
                <FaMapMarkerAlt />
              </p>
              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Our address"
                title="Our address"
                className="hover:text-darkblue font-poppins text-sm font-medium text-darkblack"
              >
                94 eringate drive
Etobicoke M9C 3Z6
ON Canada
              </a>
            </div>
          </div>
          <div>
            <span className="font-semibold tracking-wide text-darkblue font-poppins text-lg">
              Follow Us
            </span>
            <div className="flex items-center mt-1 space-x-3">
              <a
                href="https://x.com/diarvasolution"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lightbg border rounded-full p-2 bg-darkblue"
              >
                <FaSquareXTwitter />
              </a>
              <a
                href="https://www.instagram.com/diarvahealthcare/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lightbg border rounded-full p-2 bg-darkblue"
              >
                <FiInstagram />
              </a>
              <a
                href="https://www.facebook.com/diarvahealthcare/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lightbg border rounded-full p-2 bg-darkblue"
              >
                <TbBrandFacebook />
              </a>
              <a
                href="https://www.linkedin.com/company/di-arva"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lightbg border rounded-full p-2 bg-darkblue"
              >
                <LiaLinkedinIn />
              </a>
            </div>
            <p className="text-sm mt-2  text-darkblack font-poppins">
              We are open for your feedback. We are listening. Follow us on all
              social media for latest updates.
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between pt-3 pb-4 gap-2 ">
          <p className="text-sm text-darkblack font-poppins font-normal flex md:items-center">
            <FaLock className="mr-2 text-darkblue flex" />
            Your data is secure with us (with AES-256, block-level storage
            encryption)
          </p>
          <div className="flex gap-4 ml-5">
            <p className="hover:text-darkblue cursor-pointer  font-poppins text-sm font-normal text-darkblack">
              Privacy Policy
            </p>
            <p className="hover:text-darkblue cursor-pointer font-poppins text-sm font-normal text-darkblack">
              Terms &amp; Conditions
            </p>
          </div>
        </div>
      </div>
      <div className="bg-darkblue  w-full text-center flex h-10 text-lightbg font-poppins justify-center items-center text-sm ">
        © Di'arva 2025 developed by Etherea Tech
      </div>
    </>
  );
};

export default Footer;
