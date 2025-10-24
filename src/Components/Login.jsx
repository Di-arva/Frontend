import { useState } from "react";
import Marklogo from "../assets/icons/Dashboard.png";
import Button from "./Button";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setError("");
  
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: email,
            password: password,
          }),
        }
      );
  
      const data = await response.json();
  
      // Check for failure in response
      if (data?.success === false || !response.ok) {
        throw new Error(data?.message || "Invalid email or password");
      }
      
      // Success - store token and user data
      if (data?.data?.accessToken) {
        localStorage.setItem("authToken", data.data.accessToken);
        
        // Store user role for future reference (optional)
        if (data?.data?.user?.role) {
          localStorage.setItem("userRole", data.data.user.role);
        }
        
        // Redirect based on role
        const userRole = data?.data?.user?.role;
        
        if (userRole === "admin") {
          navigate("/admin");
        } else if (userRole === "clinic") {
          navigate("/clinic");
        } else {
          // Default fallback for other roles (like "candidate")
          navigate("/candidate");
        }
      } else {
        throw new Error("Authentication failed. No access token received.");
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="my-6 md:my-10 lg:my-10 px-8 md:px-8 lg:px-20">
        <h2 className="text-darkblue font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold">
          Login
        </h2>
        <p className="font-poppins w-full md:w-4/5 lg:w-2/3 mt-1 text-darkblack text-sm  sm:text-base md:text-lg md:ml-2">
          Login to access
          <span className="text-darkblue font-semibold text-base sm:text-lg mx-2">
            Di'arva
          </span>
          dashboard
        </p>
      </div>
      <div>
        <div className="flex min-h-full flex-col justify-center px-6 mb-12 lg:px-8 md:py-8  font-poppins">
          <div className="bg-lightblue w-full max-w-4xl rounded-3xl mt-2 px-6 sm:px-10 py-6 mx-auto shadow-md">
            <div className="bg-lightbg h-20 w-20 rounded-full flex items-center justify-center mb-4">
              <img
                src={Marklogo}
                alt="Diarva Mark Logo"
                className="bg-lightbg h-20 rounded-full w-auto "
              />
            </div>
            <h3 className="text-darkblue font-poppins text-2xl sm:text-3xl md:text-4xl font-medium">
              Dashboard Login
            </h3>
            <p className="mt-2 mb-8 text-sm sm:text-base">
              Login into dashboard for more access
            </p>

            {/* Form Begins */}
            <div className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-darkblack text-sm mb-1 px-3 "
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@smith.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 outline-darkblue focus:outline-2 sm:text-sm/6"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1 px-3">
                  <label
                    htmlFor="password"
                    className="block text-darkblack text-sm"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-darkblue text-sm hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 outline-darkblue focus:outline-2 sm:text-sm/6"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-darkblue"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5  text-darkblue hover:cursor-pointer" />
                    ) : (
                      <Eye className="w-5 h-5  text-darkblue hover:cursor-pointer" />
                    )}
                  </button>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-darkblue text-white px-4 py-2 rounded-full w-full mt-4 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
