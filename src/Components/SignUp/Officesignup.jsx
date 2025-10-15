
import Marklogo from "../../assets/icons/Dashboard.png";
import Button from "../Button";

import { CheckCircle,ChevronDown } from "lucide-react";



const PROVINCES = ["AB", "BC", "MB", "NB", "NL", "NS", "ON", "PE", "QC", "SK", "NT", "NU", "YT"];



// Component Starts

const Officesignup = () => {


  // Component JSX

  return (
    <>
    <div className="my-6 md:my-10 lg:my-10 px-8 md:px-8 lg:px-20">
    <h2 className="text-darkblue font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold">
      Office SignUp
    </h2>
    <p className="font-poppins w-full md:w-4/5 lg:w-2/3 mt-1 text-darkblack text-sm  sm:text-base md:text-lg md:ml-2">
      Register yourself at
      <span className="text-darkblue font-semibold text-base sm:text-lg mx-2">
        Di’arva
      </span>
      to request a staff
    </p>

 
  </div>
    <div>
      <div className="flex min-h-full flex-col justify-center px-6 mb-12 lg:px-8 md:py-8  font-poppins">
      
        
      
    
        <div className="bg-lightblue w-full max-w-4xl rounded-3xl mt-2 px-6 sm:px-10 py-6 mx-auto shadow-md">
        <img src={Marklogo} alt="Diarva Mark Logo" className="bg-lightbg h-20 rounded-full w-auto " />
      <h3 className="text-darkblue font-poppins text-2xl sm:text-3xl md:text-4xl font-medium">
      Register as Office
      </h3>
      <p className="mt-2 mb-8 text-sm sm:text-base">You can reach us at anytime at<a href="mailto:support@diarva.org" target="_blank" className="text-md font-poppins text-darkblue font-normal ml-2">
    support@diarva.org
  </a></p>
      
      {/* Form Begins */}
      
      <form className="space-y-6">

<div className="flex flex-col sm:flex-row gap-4">
  {/* Business Name */}
  <div className="flex-1">
    <label htmlFor="firstname" className="block text-darkblack text-sm mb-1 px-3">Business Name</label>
    <div className="mt-2">
      <input
        id="clinicname"
        type="text"
        name="clinicname"
        placeholder="Highland Dental Clinic"
        className="block w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 
                   -outline-offset-1 outline-darkblue focus:outline-2 focus:-outline-offset-2 
                   focus:outline-darkblue sm:text-sm/6"
      />
    </div>
  </div>


</div>

{/* Email Address */}
<div>
  <label htmlFor="email" className="block text-darkblack text-sm mb-1 px-3">Email Address</label>
  <div className="mt-2 flex gap-2">
    <input
      id="email"
      type="email"
      name="email"
      placeholder="john@smith.com"
      className="flex-1 rounded-full px-3 py-1.5 text-base text-darkblue outline-1 outline-darkblue focus:outline-2 sm:text-sm/6"
    />
                    <Button
  type="button"
  variant="dark"
  size="sm"
  

  className="whitespace-nowrap hover:cursor-pointer"
>
Send OTP
</Button>
  </div>
  
</div>
<div>
 
  <div className="mt-2 flex gap-2">
    <input
      id="email"
      type="email"
      name="email"
      placeholder="Enter Email OTP"
      className="flex-1 rounded-full px-3 py-1.5 text-base text-darkblue outline-1 outline-darkblue focus:outline-2 sm:text-sm/6"
    />
                    <Button
  type="button"
  variant="dark"
  size="sm"
  

  className="whitespace-nowrap hover:cursor-pointer"
>
Verify OTP
</Button>
  </div>
  
</div>
{/* Phone Number */}
<div>
  <label htmlFor="phone" className="text-darkblack text-sm mb-1 px-3">Phone Number</label>
  <div className="mt-1 flex gap-2">
    <input
      id="phone"
      type="tel"
      name="phone"
      placeholder="+14165550123"
      className="flex-1 rounded-full px-3 py-1.5 text-base text-darkblue outline-1 outline-darkblue focus:outline-2 sm:text-sm/6"
    />
   
  </div>
 
</div>

{/* Address */}
<div>
  <label htmlFor="address" className="block text-sm/6 font-medium text-gray-900">Address</label>
  <input
    id="address"
    type="text"
    name="address"
    placeholder="60 Frederick Street"
    className="block w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 focus:outline-2 sm:text-sm/6 mt-2"
  />
</div>

{/* City */}
<div>
  <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">City</label>
  <input
    id="city"
    type="text"
    name="city"
    placeholder="Toronto"
    className="block w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 focus:outline-2 sm:text-sm/6 mt-2"
  />
</div>

{/* Postal Code & Province */}
<div className="flex flex-col sm:flex-row gap-4">
  <div className="flex-1">
    <label htmlFor="zipcode" className="block text-sm/6 font-medium text-gray-900">Postal code</label>
    <input
      id="zipcode"
      type="text"
      name="zipcode"
      placeholder="M5H 2N2"
      className="block w-full rounded-full px-3 py-1.5 text-base text-darkblue outline-1 focus:outline-2 sm:text-sm/6 mt-2"
    />
  </div>
  <div className="flex-1 relative">
    <label htmlFor="province" className="block text-sm/6 font-medium text-gray-900">Province</label>
    <select
                  className="border w-full appearance-none  border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold placeholder:text-sm"
                  name="province"
                  id="province"
                  autoComplete="address-level1"
                  required
           
             
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


<div>
 <div className="relative">
                <select
  name="country"

  className="border w-full appearance-none border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue font-semibold"
>
  <option value="Canada">Canada</option>
</select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-darkblue pointer-events-none" />
                </div>
 </div>

{/* Submit Button */}
<div>
  <button type="submit" className="bg-darkblue text-white px-4 py-2 rounded-full w-full mt-4">Sign Up</button>
</div>

</form>

      </div>
      
      </div>
    </div>
    </>
  );
};

export default Officesignup;