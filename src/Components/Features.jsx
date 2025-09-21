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
      title: "Multilingual Support",
      desc: (
        <>
          Services available in{" "}
          <span className="text-darkblue m-1">
            English, हिन्दी, ਪੰਜਾਬੀ & Polski
          </span>
          languages to ensure comfort and clear communication.
        </>
      ),
    },
    {
      id: 2,
      icon: `${Dashboard}`,
      title: "Smart Dashboard",
      desc: "Practices can request shifts, professionals can apply, and approvals happen in a few clicks.",
    },
    {
      id: 3,
      icon: `${Piggybank}`,
      title: "Affordable Pricing",
      desc: "Competitive pricing with no hidden fees. Save more by hiring from us compared to hiring from others.",
    },
    {
      id: 4,
      icon: `${Sevendays}`,
      title: "7 Days Availability",
      desc: "Whether it’s a last-minute staffing need or an emergency care request at home, we got you covered.",
    },
    {
      id: 5,
      icon: `${Approve}`,
      title: "Trusted Professionals",
      desc: "Certified health care professionals are trained to provide safe, reliable, and personalized care.",
    },
  ];

  return (
    <div id="features" className="my-20">
      <h2 className="text-darkblue font-poppins text-7xl font-semibold">
        Features
      </h2>
      <p className="font-poppins w-1/2  ml-2 mt-6 text-darkblack">
        Because your time matters and care can’t wait, our platform ensures
        trusted professionals are always just a click away.
      </p>
      <div className="flex gap-8 flex-wrap">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-lightblue px-6 py-4 w-76 h-80 rounded-4xl flex flex-col mt-2"
          >
            <div className="bg-lightbg w-14  p-2 rounded-full flex justify-center shadow-inner ">
              <img className="w-14 " src={feature.icon} alt="" />
            </div>
            <h2 className="font-poppins text-4xl w-1/2 my-4 font-medium text-darkblack">
              {feature.title}
            </h2>
            <p className="font-poppins text-md font-normal ">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
