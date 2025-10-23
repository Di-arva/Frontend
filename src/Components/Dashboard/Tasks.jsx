import React, { useState, useEffect } from "react";
import { MoreVertical, Loader2, Calendar, Clock, DollarSign, MapPin } from "lucide-react";

const mockTasks = [
  {
    id: 1,
    role: "Dental Hygienist",
    clinic_name: "Downtown Medical Clinic",
    date: "2025-10-22",
    start_time: "09:00",
    end_time: "17:00",
    hourly_rate: 45,
    city: "Toronto",
    province: "ON",
    status: "open",
    description: "Need experienced hygienist for general cleaning procedures",
  },
  {
    id: 2,
    role: "Dental Assistant",
    clinic_name: "Riverside Health Center",
    date: "2025-10-23",
    start_time: "08:00",
    end_time: "16:00",
    hourly_rate: 35,
    city: "Ottawa",
    province: "ON",
    status: "filled",
    description: "Assist with surgical procedures",
  },
  {
    id: 3,
    role: "Receptionist",
    clinic_name: "Family Care Clinic",
    date: "2025-10-24",
    start_time: "09:00",
    end_time: "17:00",
    hourly_rate: 25,
    city: "Mississauga",
    province: "ON",
    status: "open",
    description: "Front desk support and patient coordination",
  },
  {
    id: 4,
    role: "Dental Hygienist",
    clinic_name: "North End Medical",
    date: "2025-10-25",
    start_time: "10:00",
    end_time: "18:00",
    hourly_rate: 48,
    city: "Hamilton",
    province: "ON",
    status: "cancelled",
    description: "Pediatric dental care",
  },
];

const Tasks = ({ useMockData = false, apiBaseUrl = "http://localhost:1080/api/v1/" }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      if (useMockData) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setTasks(mockTasks);
      } else {
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
          throw new Error('No authentication token found. Please login again.');
        }

        const response = await fetch(`${apiBaseUrl}clinic/tasks`, {
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
        setTasks(data.tasks || data.data || data || []);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this shift?")) return;
    setProcessingId(id);

    try {
      if (useMockData) {
        await new Promise((r) => setTimeout(r, 800));
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: "cancelled" } : t))
        );
      } else {
        const authToken = localStorage.getItem('authToken');
        
        const response = await fetch(`${apiBaseUrl}clinic/tasks/${id}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "cancelled" }),
        });

        if (!response.ok) {
          throw new Error('Failed to cancel shift');
        }

        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: "cancelled" } : t))
        );
      }
    } catch (err) {
      console.error("Failed to cancel shift:", err);
      alert("Failed to cancel shift. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'filled':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'completed':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">All Shifts</h2>
          <span className="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
            {tasks.length} shifts
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
            onClick={fetchTasks}
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
                Role & Clinic
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
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
            ) : tasks.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-10 text-center text-gray-500 text-sm"
                >
                  No shifts found.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  {/* Role & Clinic */}
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {task.role}
                      </div>
                      <div className="text-sm text-gray-500">
                        {task.clinic_name}
                      </div>
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(task.date)}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {formatTime(task.start_time)} - {formatTime(task.end_time)}
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {task.city}, {task.province}
                    </div>
                  </td>

                  {/* Rate */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      {task.hourly_rate}/hr
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          task.status === "open"
                            ? "bg-blue-500"
                            : task.status === "filled"
                            ? "bg-green-500"
                            : task.status === "cancelled"
                            ? "bg-red-500"
                            : "bg-gray-400"
                        }`}
                      ></span>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {task.status === "open" ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleCancel(task.id)}
                          disabled={processingId === task.id}
                          className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 transition"
                        >
                          {processingId === task.id ? (
                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                          ) : (
                            "Cancel"
                          )}
                        </button>
                        <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition">
                          Edit
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

export default Tasks;