import Workflow from "../assets/workflow.png";

const About = () => {
  return (
    <div id="aboutus" className="my-20 flex flex-col px-4 md:px-8 lg:px-20">
      {/* Heading */}
      <h2 className="text-darkblue font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold">
        About
      </h2>

      {/* Intro paragraph */}
      <p className="font-poppins w-full md:w-4/5 lg:w-2/3 xl:w-1/2 mt-4 md:mt-6 text-darkblack text-sm sm:text-base md:text-lg leading-relaxed">
        At{" "}
        <span className="text-darkblue font-semibold text-base sm:text-lg md:text-xl">
          Di’arva Healthcare Staffing Agency
        </span>
        , we specialize in providing high-quality temporary staffing solutions
        for dental practices, home care providers, and physiotherapy clinics.
      </p>

      {/* Content card */}
      <div className="bg-lightblue mt-10 p-6 sm:p-10 lg:p-16 flex flex-col items-center text-center rounded-3xl shadow-md">
        {/* Image on top - bigger now */}
        <img
          src={Workflow}
          alt="Workflow illustration"
          className="w-[90%] sm:w-[85%] md:w-[80%] lg:w-[700px] xl:w-[750px] max-w-[800px] object-contain mb-10 transition-all duration-300"
        />

        {/* Text below image */}
        <p className="font-poppins text-sm sm:text-base md:text-lg leading-relaxed text-left w-full md:w-1/2 text-darkblack">
          Our mission is to deliver exceptional healthcare professionals who
          uphold the highest standards of care and reliability. We understand
          the critical importance of continuity, trust, and professionalism in
          patient care. That’s why we carefully vet and match our staff to
          ensure they not only meet clinical expectations but also align with
          each clinic’s values and culture. Whether it’s filling a last minute
          shift or supporting long term staffing needs, we are committed to
          being a dependable partner for healthcare providers. With a focus on
          quality, integrity, and trust, we help clinics maintain smooth
          operations and deliver outstanding care every day.
        </p>
      </div>
    </div>
  );
};

export default About;
