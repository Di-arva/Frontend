import  { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Users } from 'lucide-react';

const UserDetailsPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from sessionStorage
    const userData = sessionStorage.getItem('selectedUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleApprove = () => {
    console.log('Approved user:', user.id);
    // Add your approval logic here
    // After approval, redirect back
    window.history.back();
  };

  const handleDecline = () => {
    console.log('Declined user:', user.id);
    // Add your decline logic here
    // After decline, redirect back
    window.history.back();
  };

  const handleBack = () => {
    window.history.back();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Loading user details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightblue rounded-4xl py-8 font-poppins">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-darkblue hover:text-darkblue/60 hover:cursor-pointer mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to All Users</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200">
            <h1 className="text-2xl font-normal text-darkblue">User Details</h1>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* User Profile Section */}
            <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-200">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-normal text-darkblack">{user.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">User Number :# {user.id}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                    user.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 
                    'bg-amber-50 text-amber-700'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      user.status === 'Approved' ? 'bg-emerald-700' : 
                      'bg-amber-400'
                    }`}></span>
                    {user.status}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="inline-block px-3 py-1 bg-lightblue text-darkblue text-sm font-medium rounded-full">
                    {user.role}
                  </span>
                  <span className="inline-block px-3 mx-2 py-1 bg-lightblue text-darkblue text-sm font-medium rounded-full">
                    {user.certification}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="text-lg font-normal text-darkblue mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-lightblue rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-darkblue" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-darkblack/50 uppercase mb-1">Email Address</p>
                    <p className="text-sm text-darkblue">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-lightblue rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-darkblue" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-darkblack/50 uppercase mb-1">Phone Number</p>
                    <p className="text-sm text-darkblue">{user.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-lightblue rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-darkblue" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-darkblack/50 uppercase mb-1">Role</p>
                    <p className="text-sm text-darkblue">{user.role} : {user.certification}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-lightblue rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-darkblue" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-darkblack/50 uppercase mb-1">Location</p>
                    <p className="text-sm text-darkblue">San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>

       

            {/* Additional Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-normal text-darkblue mb-4">Additional Information</h3>
              <div className="space-y-3">
       
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Account Status</span>
                  <span className="text-sm font-medium text-gray-900">{user.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium text-gray-900">January 2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          {user.status === 'Pending' && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={handleDecline}
                className="px-6 py-2.5 text-sm font-medium text-darkblue bg-lightbg border border-darkblue rounded-full hover:bg-darkblue/80 hover:cursor-pointer hover:text-lightbg transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleApprove}
                className="px-6 py-2.5 text-sm font-medium text-white bg-darkblue rounded-full hover:bg-darkblue/70 hover:cursor-pointer transition-colors"
              >
                Approve User
              </button>
            </div>
          )}

          {user.status === 'Approved' && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={handleBack}
                className="px-6 py-2.5 text-sm font-medium text-white bg-darkblue rounded-full hover:bg-darkblue/70 hover:cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;