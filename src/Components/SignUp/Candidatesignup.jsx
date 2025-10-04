import Marklogo from "../../assets/Diarva_mark.png";
import Button from "../Button";
const Candidatesignup = () => {
  return (
    <div>
      <div className="flex min-h-full flex-col justify-center px-6 py-8 lg:px-8 bg-lightblue font-poppins">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            src={Marklogo}
            alt="Diarva Mark Logo"
            className="mx-auto h-20 w-auto "
          />
          <h2 className="mt-10 text-center text-2xl/9 font-semibold tracking-tight text-darkblack">
            Register as Candidate
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            <div>
              <label
                for="name"
                className="block text-sm/6 font-medium text-gray-900 "
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="John Smith"
                  required
                  autocomplete="name"
                  className="block w-full rounded-full  px-3 py-1.5 text-base text-darkblue outline-1 -outline-offset-1 outline-darkblue  focus:outline-2 focus:-outline-offset-2 focus:outline-darkblue sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <label
                for="email"
                className="block text-sm/6 font-medium text-gray-900 "
              >
                Email Address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="john@smith.com"
                  required
                  autocomplete="email"
                  className="block w-full rounded-full  px-3 py-1.5 text-base text-darkblue outline-1 -outline-offset-1 outline-darkblue  focus:outline-2 focus:-outline-offset-2 focus:outline-darkblue sm:text-sm/6"
                />
                <p className="text-sm text-darkblue mt-2 font-poppins font-medium ml-2">
                  *We will send OTP on this email address
                </p>
              </div>
            </div>
            <div className="flex flex-col mt-4">
              <label
                htmlFor="phone"
                className="text-darkblack text-sm mb-1 px-3"
              >
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
              />
              <p className="text-sm text-darkblue mt-2 font-poppins font-medium ml-2">
                *We will send OTP on this phone number
              </p>
            </div>

            <div>
              <label
                for="address"
                className="block text-sm/6 font-medium text-gray-900 "
              >
                Address
              </label>
              <div className="mt-2">
                <input
                  id="address"
                  type="text"
                  name="address"
                  placeholder="60 Fredrick street"
                  required
                  autocomplete="address"
                  className="block w-full rounded-full  px-3 py-1.5 text-base text-darkblue outline-1 -outline-offset-1 outline-darkblue  focus:outline-2 focus:-outline-offset-2 focus:outline-darkblue sm:text-sm/6"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col flex-1">
                <label
                  for="postalcode"
                  className="block text-sm/6 font-medium text-gray-900 "
                >
                  Postal code
                </label>
                <div>
                  <input
                    id="postalcode"
                    type="text"
                    name="zipcode"
                    placeholder="N2H 0C7"
                    required
                    autocomplete="zipcode"
                    className="block w-full rounded-full  px-3 py-1.5 text-base text-darkblue outline-1 -outline-offset-1 outline-darkblue  focus:outline-2 focus:-outline-offset-2 focus:outline-darkblue sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="flex flex-col flex-1">
                <label
                  htmlFor="province"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Province
                </label>
                <input
                  className="border border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold placeholder:text-sm"
                  type="text"
                  name="province"
                  id="province"
                  placeholder="ON"
                  autoComplete="province"
                  required
                />
              </div>
            </div>
            <div>
              <label
                for="country"
                className="block text-sm/6 font-medium text-gray-900 "
              >
                Country
              </label>
              <div className="mt-2">
                <input
                  id="country"
                  type="text"
                  name="country"
                  placeholder="Canada"
                  required
                  autocomplete="address"
                  className="block w-full rounded-full  px-3 py-1.5 text-base text-darkblue outline-1 -outline-offset-1 outline-darkblue  focus:outline-2 focus:-outline-offset-2 focus:outline-darkblue sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <Button
                type="submit"
                variant="dark"
                size="lg"
                className="mb-4 w-full"
              >
                Sign Up
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Candidatesignup;
