import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Download, Plus, ChevronDown, Loader2, Building2 } from "lucide-react";

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

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

const Clinics = ({ token, useMockData = false, apiBaseUrl = BASE_URL }) => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
          throw new Error("No authentication token found. Please login again.");
        }

        const response = await fetch(`${apiBaseUrl}admin/clinics`, {
          method: "GET",
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
        const authToken = localStorage.getItem("authToken");

        const response = await fetch(`${apiBaseUrl}admin/clinics/${id}/approve`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to approve clinic");
        }

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
        const authToken = localStorage.getItem("authToken");

        const response = await fetch(`${apiBaseUrl}admin/clinics/${id}/reject`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to reject clinic");
        }

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

  // Filter clinics based on search and status
  const filteredClinics = clinics.filter((clinic) => {
    const matchesSearch =
      clinic.clinic_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.city?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || clinic.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: clinics.length,
    pending: clinics.filter((c) => c.status === "pending").length,
    approved: clinics.filter((c) => c.status === "approved").length,
    rejected: clinics.filter((c) => c.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clinics</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and monitor all registered clinics
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span className="font-medium">Add Clinic</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Clinics</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <p className="text-2xl font-bold text-rose-600 mt-1">{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search clinics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
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
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Clinic Name
                    </span>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </span>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Location
                    </span>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </span>
                  </th>
                  <th className="px-6 py-3 text-right">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-16 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                      <p className="text-sm text-gray-500 mt-3">Loading clinics...</p>
                    </td>
                  </tr>
                ) : filteredClinics.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-16 text-center">
                      <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-900">No clinics found</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {searchQuery || statusFilter !== "all"
                          ? "Try adjusting your filters"
                          : "Get started by adding a new clinic"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredClinics.map((clinic) => (
                    <tr key={clinic.id} className="hover:bg-gray-50 transition-colors">
                      {/* Clinic Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {clinic.clinic_name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">
                              {clinic.clinic_name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              @{clinic.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
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
                                ? "bg-emerald-600"
                                : clinic.status === "rejected"
                                ? "bg-rose-600"
                                : "bg-amber-500"
                            }`}
                          ></span>
                          {clinic.status.charAt(0).toUpperCase() + clinic.status.slice(1)}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {clinic.city}, {clinic.province}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900">{clinic.email}</div>
                          <div className="text-xs text-gray-500">{clinic.phone}</div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        {clinic.status === "pending" ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleApprove(clinic.id)}
                              disabled={processingId === clinic.id}
                              className="px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                              className="px-3 py-1.5 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end">
                            <button className="px-4 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                              View Details
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {!loading && filteredClinics.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Showing {filteredClinics.length} of {clinics.length} clinics
                </span>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    Previous
                  </button>
                  <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clinics;