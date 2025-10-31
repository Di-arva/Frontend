import Button from "./Button";
import { useState, useEffect } from "react";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  // URL for DB Server
const SERVER_BASE = import.meta.env.VITE_SERVER_BASE_URL || "";

  useEffect(() => {
    if (submitStatus.message) {
      const timer = setTimeout(() => {
        setSubmitStatus({ type: "", message: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleContact = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    const formData = new FormData(e.target);
    const data = {
      firstname: formData.get("firstname"),
      lastname: formData.get("lastname"),
      email: formData.get("emailid"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch(`${SERVER_BASE}send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Remove process.env from frontend, handle this in backend
          name: `${data.firstname} ${data.lastname}`,
          email: data.email,
          phone: data.phone,
          message: data.message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setSubmitStatus({
        type: "success",
        message: "Thank you for your message! We will get back to you soon.",
      });

      e.target.reset();
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitStatus({
        type: "error",
        message: error.message || "Sorry, there was an error sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contactus" className="my-20 px-4 md:px-8 lg:px-20">
      <h2 className="text-darkblue font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold">
        Contact
      </h2>
      <p className="font-poppins w-full md:w-4/5 lg:w-2/3 mt-4 text-darkblack text-sm sm:text-base md:text-lg">
        Email, call or complete the form to learn how
        <span className="text-darkblue font-semibold text-base sm:text-lg mx-2">
          Di'arva
        </span>
        can help you.
      </p>

      <div className="bg-lightblue w-full max-w-4xl rounded-3xl mt-6 px-6 sm:px-10 py-6 mx-auto shadow-md">
        <h3 className="text-darkblue font-poppins text-2xl sm:text-3xl md:text-4xl font-medium">
          Get In Touch
        </h3>
        <p className="mt-2 text-sm sm:text-base">You can reach us at anytime</p>

        <form onSubmit={handleContact} className="font-poppins mt-4">
          {/* First & Last name row */}
          <div className="flex flex-col sm:flex-row gap-4 py-4">
            <div className="flex flex-col flex-1">
              <label
                htmlFor="firstname"
                className="text-darkblack text-sm mb-1 px-3"
              >
                First Name
              </label>
              <input
                className="border border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold placeholder:text-sm"
                type="text"
                name="firstname"
                id="firstname"
                placeholder="John"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="flex flex-col flex-1">
              <label
                htmlFor="lastname"
                className="text-darkblack text-sm mb-1 px-3"
              >
                Last Name
              </label>
              <input
                className="border border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold placeholder:text-sm"
                type="text"
                name="lastname"
                id="lastname"
                placeholder="Smith"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col mt-2">
            <label
              htmlFor="emailid"
              className="text-darkblack text-sm mb-1 px-3"
            >
              Email
            </label>
            <input
              className="border w-full border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold placeholder:text-sm"
              type="email"
              name="emailid"
              id="emailid"
              placeholder="john@smith.com"
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col mt-4">
            <label htmlFor="phone" className="text-darkblack text-sm mb-1 px-3">
              Phone Number
            </label>
            <input
              className="border w-full border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold placeholder:text-sm"
              type="tel"
              name="phone"
              id="phone"
              placeholder="+11231231234"
              pattern="^\+1\d{10}$"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Message */}
          <div className="flex flex-col mt-4">
            <label
              htmlFor="message"
              className="text-darkblack text-sm mb-1 px-3"
            >
              Message
            </label>
            <textarea
              className="border resize-none w-full h-32 sm:h-40 border-darkblue rounded-3xl text-sm p-4 text-darkblue font-semibold placeholder:text-sm"
              name="message"
              id="message"
              placeholder="Ask your questions here"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Buttons */}
          <Button
            type="submit"
            variant="dark"
            size="lg"
            className="mt-4 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </Button>

          <p className="text-xs sm:text-sm text-darkblack px-2 sm:px-4 mt-4 py-2">
            By contacting us you agree to our
            <span className="text-darkblue font-semibold ml-1">T&C</span> and
            <span className="text-darkblue font-semibold ml-1">
              Privacy Policy
            </span>
          </p>
        </form>

        {submitStatus.message && (
          <div
            className={`mt-6 p-4 font-poppins text-md font-medium rounded-2xl text-center border border-darkblue ${
              submitStatus.type === "error"
                ? "text-red-700 border-red-700 bg-red-50"
                : "text-darkblue border-darkblue bg-lightblue"
            }`}
          >
            {submitStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;