import { useState, useEffect } from "react";
import { Save, MapPin, Phone, Building2, CircleParking, X, ChevronDown } from "lucide-react";







const ClinicProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [clinicProfile, setClinicProfile] = useState({
    clinic_name: "",
    address: {
      address_line: "",
      city: "",
      province: "",
      postal_code: "",
    },
    contact: {
      phone: ""
    },
    parking_info: {
      type: "",
      details: ""
    }
  });

  const [editedParking, setEditedParking] = useState({
    type: "",
    details: ""
  });

  useEffect(() => {
    fetchClinicProfile();
  }, []);

  const fetchClinicProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const apiBaseUrl = import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:1080";
      
      const response = await fetch(`${apiBaseUrl}clinic/profile`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data && data.clinic_name) {
          setClinicProfile(data);
        }
      } else if (response.status === 404) {
        alert("Clinic profile not found. Please contact support.");
      } else {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }
    } catch (error) {
      alert("Failed to load clinic profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditedParking({
      type: clinicProfile.parking_info?.type || "",
      details: clinicProfile.parking_info?.details || ""
    });
    setIsEditing(true);
  };

  const handleSaveParking = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("authToken");
      const apiBaseUrl = import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:1080";

      const response = await fetch(`${apiBaseUrl}clinic/profile`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          parking_info: editedParking
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update parking information");
      }

      const result = await response.json();
      
      setClinicProfile(prev => ({
        ...prev,
        parking_info: editedParking
      }));
      setIsEditing(false);
      alert("Parking information updated successfully!");
      
    } catch (error) {
      alert(`Failed to update parking information: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-darkblue">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-blue-50 rounded-3xl min-h-screen font-poppins">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-normal text-darkblack mb-1">Clinic Profile</h1>
          <p className="text-gray-600">View your clinic information</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          {/* Clinic Name Header */}
          <div className="flex items-start justify-between mb-6 pb-6 border-b border-blue-100">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-darkblue" />
              <h3 className="text-lg font-normal text-darkblack">
                {clinicProfile.clinic_name}
              </h3>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-darkblue" />
                <h3 className="text-base font-semibold text-darkblue">Contact:</h3>
                <p className="text-base text-gray-600">{clinicProfile.contact?.phone}</p>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-darkblue" />
                <h3 className="text-base font-semibold text-darkblue">Address:</h3>
                <p className="text-base text-gray-600">
                  {clinicProfile.address?.address_line}, {clinicProfile.address?.city}, {clinicProfile.address?.province} {clinicProfile.address?.postal_code}
                </p>
              </div>
            </div>
          </div>

          {/* Parking Information Card */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CircleParking className="w-5 h-5 text-darkblue" />
                <h3 className="text-lg font-semibold text-darkblue">
                  Parking Information
                </h3>
              </div>

              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="text-darkblue hover:text-darkblue/80 hover:cursor-pointer font-medium text-sm "
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleSaveParking}
                  disabled={isSubmitting || !editedParking.type}
                  className="text-darkblue  hover:text-darkblue/80 font-medium text-sm disabled:text-darkblue/80 disabled:cursor-not-allowed flex items-center gap-1  hover:cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-darkblack font-medium">Type:</p>
                  <span className="inline-block px-4 py-1.5 bg-darkblue rounded-full text-sm font-medium text-lightbg capitalize border">
  {clinicProfile.parking_info?.type ? `${clinicProfile.parking_info.type} Parking` : "Not set"}
</span>
                </div>
                <div className="flex items-baseline gap-2">
  <p className="text-sm text-darkblack font-medium">Details:</p>
  <p className="text-base text-darkblack ">
    {clinicProfile.parking_info?.details || "No details provided"}
  </p>
</div>

              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-darkblack mb-2">
                    Type <span className="text-red-700">*</span>
                  </label>
                  <select
                    value={editedParking.type}
                    onChange={(e) => setEditedParking(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full appearance-none px-4 py-2 border border-darkblue rounded-full focus:ring-2 focus:ring-darkblue focus:border-darkblue hover:cursor-pointer"
                    required
                  >
                    <option value="">Select parking type</option>
                    <option value="private">Private Parking</option>
                    <option value="public">Public Parking</option>
                    <option value="street">Street Parking</option>
                    <option value="none">No Parking</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-12 -translate-y-1/2 w-5 h-5 text-darkblue pointer-events-none " />
                </div>

                <div>
                  <label className="block text-sm font-medium text-darkblack mb-2">
                    Details
                  </label>
                  <textarea
                    value={editedParking.details}
                    onChange={(e) => setEditedParking(prev => ({ ...prev, details: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 border border-darkblue rounded-2xl focus:ring-2 focus:ring-darkblue focus:border-darkblue placeholder:text-darkblue/50"
                    placeholder="Opposite to Queen Streert parking is available and charges are $2 per hour"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicProfilePage;