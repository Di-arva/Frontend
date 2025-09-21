import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const faqs = [
  {
    id: 1,
    question: "What types of healthcare professionals do you provide?",
    answer:
      "We provide qualified and pre-screened temporary staff including dental hygienists, dental assistants, home care aides, personal support workers (PSWs), physiotherapists, physiotherapy assistants, and other allied health professionals.",
  },
  {
    id: 2,
    question: "What types of facilities do you work with?",
    answer:
      "We serve a variety of healthcare providers including dental clinics, home care agencies, private home care clients, and physiotherapy clinics.",
  },
  {
    id: 3,
    question: "How do you ensure the quality of your temp staff?",
    answer:
      "All our professionals undergo a rigorous screening process, including license verification, reference checks, background checks, and skills assessments. We only work with staff who demonstrate professionalism, competence, and a commitment to patient care.",
  },
  {
    id: 4,
    question: "How quickly can you fill a staffing request?",
    answer:
      "We offer both same-day and scheduled staffing services. Depending on availability and your needs, we can often fill urgent requests within hours.",
  },
  {
    id: 5,
    question: "Are your staff insured and licensed?",
    answer:
      "Yes, all our professionals hold the required licenses, certifications, and liability insurance appropriate for their role and province.",
  },
  {
    id: 6,
    question: "Do you offer both short-term and long-term staffing?",
    answer:
      "Yes, we provide flexible staffing solutions — from single-day coverage to long-term or recurring placements.",
  },
  {
    id: 7,
    question: "How does your matching process work?",
    answer:
      "We take the time to understand your clinic’s specific needs and culture. Our team then matches you with a professional whose skills and personality align with your environment and requirements.",
  },
  {
    id: 8,
    question: "What areas do you serve?",
    answer:
      "We currently serve [insert your geographic service area here, e.g., “Toronto and surrounding areas”]. If you're outside this area, please contact us — we may still be able to assist.",
  },
  {
    id: 9,
    question: "How much notice is required to request a temp staff member?",
    answer:
      "While we can often accommodate same-day requests, we recommend providing as much notice as possible to ensure the best match for your clinic.",
  },
  {
    id: 10,
    question: "How are your services billed?",
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
    question: "What makes your agency different from others?",
    answer:
      "We focus on quality, trust, and reliability. Our hands-on vetting process, client-focused service, and deep understanding of healthcare settings ensure we provide staff you can count on — every time.",
  },
  {
    id: 13,
    question: "How do I get started with your staffing services?",
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
    <div id="faq" className="my-20">
      <h2 className="text-darkblue font-poppins text-7xl font-semibold">FAQ</h2>
      <p className="font-poppins w-1/2 ml-2 mt-6 text-darkblack">
        Find your general answers here
      </p>
      <p className="mt-1/2 ml-2 text-base">You can reach us at anytime</p>

      {faqs.map((faq, index) => (
        <div
          key={faq.id}
          className="bg-lightblue w-108  rounded-3xl mt-6 px-8 py-6 flex flex-col"
        >
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
