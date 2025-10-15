import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  AlertCircle,
  Circle,
} from "lucide-react";
import Marklogo from "../../assets/icons/Dashboard.png";

export default function SetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Extract token from URL
  const getTokenFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
  };

  // Check individual password requirements
  const checkRequirements = () => {
    return {
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      passwordsMatch:
        password === confirmPassword &&
        password !== "" &&
        confirmPassword !== "",
    };
  };

  const requirements = checkRequirements();

  // Password validation
  const validatePassword = () => {
    if (!password) {
      return "Password is required";
    }
    if (!requirements.minLength) {
      return "Password must be at least 8 characters";
    }
    if (!requirements.hasNumber) {
      return "Password must include at least one number";
    }
    if (!requirements.hasSpecialChar) {
      return "Password must include at least one special character";
    }
    if (!requirements.hasUpperCase) {
      return "Password must include at least one uppercase letter";
    }
    if (!requirements.hasLowerCase) {
      return "Password must include at least one lowercase letter";
    }
    if (!requirements.passwordsMatch) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password
    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Get token from URL
    const token = getTokenFromUrl();
    if (!token) {
      setError("Invalid or missing token");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5173/auth/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setError(data.message || "Failed to set password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Password Set Successfully!
          </h2>
          <p className="text-gray-600">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="my-6 md:my-10 lg:my-10 px-8 md:px-8 lg:px-20">
        <h2 className="text-darkblue font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold">
          Reset Password
        </h2>
        <p className="font-poppins w-full md:w-4/5 lg:w-2/3 mt-1 text-darkblack text-sm  sm:text-base md:text-lg md:ml-2">
          Reset your password at
          <span className="text-darkblue font-semibold text-base sm:text-lg mx-2">
            Di'arva
          </span>
          to protect your data
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
              Create Password
            </h3>
            <p className="mt-2 mb-8 text-sm sm:text-base">
              Create strong password for your account
            </p>

            {/* Form Begins */}

            <div className="space-y-6">
              <div>
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}
                <label
                  htmlFor="password"
                  className="block text-darkblack text-sm mb-1 px-3"
                >
                  New Password
                </label>
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
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-darkblack text-sm mb-1 px-3"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="flex-1 w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 outline-darkblue focus:outline-2 sm:text-sm/6"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-darkblue "
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5  text-darkblue hover:cursor-pointer" />
                    ) : (
                      <Eye className="w-5 h-5  text-darkblue hover:cursor-pointer" />
                    )}
                  </button>
                </div>
              </div>
              {/* Submit Button */}
              <div>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  type="button"
                  className="bg-darkblue text-white px-4 py-2 rounded-full w-full mt-4"
                >
                  {loading ? "Setting Password..." : "Set Password"}
                </button>
              </div>

              <div className="bg-lightbg/50 rounded-2xl font-poppins p-4 text-sm text-darkblue">
                <p className="font-medium mb-2">Password Requirements:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    {requirements.minLength ? (
                      <CheckCircle className="w-5 h-5 text-darkblue flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-darkblue flex-shrink-0" />
                    )}
                    <span
                      className={requirements.minLength ? "text-darkblue" : ""}
                    >
                      At least 8 characters long
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    {requirements.hasNumber ? (
                      <CheckCircle className="w-5 h-5 text-darkblue flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-darkblue flex-shrink-0" />
                    )}
                    <span
                      className={requirements.hasNumber ? "text-darkblue" : ""}
                    >
                      Include at least one number (0-9)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    {requirements.hasSpecialChar ? (
                      <CheckCircle className="w-5 h-5 text-darkblue flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-darkblue flex-shrink-0" />
                    )}
                    <span
                      className={
                        requirements.hasSpecialChar ? "text-darkblue" : ""
                      }
                    >
                      Include at least one special character (e.g., !@#$%^&*)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    {requirements.hasUpperCase ? (
                      <CheckCircle className="w-5 h-5 text-darkblue flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-darkblue flex-shrink-0" />
                    )}
                    <span
                      className={
                        requirements.hasUpperCase ? "text-darkblue" : ""
                      }
                    >
                      Include at least one uppercase letter
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    {requirements.hasLowerCase ? (
                      <CheckCircle className="w-5 h-5 text-darkblue flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-darkblue flex-shrink-0" />
                    )}
                    <span
                      className={
                        requirements.hasLowerCase ? "text-darkblue" : ""
                      }
                    >
                      Include at least one lowercase letter
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    {requirements.passwordsMatch ? (
                      <CheckCircle className="w-5 h-5 text-darkblue flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-darkblue flex-shrink-0" />
                    )}
                    <span
                      className={
                        requirements.passwordsMatch ? "text-darkblue" : ""
                      }
                    >
                      Both password fields must match
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
