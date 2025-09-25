import { HiOutlineArrowLongDown } from "react-icons/hi2";

import { RiLinkedinFill } from "react-icons/ri";
import { ImFacebook } from "react-icons/im";
import { FaXTwitter } from "react-icons/fa6";
import { FiInstagram } from "react-icons/fi";

const FollowUs = () => {
  return (
    <>
      {/* Left vertical bar for Desktop */}
      <div className="hidden md:flex fixed left-4 top-1/2 transform -translate-y-1/2 flex-col items-center z-10 font-poppins">
        <span
          className="text-darkblue font-semibold text-sm mb-3"
          style={{ writingMode: "vertical-rl" }}
        >
          Follow Now
        </span>

        <HiOutlineArrowLongDown
          className="size-8 text-darkblue mb-3"
          style={{ writingMode: "vertical-rl" }}
        />

        <div className="flex flex-col gap-2">
          <a
            href="https://www.facebook.com/diarvahealthcare/"
            target="_blank"
            aria-label="Facebook Link"
          >
            <ImFacebook className="size-8 border rounded-lg p-1 text-2xl text-darkblue hover:text-darkblack hover:border-darkblack" />
          </a>

          <a
            href="https://x.com/diarvasolution"
            target="_blank"
            aria-label="X Link"
          >
            <FaXTwitter className="size-8 border rounded-lg p-1 text-2xl text-darkblue hover:text-darkblack hover:border-darkblack" />
          </a>
          <a
            href="https://www.instagram.com/diarvahealthcare/"
            target="_blank"
            aria-label="Instagram Link"
          >
            <FiInstagram className="size-8 border rounded-lg p-1 text-2xl text-darkblue hover:text-darkblack hover:border-darkblack" />
          </a>
          <a
            href="https://www.linkedin.com/company/di-arva"
            target="_blank"
            aria-label="LinkedIn Link"
          >
            <RiLinkedinFill className="size-8 border rounded-lg p-1 text-2xl text-darkblue hover:text-darkblack hover:border-darkblack" />
          </a>
        </div>
      </div>
    </>
  );
};

export default FollowUs;
