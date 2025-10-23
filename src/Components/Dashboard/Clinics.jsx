import React, { useState, useEffect } from "react";
import { MoreVertical, Loader2 } from "lucide-react";

const mockClinics = [
  {
    id: 1,
    clinic_name: "Downtown Medical Clinic",
    first_name: "John",
    last_name: "Smith",
    username: "downtown",
    email: "john.smith@downtown-medical.com",
    phone: "+1 (555) 123-4567",
    city: "Toronto",
    province: "ON",
    status: "pending",
  },
  {
    id: 2,
    clinic_name: "Riverside Health Center",
    first_name: "Sarah",
    last_name: "Johnson",
    username: "riverside",
    email: "sarah.j@riverside-health.com",
    phone: "+1 (555) 987-6543",
    city: "Ottawa",
    province: "ON",
    status: "approved",
  },
  {
    id: 3,
    clinic_name: "Family Care Clinic",
    first_name: "Michael",
    last_name: "Brown",
    username: "familycare",
    email: "mbrown@familycare.com",
    phone: "+1 (555) 456-7890",
    city: "Mississauga",
    province: "ON",
    status: "approved",
  },
  {
    id: 4,
    clinic_name: "North End Medical",
    first_name: "Emily",
    last_name: "Davis",
    username: "northend",
    email: "emily@northend-med.com",
    phone: "+1 (555) 321-0987",
    city: "Hamilton",
    province: "ON",
    status: "pending",
  },
  {
    id: 5,
    clinic_name: "Wellness Plus Clinic",
    first_name: "David",
    last_name: "Wilson",
    username: "wellness",
    email: "david@wellnessplus.com",
    phone: "+1 (555) 678-1234",
    city: "Kitchener",
    province: "ON",
    status: "approved",
  },
];

const BASE_URL=import.meta.env.VITE_SERVER_BASE_URL

const Clinics = ({ token, useMockData = false, apiBaseUrl = BASE_URL }) => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    setLoading(true);
    setError(null);
    try {
      if (useMockData) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setClinics(mockClinics);
      } else {
        // Get token from localStorage (same key as login)
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
          throw new Error('No authentication token found. Please login again.');
        }

        const response = await fetch(`${apiBaseUrl}admin/clinics`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setClinics(data.clinics || data || []);
      }
    } catch (err) {
      console.error("Failed to fetch clinics:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this clinic?")) return;
    setProcessingId(id);

    try {
      if (useMockData) {
        await new Promise((r) => setTimeout(r, 800));
        setClinics((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: "approved" } : c))
        );
      } else {
        const authToken = localStorage.getItem('authToken');
        
        const response = await fetch(`${apiBaseUrl}admin/clinics/${id}/approve`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error('Failed to approve clinic');
        }

        // Update local state
        setClinics((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: "approved" } : c))
        );
      }
    } catch (err) {
      console.error("Failed to approve clinic:", err);
      alert("Failed to approve clinic. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this clinic?")) return;
    setProcessingId(id);

    try {
      if (useMockData) {
        await new Promise((r) => setTimeout(r, 800));
        setClinics((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: "rejected" } : c))
        );
      } else {
        const authToken = localStorage.getItem('authToken');
        
        const response = await fetch(`${apiBaseUrl}admin/clinics/${id}/reject`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error('Failed to reject clinic');
        }

        // Update local state
        setClinics((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: "rejected" } : c))
        );
      }
    } catch (err) {
      console.error("Failed to reject clinic:", err);
      alert("Failed to reject clinic. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">All Clinics</h2>
          <span className="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
            {clinics.length} clinics
          </span>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-6 py-4 bg-rose-50 border-b border-rose-100">
          <p className="text-sm text-rose-700">Error: {error}</p>
          <button 
            onClick={fetchClinics}
            className="mt-2 text-sm text-rose-800 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clinic Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-10 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                </td>
              </tr>
            ) : clinics.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-10 text-center text-gray-500 text-sm"
                >
                  No clinics found.
                </td>
              </tr>
            ) : (
              clinics.map((clinic) => (
                <tr key={clinic.id} className="hover:bg-gray-50">
                  {/* Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${clinic.first_name}+${clinic.last_name}`}
                        alt={clinic.clinic_name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {clinic.clinic_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{clinic.username}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        clinic.status === "approved"
                          ? "bg-emerald-50 text-emerald-700"
                          : clinic.status === "rejected"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          clinic.status === "approved"
                            ? "bg-emerald-700"
                            : clinic.status === "rejected"
                            ? "bg-rose-500"
                            : "bg-amber-400"
                        }`}
                      ></span>
                      {clinic.status.charAt(0).toUpperCase() +
                        clinic.status.slice(1)}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {clinic.city}, {clinic.province}
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {clinic.email}
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {clinic.phone}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {clinic.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApprove(clinic.id)}
                          disabled={processingId === clinic.id}
                          className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 disabled:opacity-50 transition"
                        >
                          {processingId === clinic.id ? (
                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                          ) : (
                            "Approve"
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(clinic.id)}
                          disabled={processingId === clinic.id}
                          className="px-3 py-1.5 bg-rose-600 text-white text-sm rounded hover:bg-rose-700 disabled:opacity-50 transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button className="text-sm font-medium text-blue-700 hover:text-blue-600">
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clinics;