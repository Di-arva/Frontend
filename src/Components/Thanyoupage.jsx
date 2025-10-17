import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Marklogo from "../assets/Diarva_mark.png"; 

const ThankYou = () => {
  const location = useLocation();
  
  // Match the property name from navigate state (businessName, not clinicname)
  const { 
    firstname = "User", 
    lastname = "", 
    businessName = "Your Business",  // ← Changed from clinicname
    type = "user"
  } = location.state || {};

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 font-poppins">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <img src={Marklogo} alt="Diarva Mark Logo" className="mx-auto h-20 w-auto" />
        
        <h2 className="mt-6 text-2xl font-bold text-darkblue sm:text-3xl">
          Thank You{firstname && lastname ? `, ${firstname} ${lastname}` : ''}!
        </h2>
        
        <p className="mt-4 text-lg font-semibold text-gray-800">
          {businessName}
        </p>
        
        <p className="mt-4 text-gray-600">
          Your {type === 'clinic' ? 'clinic' : ''} registration has been submitted and is now pending admin approval.
        </p>
        
        <p className="mt-2 text-gray-600">
          You will receive a notification once your account is approved and you can log in.
        </p>
        
        <Link
          to="/"
          className="mt-8 inline-block w-full rounded-full bg-darkblue px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;