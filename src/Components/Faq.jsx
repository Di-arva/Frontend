import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const faqs = [
  {
    question: "What is Di'arva Healthcare?",
    answer:
      "Di'arva Healthcare is a staffing solution agency that connects clinics and healthcare professionals quickly and efficiently.",
  },
  {
    question: "Do you provide urgent staffing?",
    answer:
      "Yes, we specialize in urgent staffing requests and can provide certified professionals on short notice.",
  },
  {
    question: "Can you support multiple languages?",
    answer:
      "Absolutely! Our team can provide support in more than 3 languages to better serve diverse communities.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  function toggleFAQ(index) {
    setOpenIndex(openIndex === index ? null : index);
  }
  return (
    <div>
      <h2 className="text-darkblue font-poppins text-7xl font-semibold">FAQ</h2>
      <p className="font-poppins w-1/2 ml-2 mt-6 text-darkblack">
        Find your general answers here
      </p>
      <p className="mt-1/2 ml-2 text-base">You can reach us at anytime</p>

      {faqs.map((faq, index) => (
        <div className="bg-lightblue w-108  rounded-3xl mt-6 px-8 py-6 flex flex-col">
          <div className="flex">
            <button
              onClick={() => toggleFAQ(index)}
              className="mr-2 text-darkblue hover:cursor-pointer flex gap-2 items-center"
            >
              <span className="ml-2 text-darkblue">
                {openIndex === index ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </span>
              <p className="text-darkblue font-poppins text-md font-medium">
                {faq.question}
              </p>
            </button>
          </div>
          <div
            className={`overflow-hidden transition-all duration-500 ${
              openIndex === index ? "max-h-40 p-4 pt-0" : "max-h-0 p-0"
            }`}
          >
            <p className="text-darkblack font-poppins text-sm px-4 mx-1 my-1  font-base ">
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Faq;
