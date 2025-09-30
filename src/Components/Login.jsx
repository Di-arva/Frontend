import Button from "./Button";
import Marklogo from "../assets/Diarva_mark.png";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-8 lg:px-8 bg-lightblue font-poppins">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          src={Marklogo}
          alt="Diarva Mark Logo"
          className="mx-auto h-20 w-auto "
        />
        <h2 className="mt-10 text-center text-2xl/9 font-semibold tracking-tight text-darkblack">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" className="space-y-6">
          <div>
            <label
              for="email"
              className="block text-sm/6 font-medium text-gray-900 "
            >
              Email address
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

          <div>
            <div className="flex items-center justify-between">
              <label
                for="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-darkblue hover:text-blue-800 "
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                name="password"
                placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
                required
                autocomplete="current-password"
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
              Login
            </Button>
            <Button
              type="submit"
              variant="light"
              size="lg"
              className="mt-2 w-full flex justify-center items-center"
            >
              <FcGoogle size={20} className="mr-2" />
              Sign In with Google
            </Button>
          </div>
        </form>

        <p className="mt-4 text-center  text-sm/6 text-darkblack ">
          Not a member?
          <Link
            to="/register"
            className="font-semibold ml-2  text-darkblue hover:text-blue-800"
          >
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
