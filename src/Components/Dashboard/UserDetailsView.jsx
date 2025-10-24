import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Shield, CheckCircle, XCircle, Loader2, User, Clock } from "lucide-react";

const UserDetailsView = () => {
  const params = useParams();
  const userId = params.id;
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      
      if (!userId || userId === 'undefined') {
        throw new Error("User ID is missing from the URL");
      }
      
      const token = localStorage.getItem("accessToken") || 
                    localStorage.getItem("token") ||
                    localStorage.getItem("authToken");
      
      if (!token) {
        console.error("No token found");
        navigate("/login");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      const response = await fetch(`${BASE_URL}admin/users/${userId}`, {
        method: "GET",
        credentials: "include",
        headers: headers,
      });

      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error("Server returned non-JSON response");
      }

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }
        
        // Fallback: Try to fetch from users list
        try {
          const usersResponse = await fetch(`${BASE_URL}admin/users`, {
            method: "GET",
            credentials: "include",
            headers: headers,
          });

          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            const users = usersData.data || usersData.users || usersData;
            const foundUser = users.find(u => u._id === userId || u.id === userId);
            
            if (foundUser) {
              setUser(foundUser);
              setError(null);
              setLoading(false);
              return;
            }
          }
        } catch (fallbackErr) {
          console.error("Fallback also failed:", fallbackErr);
        }
        
        throw new Error(data.error || data.message || `Failed to fetch user: ${response.statusText}`);
      }

      console.log("Raw API response data:", data);
      
      // API returns {success: true, data: {user: {...}, profile: {...}}}
      let responseData = data.data || data;
      
      console.log("Extracted responseData:", responseData);
      console.log("responseData.user:", responseData.user);
      console.log("responseData.profile:", responseData.profile);

      // Check if responseData contains both user and profile
      if (responseData.user && responseData.profile) {
        // Backend returns { user: {...}, profile: {...} }
        const completeUserData = {
          ...responseData.user,
          profile: responseData.profile
        };
        console.log("Setting user data (merged):", completeUserData);
        setUser(completeUserData);
      } else if (responseData.user) {
        // Only user data, no profile
        console.log("Setting user data (user only):", responseData.user);
        setUser(responseData.user);
      } else {
        // Fallback: responseData is the user object itself
        console.log("Setting user data (fallback):", responseData);
        setUser(responseData);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const handleApprove = async () => {
    if (!user || !user.email) {
      setActionMessage({ type: "error", text: "User email not found" });
      return;
    }

    try {
      setActionLoading(true);
      setActionMessage(null);
      
      const token = localStorage.getItem("accessToken") || 
                    localStorage.getItem("token") ||
                    localStorage.getItem("authToken");

      const approveResponse = await fetch(`${BASE_URL}admin/users/${userId}/approve`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!approveResponse.ok) {
        throw new Error("Failed to approve user");
      }

      const resetResponse = await fetch(`${BASE_URL}auth/request-password-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email
        }),
      });

      if (!resetResponse.ok) {
        throw new Error("User approved but failed to send password reset email");
      }

      setActionMessage({ 
        type: "success", 
        text: "User approved successfully! Password reset email sent." 
      });
      
      await fetchUserDetails();
    } catch (err) {
      console.error("Error approving user:", err);
      setActionMessage({ type: "error", text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async () => {
    const confirmed = window.confirm("Are you sure you want to decline this user? This action cannot be undone.");
    if (!confirmed) return;

    try {
      setActionLoading(true);
      setActionMessage(null);
      
      const token = localStorage.getItem("accessToken") || 
                    localStorage.getItem("token") ||
                    localStorage.getItem("authToken");

      const response = await fetch(`${BASE_URL}admin/users/${userId}/decline`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to decline user");
      }

      setActionMessage({ 
        type: "success", 
        text: "User declined successfully." 
      });
      
      await fetchUserDetails();
    } catch (err) {
      console.error("Error declining user:", err);
      setActionMessage({ type: "error", text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "approved" || statusLower === "active") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else if (statusLower === "pending") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    } else if (statusLower === "rejected" || statusLower === "inactive") {
      return "bg-red-50 text-red-700 border-red-200";
    }
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getAvatarUrl = (user) => {
    if (user?.avatar || user?.profileImage) {
      return user.avatar || user.profileImage;
    }
    const seed = user?.first_name || user?.email || user?._id;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm text-gray-500">Loading user details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="text-red-600 text-center">
                <p className="font-semibold">Error loading user details</p>
                <p className="text-sm text-gray-500 mt-1">{error}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                >
                  Go Back
                </button>
                <button
                  onClick={fetchUserDetails}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <p className="text-center text-gray-500">User not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Users</span>
          </button>
        </div>

        {/* Action Message */}
        {actionMessage && (
          <div className={`p-4 rounded-lg border ${
            actionMessage.type === "success" 
              ? "bg-green-50 border-green-200 text-green-800" 
              : "bg-red-50 border-red-200 text-red-800"
          }`}>
            <p className="text-sm font-medium">{actionMessage.text}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-lightblue h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="flex items-end gap-4">
                <img
                  src={getAvatarUrl(user)}
                  alt={user?.first_name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
                <div className="mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </h1>
                  <p className="text-gray-500 capitalize">{user?.role || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border capitalize ${getStatusColor(user?.approval_status)}`}>
                  {user?.approval_status || "N/A"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {user?.approval_status?.toLowerCase() === "pending" && (
              <div className="flex gap-3 mb-6 pb-6 border-b border-gray-200">
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {actionLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  Approve User
                </button>
                <button
                  onClick={handleDecline}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {actionLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  Decline User
                </button>
              </div>
            )}

            {/* User Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">{user?.email || "N/A"}</p>
                      {user?.email_verified_at && (
                        <p className="text-xs text-emerald-600 mt-1">✓ Verified</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900">{user?.mobile || "N/A"}</p>
                      {user?.phone_verified_at && (
                        <p className="text-xs text-emerald-600 mt-1">✓ Verified</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-sm text-gray-900">
                        {user?.profile?.professional_info?.city && user?.profile?.professional_info?.province 
                          ? `${user.profile.professional_info.city}, ${user.profile.professional_info.province}${user.profile.professional_info.zipcode ? ` ${user.profile.professional_info.zipcode}` : ''}`
                          : user?.city && user?.province 
                          ? `${user.city}, ${user.province}${user.zipcode ? ` ${user.zipcode}` : ''}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Account Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Role</p>
                      <p className="text-sm text-gray-900 capitalize">{user?.role || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Account Status</p>
                      <p className="text-sm text-gray-900">
                        {user?.is_active ? (
                          <span className="text-emerald-600">Active</span>
                        ) : (
                          <span className="text-red-600">Inactive</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Joined</p>
                      <p className="text-sm text-gray-900">{formatDate(user?.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Updated</p>
                      <p className="text-sm text-gray-900">{formatDate(user?.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Professional Information */}
          {user?.profile?.professional_info && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Professional Information</h3>
              <div className="space-y-3">
                {user.profile.professional_info.current_position && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600">Position</span>
                    <span className="text-sm font-medium text-gray-900 text-right">{user.profile.professional_info.current_position}</span>
                  </div>
                )}
                {user.profile.professional_info.years_experience && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Experience</span>
                    <span className="text-sm font-medium text-gray-900">{user.profile.professional_info.years_experience} years</span>
                  </div>
                )}
                {user.profile.professional_info.certifications?.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600 block mb-2">Certifications</span>
                    <div className="flex flex-wrap gap-1">
                      {user.profile.professional_info.certifications.map((cert, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                          {typeof cert === 'string' ? cert : JSON.stringify(cert)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {user.profile.professional_info.skills?.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600 block mb-2">Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {user.profile.professional_info.skills.map((skill, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded">
                          {typeof skill === 'string' ? skill : JSON.stringify(skill)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Work Preferences */}
          {user?.profile?.work_preferences && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Work Preferences</h3>
              <div className="space-y-3">
                {user.profile.work_preferences.preferred_shifts?.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600 block mb-2">Preferred Shifts</span>
                    <div className="flex flex-wrap gap-1">
                      {user.profile.work_preferences.preferred_shifts.map((shift, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded capitalize">
                          {typeof shift === 'string' ? shift : JSON.stringify(shift)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {user.profile.work_preferences.max_travel_distance && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Max Travel Distance</span>
                    <span className="text-sm font-medium text-gray-900">{user.profile.work_preferences.max_travel_distance} km</span>
                  </div>
                )}
                {user.profile.work_preferences.hourly_rate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Hourly Rate</span>
                    {/* <span className="text-sm font-medium text-gray-900">${user.profile.work_preferences.hourly_rate}</span> */}
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Willing to Travel</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user.profile.work_preferences.willing_to_travel ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Security</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Email Verified</span>
                <span className={`text-sm font-medium ${user?.is_verified ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {user?.is_verified ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Login Attempts</span>
                <span className="text-sm font-medium text-gray-900">{user?.login_attempts || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">OTP Attempts</span>
                <span className="text-sm font-medium text-gray-900">{user?.otp_attempts || 0}</span>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Preferences</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Language</span>
                <span className="text-sm font-medium text-gray-900 uppercase">
                  {user?.preferences?.language || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Timezone</span>
                <span className="text-sm font-medium text-gray-900">
                  {user?.preferences?.timezone || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        {user?.profile?.performance_metrics && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Shifts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user.profile.performance_metrics.total_shifts_completed !== undefined 
                    ? user.profile.performance_metrics.total_shifts_completed 
                    : 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user.profile.performance_metrics.average_rating !== undefined && user.profile.performance_metrics.average_rating !== null
                    ? `${Number(user.profile.performance_metrics.average_rating).toFixed(1)} ⭐` 
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Reliability Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user.profile.performance_metrics.reliability_score !== undefined && user.profile.performance_metrics.reliability_score !== null
                    ? `${Number(user.profile.performance_metrics.reliability_score)}%` 
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">On-Time Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user.profile.performance_metrics.on_time_arrival_rate !== undefined && user.profile.performance_metrics.on_time_arrival_rate !== null
                    ? `${Number(user.profile.performance_metrics.on_time_arrival_rate)}%` 
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailsView;