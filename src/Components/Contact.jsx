import Button from "./Button";

const Contact = () => {
  return (
    <div id="contactus" className="my-20">
      <h2 className="text-darkblue font-poppins text-7xl font-semibold">
        Contact
      </h2>
      <p className="font-poppins w-1/2 ml-2 mt-6 text-darkblack">
        Email, call or complete the form to learn how
        <span className="text-darkblue font-semibold text-lg">Di’arva </span>can
        help you.
      </p>

      <div className="bg-lightblue w-108  rounded-3xl mt-6 px-10 py-6">
        <h3 className="text-darkblue font-poppins text-4xl font-medium">
          Get In Touch
        </h3>
        <p className="mt-1/2 ml-2 text-base">You can reach us at anytime</p>
        <form className="font-poppins">
          <div className="flex py-4">
            <div className="flex flex-col">
              <label
                htmlFor="firstname"
                className="text-darkblack text-sm mb-1 px-3"
              >
                First Name{" "}
              </label>
              <input
                className="border mr-4 w-42 border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold  placeholder:text-sm"
                type="text"
                name="firstname"
                id="firstname"
                placeholder="John"
                required
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="lastname"
                className="text-darkblack text-sm mb-1 px-3"
              >
                Last Name
              </label>
              <input
                className="border w-42 border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold  placeholder:text-sm"
                type="text"
                name="lastname"
                id="lastname"
                placeholder="Smith"
                required
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="emailid"
              className="text-darkblack text-sm mb-1 px-3"
            >
              Email
            </label>
            <input
              className="border w-full border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold  placeholder:text-sm"
              type="email"
              name="emailid"
              id="emailid"
              placeholder="john@smith.com"
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              required
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="phone" className="text-darkblack text-sm mb-1 px-3">
              Phone Number
            </label>
            <input
              className="border w-full border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold  placeholder:text-sm"
              type="tel"
              name="phone"
              id="phone"
              placeholder="+1-123-123-1234"
              pattern="\+1-\d{3}-\d{3}-\d{4}"
              required
            />
          </div>
          <div className="flex flex-col mt-4">
            <label
              htmlFor="message"
              className="text-darkblack text-sm mb-1 px-3"
            >
              Message
            </label>
            <textarea
              className="border resize-none w-full h-40 border-darkblue rounded-3xl text-sm p-4 text-darkblue font-semibold  placeholder:text-sm "
              name="message"
              id="message"
              placeholder="Ask your questions here"
              required
            />
          </div>
          <button
            className="bg-darkblue w-full text-sm  text-lightbg font-poppins p-2 rounded-4xl mt-4 cursor-pointer"
            aria-label="Send"
          >
            Send
          </button>
          <Button variant="dark" size="lg" className="mt-4">
            Send
          </Button>
          <p className="text-sm text-darkblack px-4 mt-4 py-2">
            By contacting us you agree to our
            <span className="text-darkblue font-semibold">T&C</span> and{" "}
            <span className="text-darkblue font-semibold">Privacy Policy</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Contact;
