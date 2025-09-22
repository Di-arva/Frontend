import Multilingual from "../assets/icons/Multilingual.png";
import Piggybank from "../assets/icons/Piggybank.png";
import Approve from "../assets/icons/Approve.png";
import Sevendays from "../assets/icons/Sevendays.png";
import Dashboard from "../assets/icons/Dashboard.png";

export default function Features() {
  const features = [
    {
      id: 1,
      icon: `${Multilingual}`,
      title1: "Multilingual",
      title2: "Support",
      desc: (
        <>
          Services available in{" "}
          <span className="text-darkblue m-1">
            English, हिन्दी, ગુજરાતી, ਪੰਜਾਬੀ & Polski
          </span>
          languages to ensure comfort and clear communication.
        </>
      ),
    },
    {
      id: 2,
      icon: `${Dashboard}`,
      title1: "Smart",
      title2: "Dashboard",
      desc: "Practices can request shifts, professionals can apply, and approvals happen in a few clicks.",
    },
    {
      id: 3,
      icon: `${Piggybank}`,
      title1: "Affordable",
      title2: "Pricing",
      desc: "Competitive pricing with no hidden fees. Save more by hiring from us compared to hiring from others.",
    },
    {
      id: 4,
      icon: `${Sevendays}`,
      title1: "7 Days",
      title2: "Availability",
      desc: "Whether it’s a last-minute staffing need or an emergency care request at home, we got you covered.",
    },
    {
      id: 5,
      icon: `${Approve}`,
      title1: "Trusted",
      title2: "Professionals",
      desc: "Certified health care professionals are trained to provide safe, reliable, and personalized care.",
    },
  ];

  return (
    <div id="features" className="my-20 px-4 md:px-8 lg:px-20">
      <h2 className="text-darkblue font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold">
        Features
      </h2>
      <p className="font-poppins w-full md:w-4/5 lg:w-2/3 xl:w-1/2 mt-4 md:mt-6 text-darkblack text-sm sm:text-base md:text-lg leading-relaxed">
        Because your time matters and care can’t wait, our platform ensures
        trusted professionals are always just a click away.
      </p>

      <div className="mt-10 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-lightblue px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 rounded-3xl flex flex-col shadow-md"
          >
            <div className="bg-lightbg w-14 h-14 p-2 rounded-full flex justify-center items-center shadow-inner">
              <img
                className="w-10 h-10"
                src={feature.icon}
                alt={feature.title}
              />
            </div>
            <h2 className="font-poppins text-xl sm:text-2xl md:text-3xl my-4 font-medium text-darkblack">
              <span className="block">{feature.title1}</span>
              <span className="text-darkblack">{feature.title2}</span>
            </h2>
            <p className="font-poppins text-sm sm:text-base md:text-md font-normal">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
