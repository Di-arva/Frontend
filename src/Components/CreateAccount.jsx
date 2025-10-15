import { Building2,Users,Cross} from "lucide-react";
import Button from "./Button";
const CreateAccount = () => {
  const features = [
    {
      id: 1,
      icon: <Building2/>,
      title: "Office Signup",
      desc: "Register your clinic to hire flex staff and professional",
      btntxt: "Office Sign Up"
    },
    {
      id: 2,
      icon: <Cross />,
      title: "Candidate Signup",
      desc: "Our platform ensures consistent and dependable service.",
      btntxt: "Candidate Sign Up"
    },
    {
      id: 3,
      icon: <Users />,
      title: "Family / Individual Signup",
      desc: "Schedule appointments easily with just a few clicks.",
      btntxt: "Individual Sign Up"
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
   

        <div className="mt-10 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-lightblue px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 rounded-3xl flex flex-col shadow-md"
            >
              <div className="bg-lightbg w-14 h-14 p-2 rounded-full text-darkblue flex justify-center items-center shadow-inner">
                {feature.icon}
              </div>
              <h2 className="font-poppins text-xl sm:text-2xl md:text-3xl my-4 font-medium text-darkblack">
              <span className="text-darkblue">{feature.title}</span>
               
              </h2>
              <p className="font-poppins text-sm sm:text-base md:text-md font-normal">
                {feature.desc}
              </p>
              <Button
  type="button"
  variant="dark"
  size="md"
  

  className="whitespace-nowrap hover:cursor-pointer mt-2"
>
{feature.btntxt}
</Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CreateAccount;
