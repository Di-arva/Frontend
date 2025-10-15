import { useState, useEffect } from "react";
import Marklogo from "../../assets/icons/Dashboard.png";
import Button from "../Button";
import { postData } from "../../lib/http";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ChevronDown, AlertCircle } from "lucide-react";

const PROVINCES = [
  "AB",
  "BC",
  "MB",
  "NB",
  "NL",
  "NS",
  "ON",
  "PE",
  "QC",
  "SK",
  "NT",
  "NU",
  "YT",
];

const Officesignup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    clinicname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipcode: "",
    province: "ON",
    country: "Canada",
  });

  // OTP States
  const [emailOtp, setEmailOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailToken, setEmailToken] = useState("");
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [verifyingEmailOtp, setVerifyingEmailOtp] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpTimer, setEmailOtpTimer] = useState(0);
  const [emailOtpError, setEmailOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Timer countdown for resend OTP
  useEffect(() => {
    if (emailOtpTimer > 0) {
      const interval = setInterval(() => {
        setEmailOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [emailOtpTimer]);

  const handleSendEmailOtp = async () => {
    setMsg({ type: "", text: "" });
    setEmailOtpError("");

    if (!form.email) {
      return setMsg({ type: "error", text: "Enter email first." });
    }

    setSendingEmailOtp(true);
    try {
      await postData("/auth/otp/send", {
        channel: "email",
        identifier: form.email.trim(),
      });
      setMsg({ type: "success", text: "Email OTP sent successfully." });
      setEmailOtpSent(true);
      setEmailOtpTimer(60);
    } catch (err) {
      setMsg({
        type: "error",
        text:
          err?.response?.data?.message ||
          err.message ||
          "Failed to send email OTP",
      });
    } finally {
      setSendingEmailOtp(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    setEmailOtpError("");
    setMsg({ type: "", text: "" });

    if (!emailOtp.trim()) {
      return setMsg({ type: "error", text: "Enter the email OTP." });
    }

    setVerifyingEmailOtp(true);
    try {
      const res = await postData("/auth/verify-otp", {
        channel: "email",
        identifier: form.email.trim(),
        code: emailOtp.trim(),
      });

      const token = res?.data?.token;
      if (!token) throw new Error("OTP verification failed");

      setEmailVerified(true);
      setEmailToken(token);
      setEmailOtpError("");
      setMsg({ type: "success", text: "Email verified successfully." });
    } catch (err) {
      setEmailVerified(false);
      setEmailToken("");
      setEmailOtpError(
        err?.response?.data?.message ||
          err.message ||
          "Email OTP verification failed"
      );
      setMsg({
        type: "error",
        text:
          err?.response?.data?.message ||
          err.message ||
          "Email OTP verification failed",
      });
    } finally {
      setVerifyingEmailOtp(false);
    }
  };

  const validate = () => {
    const phoneRe = /^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/;
    const postalRe = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

    if (!form.clinicname.trim()) return "Please enter business name.";
    if (!form.email.trim()) return "Please enter email address.";
    if (!emailVerified) return "Please verify your email address.";
    if (!form.phone.trim()) return "Please enter phone number.";
    if (!phoneRe.test(form.phone))
      return "Invalid Canadian phone number format.";
    if (!form.address.trim()) return "Address is required.";
    if (!form.city.trim()) return "City is required.";
    if (!form.zipcode.trim()) return "Postal code is required.";
    if (!postalRe.test(form.zipcode)) return "Invalid Canadian postal code.";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    const err = validate();
    if (err) {
      setMsg({ type: "error", text: err });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        business_name: form.clinicname.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        zipcode: form.zipcode.toUpperCase().replace(/\s+/g, ""),
        province: form.province,
        country: form.country,
        email_verification_token: emailToken,
      };

      const res = await postData("/auth/office/register", payload);

      if (res?.data?.success === false || res?.success === false) {
        throw new Error(
          res?.data?.message || res?.message || "Registration failed"
        );
      }

      // Success - redirect to thank you page
      navigate("/thank-you", {
        state: {
          businessName: form.clinicname.trim(),
          type: "office",
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      setMsg({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  const canRegister = emailVerified && !loading;

  return (
    <>
      <div className="my-6 md:my-10 lg:my-10 px-8 md:px-8 lg:px-20">
        <h2 className="text-darkblue font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold">
          Office SignUp
        </h2>
        <p className="font-poppins w-full md:w-4/5 lg:w-2/3 mt-1 text-darkblack text-sm sm:text-base md:text-lg md:ml-2">
          Register yourself at
          <span className="text-darkblue font-semibold text-base sm:text-lg mx-2">
            Di'arva
          </span>
          to request a staff
        </p>
      </div>

      <div>
        <div className="flex min-h-full flex-col justify-center px-6 mb-12 lg:px-8 md:py-8 font-poppins">
          <div className="bg-lightblue w-full max-w-4xl rounded-3xl mt-2 px-6 sm:px-10 py-6 mx-auto shadow-md">
            <img
              src={Marklogo}
              alt="Diarva Mark Logo"
              className="bg-lightbg h-20 rounded-full w-auto"
            />
            <h3 className="text-darkblue font-poppins text-2xl sm:text-3xl md:text-4xl font-medium">
              Register as Office
            </h3>
            <p className="mt-2 mb-8 text-sm sm:text-base">
              You can reach us at anytime at
              <a
                href="mailto:support@diarva.org"
                target="_blank"
                className="text-md font-poppins text-darkblue font-normal ml-2"
              >
                support@diarva.org
              </a>
            </p>

            {/* Form Begins */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Name */}
              <div>
                <label
                  htmlFor="clinicname"
                  className="block text-darkblack text-sm mb-1 px-3"
                >
                  Business Name
                </label>
                <div className="mt-2">
                  <input
                    id="clinicname"
                    type="text"
                    name="clinicname"
                    placeholder="Highland Dental Clinic"
                    required
                    value={form.clinicname}
                    onChange={onChange}
                    className="block w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 outline-darkblue focus:outline-2 sm:text-sm/6"
                  />
                </div>
              </div>

              {/* Email Address with OTP */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-darkblack text-sm mb-1 px-3"
                >
                  Email Address
                </label>
                <div className="mt-2 space-y-2">
                  <div className="flex gap-2">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="john@smith.com"
                      required
                      value={form.email}
                      onChange={(e) => {
                        if (!emailVerified) {
                          setEmailVerified(false);
                          setEmailToken("");
                          setEmailOtp("");
                          onChange(e);
                        }
                      }}
                      disabled={emailVerified}
                      className={`flex-1 rounded-full px-3 py-1.5 text-base text-darkblue outline-1 outline-darkblue focus:outline-2 sm:text-sm/6 ${
                        emailVerified
                          ? "opacity-50 cursor-not-allowed font-semibold"
                          : ""
                      }`}
                    />
                    <Button
                      type="button"
                      variant="dark"
                      size="sm"
                      disabled={
                        !form.email ||
                        sendingEmailOtp ||
                        emailVerified ||
                        emailOtpTimer > 0
                      }
                      onClick={handleSendEmailOtp}
                      className={`${
                        emailVerified
                          ? "opacity-50 cursor-not-allowed"
                          : "whitespace-nowrap hover:cursor-pointer"
                      }`}
                    >
                      {emailVerified
                        ? "Verified"
                        : emailOtpTimer > 0
                        ? `Resend in ${emailOtpTimer}s`
                        : sendingEmailOtp
                        ? "Sending..."
                        : "Send OTP"}
                    </Button>
                  </div>

                  {emailOtpSent && !emailVerified && (
                    <p className="text-sm font-poppins text-darkblue mt-1 font-medium ml-2">
                      OTP has been sent to your email.
                    </p>
                  )}

                  {!emailVerified && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter Email OTP"
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value)}
                        className="flex-1 rounded-full px-3 py-1.5 text-base text-darkblue outline-1 outline-darkblue focus:outline-2 sm:text-sm/6"
                      />
                      <Button
                        type="button"
                        variant="dark"
                        size="sm"
                        onClick={handleVerifyEmailOtp}
                        disabled={!emailOtp || verifyingEmailOtp}
                        className={
                          !emailOtp || verifyingEmailOtp
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }
                      >
                        {verifyingEmailOtp ? "Verifying..." : "Verify OTP"}
                      </Button>
                    </div>
                  )}

                  {emailOtpError && (
                    <p className="font-poppins text-sm text-red-700 mt-1 ml-2">
                      {emailOtpError}
                    </p>
                  )}

                  {!emailVerified ? (
                    <p className="text-sm text-darkblue mt-1 font-poppins font-medium ml-2">
                      *We will send OTP on this email address
                    </p>
                  ) : null}

                  <div className="flex items-center ml-2 gap-2">
                    {emailVerified && (
                      <CheckCircle className="w-5 h-5 text-darkblue" />
                    )}
                    <span
                      className={`text-sm ${
                        emailVerified
                          ? "text-darkblue font-medium font-poppins"
                          : "text-darkblue"
                      }`}
                    >
                      {emailVerified
                        ? "Email address is verified"
                        : "Email address is not verified"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="text-darkblack text-sm mb-1 px-3"
                >
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="+14165550123"
                    required
                    value={form.phone}
                    onChange={onChange}
                    className="w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 outline-darkblue focus:outline-2 sm:text-sm/6"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  placeholder="60 Frederick Street"
                  required
                  value={form.address}
                  onChange={onChange}
                  className="block w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 focus:outline-2 sm:text-sm/6 mt-2"
                />
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  placeholder="Toronto"
                  required
                  value={form.city}
                  onChange={onChange}
                  className="block w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 focus:outline-2 sm:text-sm/6 mt-2"
                />
              </div>

              {/* Postal Code & Province */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="zipcode"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Postal code
                  </label>
                  <input
                    id="zipcode"
                    type="text"
                    name="zipcode"
                    placeholder="M5H 2N2"
                    required
                    value={form.zipcode}
                    onChange={onChange}
                    className="block w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 focus:outline-2 sm:text-sm/6 mt-2"
                  />
                </div>
                <div className="flex-1 relative">
                  <label
                    htmlFor="province"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Province
                  </label>
                  <select
                    className="border w-full appearance-none border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold mt-2"
                    name="province"
                    id="province"
                    required
                    value={form.province}
                    onChange={onChange}
                  >
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-[60%] -translate-y-1/2 w-5 h-5 text-darkblue pointer-events-none" />
                </div>
              </div>

              {/* Country */}
              <div>
                <div className="relative">
                  <select
                    name="country"
                    value={form.country}
                    onChange={onChange}
                    className="border w-full appearance-none border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold"
                  >
                    <option value="Canada">Canada</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-darkblue pointer-events-none" />
                </div>
              </div>

              {/* Error/Success Messages */}
              {msg.text && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm flex items-start gap-3 ${
                    msg.type === "error"
                      ? "bg-red-100 text-red-700"
                      : msg.type === "info"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {msg.type === "error" && (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  {msg.type === "success" && (
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <span>{msg.text}</span>
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={!canRegister}
                  className={`bg-darkblue text-white px-4 py-2 rounded-full w-full mt-4 ${
                    !canRegister
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:opacity-80 cursor-pointer"
                  }`}
                >
                  {loading
                    ? "Submitting..."
                    : emailVerified
                    ? "Sign Up"
                    : "Verify Email to Sign Up"}
                </button>
                {!emailVerified && (
                  <p className="text-sm mt-2 text-center text-darkblue">
                    Please verify your email address to enable Signup.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Officesignup;
