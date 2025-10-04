import Button from "../Button";
import Marklogo from "../../assets/Diarva_mark.png";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

const Officesignup = () => {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-8 lg:px-8 bg-lightblue font-poppins">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          src={Marklogo}
          alt="Diarva Mark Logo"
          className="mx-auto h-20 w-auto "
        />
        <h2 className="mt-10 text-center text-2xl/9 font-semibold tracking-tight text-darkblack">
          Register as Dental Clinic
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" className="space-y-6">
          <div>
            <label
              for="name"
              className="block text-sm/6 font-medium text-gray-900 "
            >
              Clinic Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                type="text"
                name="name"
                placeholder="John Dental Clinic"
                required
                autocomplete="email"
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
            </div>
          </div>

          <div></div>

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
  );
};

export default Officesignup;
