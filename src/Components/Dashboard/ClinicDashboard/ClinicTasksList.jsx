import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  XCircle,
  Loader,
} from "lucide-react";
import Button from "../../Button";
const ClinicTasksList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetailLoading, setTaskDetailLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [filters, setFilters] = useState({
    status: [],
    priority: "",
    certification_level: "",
    specialization: "",
    start_from: "",
    start_to: "",
    sort_by: "schedule.start_datetime",
    sort_dir: "asc",
  });

  const [showFilters, setShowFilters] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      params.append("page", pagination.page);
      params.append("limit", pagination.limit);

      if (filters.status && filters.status.length > 0) {
        params.append("status", filters.status.join(","));
      }
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.certification_level)
        params.append("certification_level", filters.certification_level);
      if (filters.specialization)
        params.append("specialization", filters.specialization);
      if (filters.start_from)
        params.append("start_from", new Date(filters.start_from).toISOString());
      if (filters.start_to)
        params.append("start_to", new Date(filters.start_to).toISOString());
      if (filters.sort_by) params.append("sort_by", filters.sort_by);
      if (filters.sort_dir) params.append("sort_dir", filters.sort_dir);

      const apiBaseUrl =
        import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:1080";
      const url = `${apiBaseUrl}clinic/tasks?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        setError(
          `Session expired or invalid token. Please log in again. ${
            errorData.message || ""
          }`
        );
        setLoading(false);
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch tasks");
      }

      if (result.success) {
        setTasks(result.data || []);
        setPagination({
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: result.pages,
        });
      } else {
        throw new Error("Failed to fetch tasks");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskDetails = async (taskId) => {
    setTaskDetailLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please log in.");
        return;
      }

      let payload;
      try {
        payload = JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
        alert("Invalid token format.");
        return;
      }

      if (payload.exp && payload.exp < Date.now() / 1000) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("authToken");
        return;
      }

      const apiBaseUrl = import.meta.env.VITE_SERVER_BASE_URL;
      const url = `${apiBaseUrl}clinic/tasks/${taskId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("authToken");
        alert("Session expired. Redirecting to login...");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch task");
      }

      setSelectedTask(result.data);
      setEditFormData(result.data);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setTaskDetailLoading(false);
    }
  };

  const updateTask = async (taskId) => {
    setUpdateLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please log in.");
        return;
      }

      const apiBaseUrl = import.meta.env.VITE_SERVER_BASE_URL;
      const url = `${apiBaseUrl}clinic/tasks/${taskId}`;

      // Debug: Log the current editFormData to see what we're working with
      console.log("Current editFormData:", editFormData);
      console.log("Schedule data:", editFormData?.schedule);
      console.log("Duration hours:", editFormData?.schedule?.duration_hours);

      // Simple number cleaning function
      const cleanNumber = (val) => {
        if (val === null || val === undefined || val === "") return 0;
        const num = parseFloat(val);
        return !isNaN(num) ? num : 0;
      };

      // Build the payload step by step to ensure all required fields are included
      const payload = {
        // Basic task info
        title: editFormData.title || "",
        description: editFormData.description || "",
        priority: editFormData.priority || "normal",
        max_applications: cleanNumber(editFormData.max_applications) || 1,
      };

      // Compensation - ensure structure is maintained
      payload.compensation = {
        hourly_rate: cleanNumber(editFormData.compensation?.hourly_rate),
        currency: editFormData.compensation?.currency || "USD",
        ...(editFormData.compensation?.total_amount !== undefined && {
          total_amount: cleanNumber(editFormData.compensation.total_amount),
        }),
        ...(editFormData.compensation?.payment_method && {
          payment_method: editFormData.compensation.payment_method,
        }),
        ...(editFormData.compensation?.payment_terms && {
          payment_terms: editFormData.compensation.payment_terms,
        }),
      };

      // SCHEDULE - This is the critical part
      // Ensure duration_hours is always present and valid
      const durationHours = cleanNumber(editFormData.schedule?.duration_hours);

      payload.schedule = {
        start_datetime:
          editFormData.schedule?.start_datetime || new Date().toISOString(),
        duration_hours: durationHours > 0 ? durationHours : 1, // Always include with minimum 1
        ...(editFormData.schedule?.end_datetime && {
          end_datetime: editFormData.schedule.end_datetime,
        }),
        ...(editFormData.schedule?.break_duration_minutes !== undefined && {
          break_duration_minutes: cleanNumber(
            editFormData.schedule.break_duration_minutes
          ),
        }),
      };

      // Requirements
      payload.requirements = {};
      if (editFormData.requirements?.certification_level) {
        payload.requirements.certification_level =
          editFormData.requirements.certification_level;
      }
      if (editFormData.requirements?.minimum_experience !== undefined) {
        payload.requirements.minimum_experience = cleanNumber(
          editFormData.requirements.minimum_experience
        );
      }
      if (editFormData.requirements?.required_specializations?.length > 0) {
        payload.requirements.required_specializations =
          editFormData.requirements.required_specializations;
      }
      if (editFormData.requirements?.preferred_skills?.length > 0) {
        payload.requirements.preferred_skills =
          editFormData.requirements.preferred_skills;
      }

      // Debug: Log the final payload before sending
      console.log(
        "Final payload being sent:",
        JSON.stringify(payload, null, 2)
      );
      console.log("Schedule in payload:", payload.schedule);
      console.log(
        "Duration hours in payload:",
        payload.schedule.duration_hours
      );

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        localStorage.removeItem("authToken");
        alert("Session expired. Please log in again.");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        console.error("Backend error response:", result);
        throw new Error(
          result.error || result.message || "Failed to update task"
        );
      }

      alert("Shift updated successfully!");
      setIsEditMode(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (err) {
      console.error("Update error details:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleEditChange = (field, value) => {
    setEditFormData((prev) => {
      const newData = { ...prev };
      const keys = field.split(".");

      if (keys.length === 1) {
        newData[keys[0]] = value;
      } else if (keys.length === 2) {
        // Handle nested object updates
        newData[keys[0]] = {
          ...newData[keys[0]],
          [keys[1]]: value,
        };
      }

      return newData;
    });
  };

  useEffect(() => {
    fetchTasks();
  }, [pagination.page, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleStatusToggle = (status) => {
    setFilters((prev) => {
      const currentStatuses = prev.status || [];
      const newStatuses = currentStatuses.includes(status)
        ? currentStatuses.filter((s) => s !== status)
        : [...currentStatuses, status];
      return { ...prev, status: newStatuses };
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const resetFilters = () => {
    setFilters({
      status: [],
      priority: "",
      certification_level: "",
      specialization: "",
      start_from: "",
      start_to: "",
      sort_by: "schedule.start_datetime",
      sort_dir: "asc",
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: "bg-blue-100 text-blue-700",
      assigned: "bg-yellow-100 text-yellow-700",
      in_progress: "bg-purple-100 text-purple-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: "bg-gray-100 text-gray-700",
      normal: "bg-blue-100 text-blue-700",
      high: "bg-orange-100 text-orange-700",
      urgent: "bg-red-100 text-red-700",
    };
    return styles[priority] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-darkblue animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-lightblue rounded-4xl min-h-screen font-poppins">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-normal text-darkblack mb-4">
            Posted Shifts
          </h3>
          <span className="px-3 py-1  text-lightbg bg-darkblue rounded-full text-sm font-medium">
            {pagination.total} Total Shift{pagination.total !== 1 ? "s" : ""}
          </span>
        </div>
        <Button
          variant="dark"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2rounded-lgtransition-colors "
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-800">Error</h4>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {showFilters && (
        <div className="bg-lightbg rounded-3xl p-6 shadow-sm border border-darkblue">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status (Multiple)
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "open",
                  "assigned",
                  "in_progress",
                  "completed",
                  "cancelled",
                ].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusToggle(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.status.includes(status)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) =>
                    handleFilterChange("priority", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certification Level
                </label>
                <select
                  value={filters.certification_level}
                  onChange={(e) =>
                    handleFilterChange("certification_level", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Levels</option>
                  <option value="Level_I">Level I</option>
                  <option value="Level_II">Level II</option>
                  <option value="RDA">RDA</option>
                  <option value="CDA">CDA</option>
                  <option value="PDA">PDA</option>
                  <option value="Any">Any</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start From
                </label>
                <input
                  type="date"
                  value={filters.start_from}
                  onChange={(e) =>
                    handleFilterChange("start_from", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No shifts found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or post a new shift
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="bg-lightbg rounded-xl p-6 shadow-sm border border-darkblue/30 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-normal text-darkblack mb-2">
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                        task.status
                      )}`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getPriorityBadge(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    {task.requirements?.certification_level && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium capitalize bg-purple-100 text-purple-700">
                        {task.requirements.certification_level.replace(
                          "_",
                          " "
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-darkblue">
                    ${task.compensation?.hourly_rate}
                  </div>
                  <div className="text-sm text-darkblack capitalize">
                    per hour
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-darkblack">
                  <Calendar className="w-4 h-4 text-darkblue" />
                  <span>{formatDate(task.schedule?.start_datetime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-darkblack">
                  <Clock className="w-4 h-4 text-darkblue" />
                  <span>{task.schedule?.duration_hours} hours</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-darkblack">
                  <Users className="w-4 h-4 text-darkblue" />
                  <span>
                    {task.applications_count || 0} / {task.max_applications}{" "}
                    applicants
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-lightblue">
                <span className="text-sm text-darkblack">
                  Posted:{" "}
                  <span className="text-darkblue">
                    {formatDate(task.posted_at)}
                  </span>
                </span>
                <Button
                  onClick={() => fetchTaskDetails(task._id)}
                  variant="dark"
                  size="sm"
                  className=" transition-colors "
                >
                  View Details
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {pagination.pages > 1 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-lightblue">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
              <h3 className="text-2xl font-bold text-darkblue text-md">
                {isEditMode ? "Edit Shift" : "Shift Details"}
              </h3>
              <button
                onClick={() => {
                  setSelectedTask(null);
                  setIsEditMode(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {taskDetailLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : isEditMode ? (
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editFormData?.title || ""}
                    onChange={(e) => handleEditChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editFormData?.description || ""}
                    onChange={(e) =>
                      handleEditChange("description", e.target.value)
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={editFormData?.priority || "normal"}
                    onChange={(e) =>
                      handleEditChange("priority", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="bg-green-50 rounded-lg p-4 space-y-4">
                  <h4 className="font-semibold text-gray-800">Compensation</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hourly Rate
                      </label>
                      <input
                        type="number"
                        value={editFormData?.compensation?.hourly_rate || ""}
                        onChange={(e) =>
                          handleEditChange(
                            "compensation.hourly_rate",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Amount
                      </label>
                      <input
                        type="number"
                        value={editFormData?.compensation?.total_amount || ""}
                        onChange={(e) =>
                          handleEditChange(
                            "compensation.total_amount",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                      </label>
                      <input
                        type="text"
                        value={editFormData?.compensation?.payment_method || ""}
                        onChange={(e) =>
                          handleEditChange(
                            "compensation.payment_method",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Terms
                      </label>
                      <input
                        type="text"
                        value={editFormData?.compensation?.payment_terms || ""}
                        onChange={(e) =>
                          handleEditChange(
                            "compensation.payment_terms",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <h4 className="font-semibold text-gray-800">Schedule</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date/Time
                      </label>
                      <input
                        type="datetime-local"
                        value={
                          editFormData?.schedule?.start_datetime
                            ? new Date(editFormData.schedule.start_datetime)
                                .toISOString()
                                .slice(0, 16)
                            : ""
                        }
                        onChange={(e) =>
                          handleEditChange(
                            "schedule.start_datetime",
                            new Date(e.target.value).toISOString()
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date/Time
                      </label>
                      <input
                        type="datetime-local"
                        value={
                          editFormData?.schedule?.end_datetime
                            ? new Date(editFormData.schedule.end_datetime)
                                .toISOString()
                                .slice(0, 16)
                            : ""
                        }
                        onChange={(e) =>
                          handleEditChange(
                            "schedule.end_datetime",
                            new Date(e.target.value).toISOString()
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (hours) *
                      </label>
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={editFormData?.schedule?.duration_hours || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Ensure we always have a valid number
                          const numValue =
                            value === "" ? 1 : parseFloat(value) || 1;
                          handleEditChange("schedule.duration_hours", numValue);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Break (minutes)
                      </label>
                      <input
                        type="number"
                        value={
                          editFormData?.schedule?.break_duration_minutes || ""
                        }
                        onChange={(e) =>
                          handleEditChange(
                            "schedule.break_duration_minutes",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Applications
                  </label>
                  <input
                    type="number"
                    value={editFormData?.max_applications || ""}
                    onChange={(e) =>
                      handleEditChange(
                        "max_applications",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="bg-blue-50 rounded-lg p-4 space-y-4">
                  <h4 className="font-semibold text-gray-800">Requirements</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Certification Level
                      </label>
                      <select
                        value={
                          editFormData?.requirements?.certification_level || ""
                        }
                        onChange={(e) =>
                          handleEditChange(
                            "requirements.certification_level",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Select Level</option>
                        <option value="Level_I">Level I</option>
                        <option value="Level_II">Level II</option>
                        <option value="RDA">RDA</option>
                        <option value="CDA">CDA</option>
                        <option value="PDA">PDA</option>
                        <option value="Any">Any</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Experience (years)
                      </label>
                      <input
                        type="number"
                        value={
                          editFormData?.requirements?.minimum_experience || ""
                        }
                        onChange={(e) =>
                          handleEditChange(
                            "requirements.minimum_experience",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsEditMode(false)}
                    disabled={updateLoading}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => updateTask(selectedTask._id)}
                    disabled={updateLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {updateLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {selectedTask.title}
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        selectedTask.status
                      )}`}
                    >
                      {selectedTask.status.replace("_", " ")}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadge(
                        selectedTask.priority
                      )}`}
                    >
                      {selectedTask.priority}
                    </span>
                    {selectedTask.requirements?.certification_level && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {selectedTask.requirements.certification_level.replace(
                          "_",
                          " "
                        )}
                      </span>
                    )}
                  </div>
                  {selectedTask.description && (
                    <p className="text-gray-700">{selectedTask.description}</p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Schedule
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start:</span>
                      <span className="font-medium text-gray-800">
                        {formatDate(selectedTask.schedule?.start_datetime)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">End:</span>
                      <span className="font-medium text-gray-800">
                        {formatDate(selectedTask.schedule?.end_datetime)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium text-gray-800">
                        {selectedTask.schedule?.duration_hours} hours
                      </span>
                    </div>
                    {selectedTask.schedule?.break_duration_minutes && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Break:</span>
                        <span className="font-medium text-gray-800">
                          {selectedTask.schedule.break_duration_minutes} minutes
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Compensation
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hourly Rate:</span>
                      <span className="font-bold text-gray-800 text-lg">
                        ${selectedTask.compensation?.hourly_rate}{" "}
                        {selectedTask.compensation?.currency}
                      </span>
                    </div>
                    {selectedTask.compensation?.total_amount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-medium text-gray-800">
                          ${selectedTask.compensation.total_amount}{" "}
                          {selectedTask.compensation.currency}
                        </span>
                      </div>
                    )}
                    {selectedTask.compensation?.payment_method && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium text-gray-800">
                          {selectedTask.compensation.payment_method}
                        </span>
                      </div>
                    )}
                    {selectedTask.compensation?.payment_terms && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Terms:</span>
                        <span className="font-medium text-gray-800">
                          {selectedTask.compensation.payment_terms}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Requirements
                  </h4>
                  <div className="space-y-3 text-sm">
                    {selectedTask.requirements?.minimum_experience && (
                      <div>
                        <span className="text-gray-600">
                          Minimum Experience:
                        </span>
                        <span className="font-medium text-gray-800 ml-2">
                          {selectedTask.requirements.minimum_experience} years
                        </span>
                      </div>
                    )}
                    {selectedTask.requirements?.required_specializations &&
                      selectedTask.requirements.required_specializations
                        .length > 0 && (
                        <div>
                          <span className="text-gray-600 block mb-2">
                            Required Specializations:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {selectedTask.requirements.required_specializations.map(
                              (spec, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                                >
                                  {spec}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    {selectedTask.requirements?.preferred_skills &&
                      selectedTask.requirements.preferred_skills.length > 0 && (
                        <div>
                          <span className="text-gray-600 block mb-2">
                            Preferred Skills:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {selectedTask.requirements.preferred_skills.map(
                              (skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                                >
                                  {skill}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Applications
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Current Applications:
                      </span>
                      <span className="font-medium text-gray-800">
                        {selectedTask.applications_count || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Maximum Applications:
                      </span>
                      <span className="font-medium text-gray-800">
                        {selectedTask.max_applications}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Posted:</span>
                      <span className="font-medium text-gray-800">
                        {formatDate(selectedTask.posted_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Edit Shift
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicTasksList;
