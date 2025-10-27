import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, Eye, EyeOff, CheckCircle, Circle } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check individual password requirements
  const checkRequirements = () => {
    return {
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      passwordsMatch: password === confirmPassword && password !== "",
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
    setSuccess("");

    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    // Validate password using comprehensive requirements
    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Use the reset-password endpoint from your routes
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            newPassword: password,
          }),
        }
      );

      const data = await response.json();

      if (data?.success === false || !response.ok) {
        throw new Error(data?.message || "Failed to reset password");
      }

      setSuccess("Password reset successfully! Redirecting to login...");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login", { 
          replace: true,
          state: { message: "Password reset successfully! Please login with your new password." }
        });
      }, 2000);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link
              to="/forgot-password"
              className="text-darkblue hover:text-blue-700 font-medium"
            >
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Back to Login */}
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-darkblue hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Login
          </Link>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your new password below.
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-darkblue focus:border-darkblue sm:text-sm"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-darkblue focus:border-darkblue sm:text-sm"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
              <p className="font-medium mb-2">Password Requirements:</p>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  {requirements.minLength ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  <span>At least 8 characters long</span>
                </li>
                <li className="flex items-center gap-2">
                  {requirements.hasNumber ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  <span>Include at least one number (0-9)</span>
                </li>
                <li className="flex items-center gap-2">
                  {requirements.hasSpecialChar ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  <span>Include at least one special character</span>
                </li>
                <li className="flex items-center gap-2">
                  {requirements.hasUpperCase ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  <span>Include at least one uppercase letter</span>
                </li>
                <li className="flex items-center gap-2">
                  {requirements.hasLowerCase ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  <span>Include at least one lowercase letter</span>
                </li>
                <li className="flex items-center gap-2">
                  {requirements.passwordsMatch ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  <span>Both password fields must match</span>
                </li>
              </ul>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-darkblue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-darkblue disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;