import { useState, useEffect } from "react";
import Marklogo from "../../assets/icons/Dashboard.png";
import Button from "../Button";
import { postData } from "../../lib/http";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ChevronDown } from "lucide-react";

//Specialization as per levels

const LEVEL_1_SPECIALIZATIONS = [
  "Chairside Assisting",
  "Dental Radiography",
  "Infection Control",
  "Laboratory Procedures",
  "Administrative Tasks",
];

const LEVEL_2_SPECIALIZATIONS = [
  "Chairside Assisting",
  "Dental Radiography",
  "Infection Control",
  "Laboratory Procedures",
  "Administrative Tasks",
  "Preventive Dentistry",
  "Orthodontic Assisting",
  "Surgical Assisting",
  "Pediatric Assisting",
];

//Provinces Array

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

const SERVER_BASE = import.meta.env.VITE_SERVER_BASE_URL || "";

const CandidateSignup = () => {
  //Navigate Route

  const navigate = useNavigate();

  //Intial state of Form Empty

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipcode: "",
    province: "ON",
    country: "Canada",
    password: "",
    confirmPassword: "",
    certification: "level-1", // "harp" | "level-1" | "level-2"
    specialization: "",
    emergency_name: "",
    emergency_relationship: "",
    emergency_phone: "",
    emergency_email: "",
  });

  //States Definition

  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailToken, setEmailToken] = useState("");
  const [phoneToken, setPhoneToken] = useState("");
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [sendingPhoneOtp, setSendingPhoneOtp] = useState(false);
  const [verifyingEmailOtp, setVerifyingEmailOtp] = useState(false);
  const [verifyingPhoneOtp, setVerifyingPhoneOtp] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailOtpTimer, setEmailOtpTimer] = useState(0);
  const [phoneOtpTimer, setPhoneOtpTimer] = useState(0);
  const [emailOtpError, setEmailOtpError] = useState("");
  const [phoneOtpError, setPhoneOtpError] = useState("");
  const [certificateFile, setCertificateFile] = useState(null);
  const [certificateUrl, setCertificateUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  //Onchange Events

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  //specializations selection

  const availableSpecializations =
    form.certification === "level-1"
      ? LEVEL_1_SPECIALIZATIONS
      : form.certification === "level-2"
      ? LEVEL_2_SPECIALIZATIONS
      : [];

  useEffect(() => {
    if (form.certification === "harp") {
      setForm((prev) => ({ ...prev, specialization: "" }));
    } else if (
      form.specialization &&
      !availableSpecializations.includes(form.specialization)
    ) {
      setForm((prev) => ({ ...prev, specialization: "" }));
    }
  }, [form.certification]);

  useEffect(() => {
    if (msg.text === "Email verified successfully.") setEmailVerified(true);
    if (msg.text === "Phone verified successfully.") setPhoneVerified(true);
  }, [msg.text]);

  const validate = () => {
    const phoneRe = /^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/;
    const postalRe = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

    if (!form.firstname.trim()) return "Please enter first name.";
    if (!form.lastname.trim()) return "Please enter last name.";
    if (!phoneRe.test(form.phone))
      return "Invalid Canadian phone number format.";
    if (!postalRe.test(form.zipcode)) return "Invalid Canadian postal code.";
    if (!form.city.trim()) return "City is required.";
    if (form.certification !== "harp" && !form.specialization)
      return "Please select one specialization.";
    if (!certificateFile) return "Please upload your certificate file.";
    if (!form.emergency_name || !form.emergency_phone)
      return "Emergency contact name and phone are required.";
    if (!phoneRe.test(form.emergency_phone.trim()))
      return "Invalid emergency contact phone format.";
    if (!emailVerified || !phoneVerified)
      return "Please verify email and phone OTP first.";
    return "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > 10) {
      setMsg({
        type: "error",
        text: `File is too large (${sizeMB.toFixed(2)}MB). Max 10MB.`,
      });
      e.target.value = "";
      return;
    }
    setCertificateFile(file);
    setCertificateUrl("");
    setMsg({ type: "", text: "" });
  };

  const uploadCertificate = async () => {
    if (!certificateFile) return "";
    const fd = new FormData();
    fd.append("file", certificateFile);
    const res = await fetch(`${SERVER_BASE}/upload/certificate`, {
      method: "POST",
      body: fd,
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(t || "Certificate upload failed");
    }
    const data = await res.json();
    return data?.url || data?.data?.url || "";
  };

  const handleSendEmailOtp = async () => {
    setMsg({ type: "", text: "" });
    if (!form.email)
      return setMsg({ type: "error", text: "Enter email first." });
    setSendingEmailOtp(true);
    try {
      await postData("/auth/otp/send", {
        channel: "email",
        identifier: form.email.trim(),
      });
      setMsg({ type: "success", text: "Email OTP sent." });
      setEmailOtpSent(true);
      setEmailOtpTimer(60);
      const interval = setInterval(() => {
        setEmailOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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
    if (!emailOtp.trim())
      return setMsg({ type: "error", text: "Enter the email OTP." });
    setVerifyingEmailOtp(true);
    try {
      const res = await postData("/auth/verify-otp", {
        channel: "email",
        identifier: form.email.trim(),
        code: emailOtp.trim(),
      });
      const token = res?.data?.token;
      if (!token) throw new Error("OTP is not matching");
      setEmailVerified(true);
      setEmailToken(token);
      setEmailOtpError("");
      setTimeout(() => setEmailOtpError(""), 5000);
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

  // OTP handlers (phone)
  const handleSendPhoneOtp = async () => {
    setMsg({ type: "", text: "" });
    if (!form.phone)
      return setMsg({ type: "error", text: "Enter phone first." });
    setSendingPhoneOtp(true);
    try {
      await postData("/auth/otp/send", {
        channel: "phone",
        identifier: form.phone.trim(),
      });
      setMsg({ type: "success", text: "SMS OTP sent." });
      setPhoneOtpSent(true);
      setPhoneOtpTimer(60);
      const interval = setInterval(() => {
        setPhoneOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setMsg({
        type: "error",
        text:
          err?.response?.data?.message ||
          err.message ||
          "Failed to send SMS OTP",
      });
    } finally {
      setSendingPhoneOtp(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    setPhoneOtpError("");
    setMsg({ type: "", text: "" });
    if (!phoneOtp.trim())
      return setMsg({ type: "error", text: "Enter the SMS OTP." });
    setVerifyingPhoneOtp(true);
    try {
      const res = await postData("/auth/verify-otp", {
        channel: "phone",
        identifier: form.phone.trim(),
        code: phoneOtp.trim(),
      });
      const token = res?.data?.token;
      if (!token) throw new Error("OTP is not matching");
      setPhoneVerified(true);
      setPhoneToken(token);
      setPhoneOtpError("");
      setTimeout(() => setPhoneOtpError(""), 5000);
      setMsg({
        type: "success",
        text: "Phone number is verified successfully.",
      });
    } catch (err) {
      setPhoneVerified(false);
      setPhoneToken("");
      setPhoneOtpError(
        err?.response?.data?.message ||
          err.message ||
          "Phone OTP verification failed"
      );
      setMsg({
        type: "error",
        text:
          err?.response?.data?.message ||
          err.message ||
          "Phone OTP verification failed",
      });
    } finally {
      setVerifyingPhoneOtp(false);
    }
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
      // 1) Upload certificate first (public route)
      let finalCertUrl = certificateUrl;
      if (!finalCertUrl) {
        finalCertUrl = await uploadCertificate();
        setCertificateUrl(finalCertUrl);
      }
      if (!finalCertUrl) throw new Error("Failed to upload certificate");

      // 2) Register with certificate URL
      setMsg({ type: "info", text: "Submitting registration..." });
      const payload = {
        email: form.email.trim(),
        mobile: form.phone.trim(),
        first_name: form.firstname.trim(),
        last_name: form.lastname.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        zipcode: form.zipcode.toUpperCase().replace(/\s+/g, ""),
        province: form.province,
        country: form.country,
        role: "assistant",
        certification: form.certification,
        specializations:
          form.certification !== "harp" && form.specialization
            ? [form.specialization]
            : [],
        emergency_contact: {
          name: form.emergency_name,
          relationship: form.emergency_relationship,
          phone: form.emergency_phone,
          ...(form.emergency_email && { email: form.emergency_email }),
        },
        email_verification_token: emailToken,
        phone_verification_token: phoneToken,
        certificates: [finalCertUrl],
      };

      const res = await postData("/auth/register", payload);
      if (res?.data?.success === false || res?.success === false) {
        throw new Error(
          res?.data?.message || res?.message || "Registration failed"
        );
      }

      navigate("/thank-you", {
        state: {
          firstname: form.firstname.trim(),
          lastname: form.lastname.trim(),
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      setMsg({ type: "error", text: message });
    } finally {
      setLoading(false);
    }
  };

  const canRegister = emailVerified && phoneVerified && !loading;

  return (
    <>
      <div
        id="contactus"
        className="my-6 md:my-10 lg:my-10 px-8 md:px-8 lg:px-20"
      >
        <h2 className="text-darkblue font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold">
          Candidate SignUp
        </h2>
        <p className="font-poppins w-full md:w-4/5 lg:w-2/3 mt-1 text-darkblack text-sm  sm:text-base md:text-lg md:ml-2">
          Register yourself at
          <span className="text-darkblue font-semibold text-base sm:text-lg mx-2">
            Di’arva
          </span>
          to start earning
        </p>
      </div>

      <div>
        <div className="flex min-h-full flex-col justify-center px-6 mb-12 lg:px-8 md:py-8  font-poppins">
          <div className="bg-lightblue w-full max-w-4xl rounded-3xl mt-2 px-6 sm:px-10 py-6 mx-auto shadow-md">
            <img
              src={Marklogo}
              alt="Diarva Mark Logo"
              className="bg-lightbg h-20 rounded-full w-auto "
            />
            <h3 className="text-darkblue font-poppins text-2xl sm:text-3xl md:text-4xl font-medium">
              Register as Candidate
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="firstname"
                    className="block text-darkblack text-sm mb-1 px-3"
                  >
                    First Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="firstname"
                      type="text"
                      name="firstname"
                      placeholder="John"
                      required
                      autoComplete="given-name"
                      value={form.firstname}
                      onChange={onChange}
                      className="block w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 
                 -outline-offset-1 outline-darkblue focus:outline-2 focus:-outline-offset-2 
                 focus:outline-darkblue sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="lastname"
                    className="block text-darkblack text-sm mb-1 px-3"
                  >
                    Last Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="lastname"
                      type="text"
                      name="lastname"
                      placeholder="Smith"
                      required
                      autoComplete="family-name"
                      value={form.lastname}
                      onChange={onChange}
                      className="block w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 
                  -outline-offset-1 outline-darkblue focus:outline-2 focus:-outline-offset-2 
                 focus:outline-darkblue sm:text-sm/6 placeholder:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-darkblack text-sm mb-1 px-3 "
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
                      autoComplete="email"
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
                        ? `Resend OTP in ${emailOtpTimer}s`
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
                        placeholder="Enter email OTP"
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
                    <p className=" font-poppins text-sm text-red-700 mt-1 ml-2">
                      {emailOtpError}
                    </p>
                  )}
                  {!emailVerified ? (
                    <p className="text-sm text-darkblue mt-1 font-poppins font-medium ml-2">
                      *We will send OTP on this email address
                    </p>
                  ) : (
                    ""
                  )}

                  <div className="flex items-center ml-2 gap-2">
                    {emailVerified ? (
                      <CheckCircle className="w-5 h-5 text-darkblue" />
                    ) : (
                      ""
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

              {/* Phone */}
              <div className="flex flex-col mt-4">
                <label
                  htmlFor="phone"
                  className="text-darkblack text-sm mb-1 px-3"
                >
                  Phone Number
                </label>
                <div className="mt-1 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      placeholder="+14165550123"
                      pattern="^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$"
                      required
                      value={form.phone}
                      onChange={(e) => {
                        if (!phoneVerified) {
                          setPhoneVerified(false);
                          setPhoneToken("");
                          setPhoneOtp("");
                          onChange(e);
                        }
                      }}
                      disabled={phoneVerified}
                      className={`flex-1 rounded-full px-3 py-1.5 text-base text-darkblue outline-1 outline-darkblue focus:outline-2 sm:text-sm/6 ${
                        phoneVerified
                          ? "opacity-50 cursor-not-allowed font-semibold"
                          : ""
                      }`}
                    />
                    <Button
                      type="button"
                      variant="dark"
                      size="sm"
                      disabled={
                        !form.phone ||
                        sendingPhoneOtp ||
                        phoneVerified ||
                        phoneOtpTimer > 0
                      }
                      onClick={handleSendPhoneOtp}
                      className={`${
                        phoneVerified
                          ? "opacity-50 cursor-not-allowed"
                          : "whitespace-nowrap hover:cursor-pointer"
                      }`}
                    >
                      {phoneVerified
                        ? "Verified"
                        : phoneOtpTimer > 0
                        ? `Resend OTP in ${phoneOtpTimer}s`
                        : sendingPhoneOtp
                        ? "Sending..."
                        : "Send OTP"}
                    </Button>
                  </div>

                  {phoneOtpSent && !phoneVerified && (
                    <p className="text-sm font-poppins text-darkblue mt-1 font-medium ml-2">
                      OTP has been sent to your phone.
                    </p>
                  )}
                  {!phoneVerified && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter SMS OTP"
                        value={phoneOtp}
                        onChange={(e) => setPhoneOtp(e.target.value)}
                        className="flex-1 rounded-full px-3 py-1.5 text-base text-darkblue outline-1 outline-darkblue focus:outline-2 sm:text-sm/6"
                      />
                      <Button
                        type="button"
                        variant="dark"
                        size="sm"
                        onClick={handleVerifyPhoneOtp}
                        disabled={!phoneOtp || verifyingPhoneOtp}
                        className={
                          !phoneOtp || verifyingPhoneOtp
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }
                      >
                        {verifyingPhoneOtp ? "Verifying..." : "Verify OTP"}
                      </Button>
                    </div>
                  )}

                  {phoneOtpError && (
                    <p className="text-sm text-red-700 mt-1 ml-2">
                      {phoneOtpError}
                    </p>
                  )}
                  {!phoneVerified ? (
                    <p className="text-sm text-darkblue mt-1 font-poppins font-medium ml-2">
                      *We will send OTP on this email address
                    </p>
                  ) : (
                    ""
                  )}

                  <div className="flex items-center ml-2 gap-2">
                    {phoneVerified ? (
                      <CheckCircle className="w-5 h-5 text-darkblue" />
                    ) : (
                      ""
                    )}
                    <span
                      className={`text-sm ${
                        phoneVerified
                          ? "text-darkblue font-medium font-poppins"
                          : "text-darkblue"
                      }`}
                    >
                      {phoneVerified
                        ? "Phone number is verified"
                        : "Phone number is not verified"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Certificate Upload */}
              <div>
                <label
                  htmlFor="certificate-upload"
                  className="block text-sm/6 font-medium text-darkblue font-poppins"
                >
                  Upload Certificate
                </label>
                <div className="mt-2">
                  <input
                    id="certificate-upload"
                    name="certificate_file"
                    type="file"
                    required
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-darkblue file:text-white
                      hover:file:bg-opacity-90 "
                  />
                  {certificateFile && (
                    <p className="text-xs text-darkblue mt-2 ml-2">
                      Selected file: {certificateFile.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm/6 font-medium text-gray-900 "
                >
                  Address
                </label>
                <div className="mt-2">
                  <input
                    id="address"
                    type="text"
                    name="address"
                    placeholder="60 Frederick Street"
                    required
                    autoComplete="street-address"
                    value={form.address}
                    onChange={onChange}
                    className="block w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 -outline-offset-1 outline-darkblue focus:outline-2 focus:-outline-offset-2 focus:outline-darkblue sm:text-sm/6"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm/6 font-medium text-gray-900 "
                >
                  City
                </label>
                <div className="mt-2">
                  <input
                    id="city"
                    type="text"
                    name="city"
                    placeholder="Toronto"
                    required
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={onChange}
                    className="block w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 -outline-offset-1 outline-darkblue focus:outline-2 focus:-outline-offset-2 focus:outline-darkblue sm:text-sm/6"
                  />
                </div>
              </div>

              {/* Postal + Province */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col flex-1">
                  <label
                    htmlFor="postalcode"
                    className="block text-sm/6 font-medium text-gray-900 "
                  >
                    Postal code
                  </label>
                  <div>
                    <input
                      id="postalcode"
                      type="text"
                      name="zipcode"
                      placeholder="M5H 2N2"
                      required
                      autoComplete="postal-code"
                      value={form.zipcode}
                      onChange={onChange}
                      className="block w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 -outline-offset-1 outline-darkblue focus:outline-2 focus:-outline-offset-2 focus:outline-darkblue sm:text-sm/6"
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
                  <div className="relative">
                    <select
                      className="border w-full appearance-none  border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold placeholder:text-sm"
                      name="province"
                      id="province"
                      autoComplete="address-level1"
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
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-darkblue pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm/6 font-medium text-gray-900 "
                >
                  Country
                </label>
                <div className="mt-2 flex flex-col gap-3">
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
              </div>

              {/* Certification & Specialization */}
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">
                  Certification & Specialization
                </label>
                <div className="mt-2 flex flex-col gap-3">
                  <div className="relative">
                    <select
                      name="certification"
                      value={form.certification}
                      onChange={onChange}
                      className="appearance-none w-full border border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold"
                    >
                      <option value="level-1">Level 1</option>
                      <option value="level-2">Level 2</option>
                      <option value="harp">HARP</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-darkblue pointer-events-none" />
                  </div>

                  {form.certification !== "harp" && (
                    <div className="relative">
                      <select
                        name="specialization"
                        value={form.specialization}
                        onChange={onChange}
                        required
                        className="border appearance-none w-full border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold"
                      >
                        <option value="" disabled>
                          Select specialization
                        </option>
                        {availableSpecializations.map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2  w-5 h-5 text-darkblue pointer-events-none" />
                    </div>
                  )}
                </div>
              </div>

              {/* Emergency */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-darkblack">
                  Emergency Contact
                </p>
                <div>
                  <label
                    htmlFor="emergency_name"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Name
                  </label>
                  <input
                    id="emergency_name"
                    name="emergency_name"
                    type="text"
                    required
                    value={form.emergency_name}
                    onChange={onChange}
                    className="mt-1 block w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 outline-darkblue focus:outline-2 sm:text-sm/6"
                  />
                </div>
                <div>
                  <label
                    htmlFor="emergency_relationship"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Relationship
                  </label>
                  <input
                    id="emergency_relationship"
                    name="emergency_relationship"
                    type="text"
                    value={form.emergency_relationship}
                    onChange={onChange}
                    className="mt-1 block w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 outline-darkblue focus:outline-2 sm:text-sm/6"
                  />
                </div>
                <div>
                  <label
                    htmlFor="emergency_phone"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Phone
                  </label>
                  <input
                    id="emergency_phone"
                    name="emergency_phone"
                    type="tel"
                    required
                    placeholder="+14165550123"
                    value={form.emergency_phone}
                    onChange={onChange}
                    className="mt-1 block w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 outline-darkblue focus:outline-2 sm:text-sm/6"
                  />
                </div>
                <div>
                  <label
                    htmlFor="emergency_email"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Email (optional)
                  </label>
                  <input
                    id="emergency_email"
                    name="emergency_email"
                    type="email"
                    value={form.emergency_email}
                    onChange={onChange}
                    className="mt-1 block w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 outline-darkblue focus:outline-2 sm:text-sm/6"
                  />
                </div>
              </div>

              {msg.text ? (
                <div
                  className={`rounded-xl px-4 py-3 text-sm ${
                    msg.type === "error"
                      ? "bg-red-100 text-red-700"
                      : msg.type === "info"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {msg.text}
                </div>
              ) : null}

              <div>
                <Button
                  type="submit"
                  variant="dark"
                  size="lg"
                  disabled={!canRegister}
                  className={
                    !canRegister
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:opacity-80"
                  }
                >
                  {loading
                    ? "Submitting..."
                    : emailVerified && phoneVerified
                    ? "Sign Up"
                    : "Verify to Sign Up"}
                </Button>
                {!emailVerified || !phoneVerified ? (
                  <p className="text-sm mt-2 text-center text-darkblue">
                    Please verify Email address and Phone number to enable
                    Signup.
                  </p>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateSignup;