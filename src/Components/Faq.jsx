import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const faqs = [
  {
    id: 1,
    question: "What types of healthcare professionals do we provide?",
    answer:
      "We provide qualified and pre screened temporary staff including dental hygienists, dental assistants, home care aides, personal support workers (PSWs), physiotherapists, physiotherapy assistants, and other allied health professionals.",
  },
  {
    id: 2,
    question: "What types of facilities do we work with?",
    answer:
      "We serve a variety of healthcare providers including dental clinics, home care agencies, private home care clients, and physiotherapy clinics.",
  },
  {
    id: 3,
    question: "How do we ensure the quality of our temp staff?",
    answer:
      "All our professionals undergo a rigorous screening process, including license verification, reference checks, background checks, and skills assessments. We only work with staff who demonstrate professionalism, competence, and a commitment to patient care.",
  },
  {
    id: 4,
    question: "How quickly can we fill a staffing request?",
    answer:
      "We offer both same day and scheduled staffing services. Depending on availability and your needs, we can often fill urgent requests within hours.",
  },
  {
    id: 5,
    question: "Is Di'arva staff insured and licensed?",
    answer:
      "Yes, all our professionals hold the required licenses, certifications, and liability insurance appropriate for their role and province.",
  },
  {
    id: 6,
    question: "Do we offer both short-term and long-term staffing?",
    answer:
      "Yes, we provide flexible staffing solutions from single-day coverage to long-term or recurring placements.",
  },
  {
    id: 7,
    question: "How does our matching process work?",
    answer:
      "We take the time to understand your clinic’s specific needs and culture. Our team then matches you with a professional whose skills and personality align with your environment and requirements.",
  },
  {
    id: 8,
    question: "What areas do we serve?",
    answer:
      "We currently serve Ontario region. If you're outside this area, please contact us we may still be able to assist.",
  },
  {
    id: 9,
    question:
      "How much notice period is required to request a temp staff member?",
    answer:
      "While we can often accommodate same day requests, we recommend providing as much notice as possible to ensure the best match for your clinic.",
  },
  {
    id: 10,
    question: "How are our services billed?",
    answer:
      "We offer transparent, competitive pricing with hourly or daily rates depending on the role and shift length. Detailed invoices are provided for each placement.",
  },
  {
    id: 11,
    question: "Can I request the same staff member again?",
    answer:
      "Absolutely. If a staff member is a great fit, we’ll do our best to place them with you again for future shifts or ongoing needs.",
  },
  {
    id: 12,
    question: "What makes our agency different from others?",
    answer:
      "We focus on quality, trust, and reliability. Our hands-on vetting process, client-focused service, and deep understanding of healthcare settings ensure we provide staff you can count on every time.",
  },
  {
    id: 13,
    question: "How do I get started with our staffing services?",
    answer:
      "Simply contact us via phone, email, or our online request form. One of our staffing coordinators will follow up to discuss your needs and begin the matching process.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  function toggleFAQ(index) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <div id="faq" className="my-20 px-4 md:px-8 lg:px-20">
      <h2 className="text-darkblue font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold">
        FAQ
      </h2>
      <p className="font-poppins w-full md:w-4/5 lg:w-3/4 xl:w-2/3 mt-4 text-darkblack text-sm sm:text-base md:text-lg">
        Find your general answers here. You can reach us at anytime
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className="bg-lightblue w-full max-w-4xl rounded-3xl mx-auto px-6 sm:px-8 py-4 sm:py-6 flex flex-col shadow-md"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="flex gap-2 items-center text-left w-full text-darkblue hover:cursor-pointer"
            >
              <span className="text-lg">
                {openIndex === index ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </span>
              <p className="font-poppins text-sm sm:text-base md:text-lg font-medium">
                {faq.question}
              </p>
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 ${
                openIndex === index ? "max-h-96 mt-3" : "max-h-0"
              }`}
            >
              <p className="text-darkblack font-poppins text-sm sm:text-base px-1 sm:px-4">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
