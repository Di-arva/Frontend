import { useState } from "react";
import Marklogo from "../../assets/Diarva_mark.png";
import Button from "../Button";
import { postData } from "../../lib/http";

const SPECIALIZATIONS = [
  "Chairside Assisting",
  "Dental Radiography",
  "Infection Control",
  "Preventive Dentistry",
  "Orthodontic Assisting",
  "Surgical Assisting",
  "Pediatric Assisting",
  "Laboratory Procedures",
  "Administrative Tasks",
];

const PROVINCES = ["AB", "BC", "MB", "NB", "NL", "NS", "ON", "PE", "QC", "SK", "NT", "NU", "YT"];

const CandidateSignup = () => {
  const [form, setForm] = useState({
    name: "",
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
    specialization: "",       // single selection
    emergency_name: "",
    emergency_relationship: "",
    emergency_phone: "",
    emergency_email: "",
  });

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

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const phoneRe = /^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/;
    const postalRe = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

    if (!form.name.trim().includes(" ")) return "Please enter full name (first and last).";
    if (!phoneRe.test(form.phone)) return "Invalid Canadian phone number format.";
    if (!postalRe.test(form.zipcode)) return "Invalid Canadian postal code.";
    if (!form.city.trim()) return "City is required.";
    if (!form.specialization) return "Please select one specialization.";
    if (!form.emergency_name || !form.emergency_phone) return "Emergency contact name and phone are required.";
    if (!phoneRe.test(form.emergency_phone.trim())) return "Invalid emergency contact phone format.";
    if (!emailVerified || !phoneVerified) return "Please verify email and phone OTP first.";
    return "";
  };

  const handleSendEmailOtp = async () => {
    setMsg({ type: "", text: "" });
    if (!form.email) return setMsg({ type: "error", text: "Enter email first." });
    setSendingEmailOtp(true);
    try {
      await postData("/auth/otp/send", { channel: "email", identifier: form.email.trim() });
      setMsg({ type: "success", text: "Email OTP sent." });
    } catch (err) {
      setMsg({ type: "error", text: err?.response?.data?.message || err.message || "Failed to send email OTP" });
    } finally {
      setSendingEmailOtp(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    setMsg({ type: "", text: "" });
    if (!emailOtp.trim()) return setMsg({ type: "error", text: "Enter the email OTP." });
    setVerifyingEmailOtp(true);
    try {
      const res = await postData("/auth/verify-otp", {
        channel: "email",
        identifier: form.email.trim(),
        code: emailOtp.trim(),
      });
      const token = res?.data?.token;
      if (!token) throw new Error("No token received");
      setEmailVerified(true);
      setEmailToken(token);
      setMsg({ type: "success", text: "Email verified successfully." });
    } catch (err) {
      setEmailVerified(false);
      setEmailToken("");
      setMsg({ type: "error", text: err?.response?.data?.message || err.message || "Email OTP verification failed" });
    } finally {
      setVerifyingEmailOtp(false);
    }
  };

  const handleSendPhoneOtp = async () => {
    setMsg({ type: "", text: "" });
    if (!form.phone) return setMsg({ type: "error", text: "Enter phone first." });
    setSendingPhoneOtp(true);
    try {
      await postData("/auth/otp/send", { channel: "phone", identifier: form.phone.trim() });
      setMsg({ type: "success", text: "SMS OTP sent." });
    } catch (err) {
      setMsg({ type: "error", text: err?.response?.data?.message || err.message || "Failed to send SMS OTP" });
    } finally {
      setSendingPhoneOtp(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    setMsg({ type: "", text: "" });
    if (!phoneOtp.trim()) return setMsg({ type: "error", text: "Enter the SMS OTP." });
    setVerifyingPhoneOtp(true);
    try {
      const res = await postData("/auth/verify-otp", {
        channel: "phone",
        identifier: form.phone.trim(),
        code: phoneOtp.trim(),
      });
      const token = res?.data?.token;
      if (!token) throw new Error("No token received");
      setPhoneVerified(true);
      setPhoneToken(token);
      setMsg({ type: "success", text: "Phone verified successfully." });
    } catch (err) {
      setPhoneVerified(false);
      setPhoneToken("");
      setMsg({ type: "error", text: err?.response?.data?.message || err.message || "Phone OTP verification failed" });
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
      const [first_name, ...rest] = form.name.trim().split(" ");
      const last_name = rest.join(" ") || "";

      const payload = {
        email: form.email.trim(),
        mobile: form.phone.trim(),
        first_name,
        last_name,
        city: form.city.trim(),
        zipcode: form.zipcode.toUpperCase().replace(/\s+/g, ""),
        province: form.province,
        role: "assistant",

        certification: form.certification,
        specializations: form.specialization ? [form.specialization] : [],
        emergency_contact: {
          name: form.emergency_name,
          relationship: form.emergency_relationship,
          phone: form.emergency_phone,
          email: form.emergency_email || undefined,
        },
        email_verification_token: emailToken,
        phone_verification_token: phoneToken,
      };

      const res = await postData("/auth/register", payload);
      if (!res?.success) throw new Error(res?.message || "Registration failed");

      setMsg({
        type: "success",
        text: "Registration submitted. Pending admin approval. You’ll be able to log in once approved.",
      });

      setForm((f) => ({ ...f }));
    } catch (error) {
      const message = error?.response?.data?.message || error.message || "Something went wrong";
      setMsg({ type: "error", text: message });
    } finally {
      setLoading(false);
    }
  };

  const canRegister = emailVerified && phoneVerified && !loading;

  return (
    <div>
      <div className="flex min-h-full flex-col justify-center px-6 py-8 lg:px-8 bg-lightblue font-poppins">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img src={Marklogo} alt="Diarva Mark Logo" className="mx-auto h-20 w-auto " />
          <h2 className="mt-10 text-center text-2xl/9 font-semibold tracking-tight text-darkblack">
            Register as Candidate
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900 ">
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="John Smith"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={onChange}
                  className="block w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 -outline-offset-1 outline-darkblue focus:outline-2 focus:-outline-offset-2 focus:outline-darkblue sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 ">
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
                      setEmailVerified(false);
                      setEmailToken("");
                      setEmailOtp("");
                      onChange(e);
                    }}
                    className="flex-1 rounded-full px-3 py-1.5 text-base text-darkblue outline-1 -outline-offset-1 outline-darkblue focus:outline-2 focus:-outline-offset-2 focus:outline-darkblue sm:text-sm/6"
                  />
                  <Button
                    type="button"
                    variant="dark"
                    size="sm"
                    disabled={!form.email || sendingEmailOtp || emailVerified}
                    onClick={handleSendEmailOtp}
                    className="whitespace-nowrap"
                  >
                    {emailVerified ? "Verified" : sendingEmailOtp ? "Sending..." : "Send OTP"}
                  </Button>
                </div>

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
                      variant="outline"
                      size="sm"
                      onClick={handleVerifyEmailOtp}
                      disabled={!emailOtp || verifyingEmailOtp}
                    >
                      {verifyingEmailOtp ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                )}

                <p className="text-sm text-darkblue mt-1 font-poppins font-medium ml-2">
                  *We will send OTP on this email address
                </p>
              </div>
            </div>

            <div className="flex flex-col mt-4">
              <label htmlFor="phone" className="text-darkblack text-sm mb-1 px-3">
                Phone Number
              </label>
              <div className="mt-1 space-y-2">
                <div className="flex gap-2">
                  <input
                    className="flex-1 border border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold placeholder:text-sm"
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="+14165550123"
                    pattern="^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$"
                    required
                    value={form.phone}
                    onChange={(e) => {
                      setPhoneVerified(false);
                      setPhoneToken("");
                      setPhoneOtp("");
                      onChange(e);
                    }}
                  />
                  <Button
                    type="button"
                    variant="dark"
                    size="sm"
                    disabled={!form.phone || sendingPhoneOtp || phoneVerified}
                    onClick={handleSendPhoneOtp}
                    className="whitespace-nowrap"
                  >
                    {phoneVerified ? "Verified" : sendingPhoneOtp ? "Sending..." : "Send OTP"}
                  </Button>
                </div>

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
                      variant="outline"
                      size="sm"
                      onClick={handleVerifyPhoneOtp}
                      disabled={!phoneOtp || verifyingPhoneOtp}
                    >
                      {verifyingPhoneOtp ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                )}

                <p className="text-sm text-darkblue mt-1 font-poppins font-medium ml-2">
                  *We will send OTP on this phone number
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm/6 font-medium text-gray-900 ">
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

            <div>
              <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900 ">
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

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col flex-1">
                <label htmlFor="postalcode" className="block text-sm/6 font-medium text-gray-900 ">
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
                <label htmlFor="province" className="block text-sm/6 font-medium text-gray-900">
                  Province
                </label>
                <select
                  className="border border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold placeholder:text-sm"
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
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm/6 font-medium text-gray-900 ">
                Country
              </label>
              <div className="mt-2">
                <input
                  id="country"
                  type="text"
                  name="country"
                  placeholder="Canada"
                  required
                  autoComplete="country-name"
                  value={form.country}
                  onChange={onChange}
                  className="block w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 -outline-offset-1 outline-darkblue focus:outline-2 focus:-outline-offset-2 focus:outline-darkblue sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm/6 font-medium text-gray-900">Certification & Specialization</label>
              <div className="mt-2 flex flex-col gap-3">
                <select
                  name="certification"
                  value={form.certification}
                  onChange={onChange}
                  className="border border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold"
                >
                  <option value="level-1">Level 1</option>
                  <option value="level-2">Level 2</option>
                  <option value="harp">HARP</option>
                </select>

                <select
                  name="specialization"
                  value={form.specialization}
                  onChange={onChange}
                  className="border border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold"
                >
                  <option value="" disabled>
                    Select specialization
                  </option>
                  {SPECIALIZATIONS.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-darkblack">Emergency Contact</p>
              <div>
                <label htmlFor="emergency_name" className="block text-sm/6 font-medium text-gray-900">
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
                <label htmlFor="emergency_relationship" className="block text-sm/6 font-medium text-gray-900">
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
                <label htmlFor="emergency_phone" className="block text-sm/6 font-medium text-gray-900">
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
                <label htmlFor="emergency_email" className="block text-sm/6 font-medium text-gray-900">
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

            {/* note for nishi
              instead of msg.text you can redirect it to specific page
              and remove msg/setMsg state
            */}

            {msg.text ? (
              <div
                className={`rounded-xl px-4 py-3 text-sm ${
                  msg.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`}
              >
                {msg.text}
              </div>
            ) : null}

            <div>
              <Button type="submit" variant="dark" size="lg" className="mb-4 w-full" disabled={!canRegister}>
                {loading ? "Submitting..." : emailVerified && phoneVerified ? "Sign Up" : "Verify to Sign Up"}
              </Button>
              {!emailVerified || !phoneVerified ? (
                <p className="text-xs text-center text-darkblue">Please verify both Email and Phone to enable Sign Up.</p>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CandidateSignup;