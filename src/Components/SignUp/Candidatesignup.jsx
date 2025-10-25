import { useState, useEffect } from "react";
import Marklogo from "../../assets/icons/Dashboard.png";
import Button from "../Button";
import { postData } from "../../lib/http";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ChevronDown, CheckSquare, Square, AlertCircle } from "lucide-react";
import Popup from "./Popup";

// Roles
const ROLES = [
  {
    value: "dental-assistant",
    label: "Dental Assistant",
  },
  {
    value: "hygienist",
    label: "Hygienist",
  },
  {
    value: "assistant-dental",
    label: "Assistant Dental",
  },
];

// Specialization as per levels
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

// Provinces Array
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

// URL for DB Server
const SERVER_BASE = import.meta.env.VITE_SERVER_BASE_URL || "";

const CandidateSignup = () => {
  const navigate = useNavigate();

  // Initial state of Form Empty
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
    role: "dental-assistant",
    yearsOfExperience: "",
    licenseNumber: "",
    certification: "level-1", // This is fine - it's your form field name
    specialization: "",
    emergency_name: "",
    emergency_relationship: "",
    emergency_phone: "",
    emergency_email: "",
  });

  // States Definition
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
  const [popup, setPopup] = useState({
    visible: false,
    message: "",
    type: "info",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Onchange Events
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

// Specializations selection - keep this the same
const availableSpecializations =
  form.certification === "level-1"
    ? LEVEL_1_SPECIALIZATIONS
    : form.certification === "level-2"
    ? LEVEL_2_SPECIALIZATIONS
    : [];

// In the professionalInfo object - use form.certification for certification_level
const professionalInfo = {
  years_of_experience: form.yearsOfExperience,
  license_number: form.licenseNumber || "",
  certification_level: form.certification, // Map form.certification to certification_level
  specializations: form.certification !== "harp" && form.specialization
    ? [form.specialization]
    : [],
};

  // Reseting certification-related fields when role changes
  useEffect(() => {
    if (form.role !== "dental-assistant") {
      setCertificateFile(null);
      setCertificateUrl("");
      setForm((prev) => ({
        ...prev,
        certification: "level-1",
        specialization: "",
      }));
    } else {
      setForm((prev) => ({ ...prev, licenseNumber: "" }));
    }
  }, [form.role]);

  // Certification changes for HARP only
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

  // Email and phone number verified with blue tickmark
  useEffect(() => {
    if (msg.text === "Email verified successfully.") setEmailVerified(true);
    if (msg.text === "Phone verified successfully.") setPhoneVerified(true);
  }, [msg.text]);

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

  useEffect(() => {
    if (phoneOtpTimer > 0) {
      const interval = setInterval(() => {
        setPhoneOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phoneOtpTimer]);

  // Close popup
  const handleClosePopup = () => {
    setPopup({ visible: false, message: "", type: "" });
  };

  // Validation regex
  const validate = () => {
    const phoneRe = /^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/;
    const postalRe = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
  
    // Form field validation
    if (!form.firstname.trim()) return "Please enter first name.";
    if (!form.lastname.trim()) return "Please enter last name.";
    if (!phoneRe.test(form.phone))
      return "Invalid Canadian phone number format.";
    if (!postalRe.test(form.zipcode)) return "Invalid Canadian postal code.";
    if (!form.city.trim()) return "City is required.";
    if (!form.yearsOfExperience) return "Years Of Experience is required";
    

    // Certificate validation - REQUIRED for dental-assistant role
    if (form.role === "dental-assistant") {
      if (form.certification !== "harp" && !form.specialization)
        return "Please select specialization";
      if (!certificateFile) return "Please upload your certification file"; // Updated message
    } else {
      if (!form.licenseNumber.trim())
        return "License/Registration number is required";
    }
    

    if (!form.emergency_name || !form.emergency_phone)
      return "Emergency contact name and phone are required.";
    if (!phoneRe.test(form.emergency_phone.trim()))
      return "Invalid emergency contact phone format.";
    if (!emailVerified || !phoneVerified)
      return "Please verify email and phone OTP first.";
    if (!acceptedTerms)
      return "You must accept the Terms and Conditions to proceed.";
    return "";
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      setCertificateFile(null);
      setCertificateUrl("");
      setMsg({ type: "", text: "" });
      return;
    }
    
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > 10) {
      setMsg({
        type: "error",
        text: `File is too large (${sizeMB.toFixed(2)}MB). Maximum file size is 10MB.`,
      });
      e.target.value = "";
      setCertificateFile(null);
      return;
    }
  
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setMsg({
        type: "error",
        text: "Invalid file type. Please upload PDF, JPG, or PNG files only.",
      });
      e.target.value = "";
      setCertificateFile(null);
      return;
    }
  
    setCertificateFile(file);
    setCertificateUrl("");
    setMsg({ 
      type: "success", 
      text: `Certificate file "${file.name}" selected successfully.` 
    });
  };

  const uploadCertificate = async () => {
    if (!certificateFile) return "";
    
    try {
      console.log("Uploading file:", certificateFile.name, certificateFile.type, certificateFile.size);
      
      const fd = new FormData();
      fd.append("file", certificateFile);
      
      const res = await fetch(`${SERVER_BASE}auth/certificate`, {
        method: "POST",
        body: fd,
      });
      
      console.log("Upload response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text().catch(() => "Certificate upload failed");
        console.error("Upload error:", errorText);
        throw new Error(`Upload failed: ${res.status} - ${errorText}`);
      }
      
      const data = await res.json();
      console.log("Upload success data:", data);
      
      const certificateUrl = data?.url || data?.data?.url || "";
      
      if (!certificateUrl) {
        console.error("No URL in response data:", data);
        throw new Error("Server returned success but no certificate URL");
      }
      
      console.log("Certificate URL obtained:", certificateUrl);
      return certificateUrl;
      
    } catch (error) {
      console.error("Certificate upload error:", error);
      throw new Error(`Certificate upload failed: ${error.message}`);
    }
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
      setMsg({ type: "success", text: "SMS OTP sent successfully." });
      setPhoneOtpSent(true);
      setPhoneOtpTimer(60);
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
      if (!token) throw new Error("OTP verification failed");
      setPhoneVerified(true);
      setPhoneToken(token);
      setPhoneOtpError("");
      setMsg({ type: "success", text: "Phone verified successfully." });
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
  
      // Only upload certificate if role is dental-assistant
      if (form.role === "dental-assistant" && certificateFile && !finalCertUrl) {
        setMsg({ type: "info", text: "Uploading certificate..." });
        finalCertUrl = await uploadCertificate();
        setCertificateUrl(finalCertUrl);
      }
  
      console.log("📁 Certificate URL:", finalCertUrl);
  
      // 2) Register with certificate URL
      setMsg({ type: "info", text: "Submitting registration..." });
  
      // Create professional_info object with CORRECT field names
      const professionalInfo = {
        years_of_experience: form.yearsOfExperience,
        license_number: form.licenseNumber || "",
        certification_level: form.certification, // CHANGED: certification -> certification_level
        specializations: form.certification !== "harp" && form.specialization
          ? [form.specialization]
          : [],
      };
  
      // Only add certificates if we have a URL and role is dental-assistant
      if (form.role === "dental-assistant" && finalCertUrl) {
        professionalInfo.certificates = [finalCertUrl];
      }
  
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
        professional_info: professionalInfo,
        emergency_contact: {
          name: form.emergency_name.trim(),
          relationship: form.emergency_relationship.trim(),
          phone: form.emergency_phone.trim(),
          ...(form.emergency_email && { email: form.emergency_email.trim() }),
        },
        email_verification_token: emailToken,
        phone_verification_token: phoneToken,
        accepted_terms: acceptedTerms,
      };
  
      console.log("🚀 Final registration payload:", JSON.stringify(payload, null, 2));
  
      const res = await postData("/auth/register", payload);
      
      console.log("✅ Registration response:", res);
  
      if (res?.data?.success === false || res?.success === false) {
        throw new Error(
          res?.data?.message || res?.message || "Registration failed"
        );
      }
  
      // Success - redirect to thank you page
      navigate("/thank-you", {
        state: {
          firstname: form.firstname.trim(),
          lastname: form.lastname.trim(),
          type: "candidate",
        },
      });
    } catch (error) {
      console.error("❌ Registration error:", error);
      
      if (error.response) {
        console.error("📋 Error response data:", error.response.data);
      }
      
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong during registration. Please try again.";
      
      setMsg({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };
  const canRegister = emailVerified && 
  phoneVerified && 
  acceptedTerms && 
  !loading &&
  // Add certificate validation for dental-assistant role
  (form.role !== "dental-assistant" || certificateFile);
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
            Di'arva
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
              {/* Form fields remain exactly the same as your original CandidateSignup */}
              {/* ... All your existing form fields ... */}
              
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
                        ? `Resend in ${phoneOtpTimer}s`
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

              {/* Role Selection*/}

              <div>
                <label
                  htmlFor="role"
                  className="text-darkblack text-sm mb-1 px-3"
                >
                  Role
                </label>
                <div className="relative">
                  <select
                    className="border w-full appearance-none  border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold placeholder:text-sm"
                    name="role"
                    id="role"
                    required
                    value={form.role}
                    onChange={onChange}
                  >
                    {ROLES.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-darkblue pointer-events-none" />
                </div>
              </div>

              {/* Years of Experience */}

              <div>
                <label
                  htmlFor="yearsOfExperience"
                  className="text-darkblack text-sm mb-1 px-3"
                >
                  Years of Experience
                </label>
                <input
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  type="text"
                  required
                  onChange={onChange}
                  placeholder="1"
                  value={form.yearsOfExperience}
                  className="w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 outline-darkblue focus:outline-2 sm:text-sm/6"
                />
              </div>

              {/* Conditional Fields Based on Role */}
              {form.role === "dental-assistant" ? (
                <>
               {/* Certificate Upload - REQUIRED */}
{/* Certificate Upload - REQUIRED */}
<div>
  <label
    htmlFor="certificate-upload"
    className="block text-sm font-medium text-blue-900 mb-1 px-3"
  >
    Upload Certificate *
  </label>
  <input
    id="certificate-upload"
    name="certificate_file"
    type="file"
    required
    onChange={handleFileChange}
    accept=".pdf,.jpg,.jpeg,.png"
    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-900 file:text-white hover:file:bg-opacity-90"
  />
  
  {/* File status */}
  {certificateFile ? (
    <p className="text-xs text-green-600 mt-2 ml-2 font-medium">
      ✓ Certificate selected: {certificateFile.name} ({(certificateFile.size / (1024 * 1024)).toFixed(2)}MB)
    </p>
  ) : (
    <p className="text-xs text-red-600 mt-2 ml-2">
      * Certificate file is required for Dental Assistant registration
    </p>
  )}
  
  {/* Requirements helper */}
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
    <p className="text-xs text-blue-800 font-medium mb-1">Certificate Requirements:</p>
    <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
      <li>File must be in PDF, JPG, or PNG format</li>
      <li>Maximum file size: 10MB</li>
      <li>File should clearly show your certification details</li>
      <li>Certificate must be valid and legible</li>
    </ul>
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
                </>
              ) : (
                /* License Number for Hygienist and Assistant Dental */
                <div>
                  <label
                    htmlFor="licenseNumber"
                    className="block text-sm font-medium text-gray-900 mb-1 px-3"
                  >
                    License / Registration Number
                  </label>
                  <input
                    id="licenseNumber"
                    type="text"
                    name="licenseNumber"
                    placeholder="Enter your license number"
                    required
                    value={form.licenseNumber}
                    onChange={onChange}
                    className="block w-full rounded-full px-3 py-1.5 text-base text-blue-900 border border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              )}

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
              {/* Terms and Conditions Checkbox */}
              <div className="bg-lightblue border border-darkblue rounded-4xl p-6">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="sr-only"
                  />

                  <label
                    htmlFor="terms"
                    className="cursor-pointer flex-shrink-0 mt-0.5"
                  >
                    {acceptedTerms ? (
                      <CheckSquare className="w-6 h-6 text-darkblue" />
                    ) : (
                      <Square className="w-6 h-6 text-darkblue hover:text-darkblue/70 transition-colors" />
                    )}
                  </label>
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    <span className="font-semibold font-poppins text-darkblack">
                      To proceed, please accept our{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        className="text-darkblue underline hover:text-darkblue/80"
                      >
                        Terms and Conditions
                      </a>
                      .
                    </span>
                    <p className="mt-2 text-gray-600">
                      It's important that you read and understand them before
                      continuing to use our services.
                    </p>
                  </label>
                </div>
              </div>

              {/* Error/Success Messages - Same style as OfficeSignup */}
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

           {/* Submit Button - Same style as OfficeSignup */}
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
      : emailVerified && phoneVerified && acceptedTerms && (form.role !== "dental-assistant" || certificateFile)
      ? "Sign Up"
      : "Complete Requirements to Sign Up"}
  </button>
  {(!emailVerified || !phoneVerified || !acceptedTerms || (form.role === "dental-assistant" && !certificateFile)) && (
    <p className="text-sm mt-2 text-center text-darkblue">
      {!emailVerified && !phoneVerified && !acceptedTerms && (form.role === "dental-assistant" && !certificateFile)
        ? "Please verify your email, phone, accept Terms & Conditions, and upload certificate"
        : !emailVerified && !phoneVerified && (form.role === "dental-assistant" && !certificateFile)
        ? "Please verify your email, phone, and upload certificate"
        : !emailVerified && (form.role === "dental-assistant" && !certificateFile)
        ? "Please verify your email and upload certificate"
        : !phoneVerified && (form.role === "dental-assistant" && !certificateFile)
        ? "Please verify your phone and upload certificate"
        : (form.role === "dental-assistant" && !certificateFile)
        ? "Please upload your certificate file"
        : !emailVerified
        ? "Please verify your email address"
        : !phoneVerified
        ? "Please verify your phone number"
        : !acceptedTerms
        ? "Please accept Terms and Conditions to proceed"
        : ""}
    </p>
  )}
</div>
            </form>
            <Popup
              visible={popup.visible}
              message={popup.message}
              type={popup.type}
              onClose={handleClosePopup}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateSignup;