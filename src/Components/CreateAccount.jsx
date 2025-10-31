import { Building2,Users,Cross} from "lucide-react";
import Button from "./Button";
import { Link } from 'react-router-dom';
const CreateAccount = () => {
  const features = [
    {
      id: 1,
      icon: <Building2/>,
      title: "Office Signup",
      desc: "Connect with prevetted healthcare professionals. Fill shifts faster, reduce administrative burden, and ensure uninterrupted patient care with our reliable staffing platform.",
      btntxt: "Office Sign Up",
      link: "/officesignup"
    },
    {
      id: 2,
      icon: <Cross />,
      title: "Candidate Signup",
      desc: "Find flexible shifts that respect your expertise. Work when you want, where you want, with competitive pay and supportive clinics that value your professional skills.",
      btntxt: "Candidate Sign Up",
      link: "/candidatesignup"
    },

  ];

  return (
    <>
      <div className="my-6 md:my-10 lg:my-10 px-8 md:px-8 lg:px-20">
        <h2 className="text-darkblue font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold">
          Create Account
        </h2>
        <p className="font-poppins w-full md:w-4/5 lg:w-2/3 mt-1 text-darkblack text-sm sm:text-base md:text-lg md:ml-2">
          Register yourself at
          <span className="text-darkblue font-semibold text-base sm:text-lg mx-2">
            Di’arva
          </span>
          as a Clinic or Healthcare Professional or Client
        </p>
      </div>

      <div id="features" className="my-20 px-4 md:px-8 lg:px-20">
   

      <div className="mt-10 grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 justify-items-center">
  {features.map((feature) => (
    <div
      key={feature.id}
      className="bg-lightblue px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 rounded-3xl flex flex-col shadow-md"
    >
      {/* Icon Container */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-lightbg w-16 h-16 p-3 rounded-full text-darkblue flex justify-center items-center shadow-inner flex-shrink-0">
          {feature.icon}
        </div>
        <h2 className="font-poppins text-xl sm:text-2xl md:text-3xl my-4 font-medium ">
          <span className="text-darkblue">{feature.title}</span>
        </h2>
      </div>

      {/* Description */}
      <p className=" md:text-lg  text-darkclack leading-relaxed mb-8 flex-grow font-poppins text-sm sm:text-base md:text-md font-normal">
        {feature.desc}
      </p>

      {/* Button */}
      <Link to={feature.link} className="mt-auto">
        <Button
          type="button"
          variant="dark"
          size="lg"
          className="w-full whitespace-nowrap hover:cursor-pointer transform hover:scale-105 transition-transform duration-200 font-normal py-3 text-lg"
        >
          {feature.btntxt}
        </Button>
      </Link>
    </div>
  ))}
</div>
      </div>
    </>
  );
};

export default CreateAccount;
