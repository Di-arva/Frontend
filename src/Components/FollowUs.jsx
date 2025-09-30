import { HiOutlineArrowLongDown } from "react-icons/hi2";
import { RiLinkedinFill } from "react-icons/ri";
import { ImFacebook } from "react-icons/im";
import { FaXTwitter } from "react-icons/fa6";
import { FiInstagram } from "react-icons/fi";

const FollowUs = () => {
  return (
    <>
      {/* Right vertical bar for Desktop */}
      <div className="hidden md:flex fixed right-4 top-1/2 transform -translate-y-1/2 flex-col items-center z-10 font-poppins">
        <div className="flex flex-col gap-2 mb-3">
          <a
            href="https://www.facebook.com/diarvahealthcare/"
            target="_blank"
            aria-label="Facebook Link"
          >
            <ImFacebook className="size-8 border rounded-lg p-1 text-2xl text-darkblue hover:text-darkblack hover:border-darkblack transition-colors duration-200" />
          </a>

          <a
            href="https://x.com/diarvasolution"
            target="_blank"
            aria-label="X Link"
          >
            <FaXTwitter className="size-8 border rounded-lg p-1 text-2xl text-darkblue hover:text-darkblack hover:border-darkblack transition-colors duration-200" />
          </a>

          <a
            href="https://www.instagram.com/diarvahealthcare/"
            target="_blank"
            aria-label="Instagram Link"
          >
            <FiInstagram className="size-8 border rounded-lg p-1 text-2xl text-darkblue hover:text-darkblack hover:border-darkblack transition-colors duration-200" />
          </a>

          <a
            href="https://www.linkedin.com/company/di-arva"
            target="_blank"
            aria-label="LinkedIn Link"
          >
            <RiLinkedinFill className="size-8 border rounded-lg p-1 text-2xl text-darkblue hover:text-darkblack hover:border-darkblack transition-colors duration-200" />
          </a>
        </div>

        <HiOutlineArrowLongDown
          className="size-8 text-darkblue mb-3"
          style={{ transform: "rotate(180deg)" }}
        />
        <span
          className="text-darkblue font-semibold text-sm "
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Follow Now
        </span>
      </div>
    </>
  );
};

export default FollowUs;
