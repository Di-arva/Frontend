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
  ChevronDown,
  XCircle,
  Loader,
  X,
} from "lucide-react";
import Button from "../../Button";
import ShiftDetailsModal from "./ShiftDetailsModal";

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

  // Active filters count for badge
  const activeFiltersCount = [
    filters.status.length,
    filters.priority,
    filters.certification_level,
    filters.specialization,
    filters.start_from,
    filters.start_to,
  ].filter(Boolean).length + (filters.status.length > 0 ? filters.status.length - 1 : 0);

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
          <span className="px-3 py-1 text-lightbg bg-darkblue rounded-full text-sm font-medium">
            {pagination.total} Total Shift{pagination.total !== 1 ? "s" : ""}
          </span>
        </div>
        <Button
          variant="dark"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-lightblue text-darkblack border border-darkblue text-xs rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-800">Error</h4>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {showFilters && (
        <div className="bg-lightbg rounded-3xl p-6 shadow-sm border border-darkblue/20">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-darkblue">Filter Shifts</h4>
            <div className="flex items-center gap-3">
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-darkblue hover:underline font-medium cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-darkblue  transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-darkblue hover:text-lightbg" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-darkblue mb-3">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "open", label: "Open" },
                  { value: "assigned", label: "Assigned" },
                  { value: "in_progress", label: "In Progress" },
                  { value: "completed", label: "Completed" },
                  { value: "cancelled", label: "Cancelled" },
                ].map((status) => (
                  <button
                    key={status.value}
                    onClick={() => handleStatusToggle(status.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      filters.status.includes(status.value)
                        ? "bg-darkblue text-white shadow-md"
                        : "bg-white text-darkblack border border-darkblue/30 hover:bg-darkblue hover:text-white"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Other Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Priority Filter */}
              <div className="relative">
                <label className="block text-sm font-medium text-darkblue mb-2">
                  Priority
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) =>
                    handleFilterChange("priority", e.target.value)
                  }
                  className="appearance-none w-full px-4 py-2 bg-white border border-darkblue/30 rounded-full text-darkblack focus:outline-none focus:ring-2 focus:ring-darkblue focus:border-transparent transition-all"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <ChevronDown className="absolute right-3 top-12 -translate-y-1/2 w-5 h-5 text-darkblue pointer-events-none" />
              </div>

              {/* Certification Level Filter */}
              <div className="relative">
                <label className="block text-sm font-medium text-darkblue mb-2">
                  Certification Level
                </label>
                <select
                  value={filters.certification_level}
                  onChange={(e) =>
                    handleFilterChange("certification_level", e.target.value)
                  }
                  className="appearance-none w-full px-4 py-2 bg-white border border-darkblue/30 rounded-full text-darkblack focus:outline-none focus:ring-2 focus:ring-darkblue focus:border-transparent transition-all"
                >
                  <option value="">All Levels</option>
                  <option value="Level_I">Level I</option>
                  <option value="Level_II">Level II</option>
                  <option value="HARP">HARP</option>
              
                </select>
                <ChevronDown className="absolute right-3 top-12 -translate-y-1/2 w-5 h-5 text-darkblue pointer-events-none" />
              </div>

      

              {/* Start Date From */}
              <div>
                <label className="block text-sm font-medium text-darkblue mb-2">
                  Start From
                </label>
                <input
                  type="date"
                  value={filters.start_from}
                  onChange={(e) =>
                    handleFilterChange("start_from", e.target.value)
                  }
                  className="w-full px-4 py-2 bg-white border border-darkblue/30 rounded-full text-darkblack focus:outline-none focus:ring-2 focus:ring-darkblue focus:border-transparent transition-all"
                />
              </div>

              {/* Start Date To */}
              <div>
                <label className="block text-sm font-medium text-darkblue mb-2">
                  Start To
                </label>
                <input
                  type="date"
                  value={filters.start_to}
                  onChange={(e) =>
                    handleFilterChange("start_to", e.target.value)
                  }
                  className="w-full px-4 py-2 bg-white border border-darkblue/30 rounded-full text-darkblack focus:outline-none focus:ring-2 focus:ring-darkblue focus:border-transparent transition-all"
                />
              </div>

              {/* Sort By */}
              <div className="relative">
                <label className="block text-sm font-medium text-darkblue mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sort_by}
                  onChange={(e) =>
                    handleFilterChange("sort_by", e.target.value)
                  }
                  className="w-full appearance-none px-4 py-2 bg-white border border-darkblue/30 rounded-full text-darkblack focus:outline-none focus:ring-2 focus:ring-darkblue focus:border-transparent transition-all"
                >
                  <option value="schedule.start_datetime">Start Date</option>
                  <option value="compensation.hourly_rate">Hourly Rate</option>
                  <option value="priority">Priority</option>
                  <option value="posted_at">Date Posted</option>
                </select>
                <ChevronDown className="absolute right-3 top-12 -translate-y-1/2 w-5 h-5 text-darkblue pointer-events-none" />
              </div>
             
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-darkblue/20">
              <span className="text-sm text-darkblue">
                {activeFiltersCount} Active Filter{activeFiltersCount !== 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 border border-darkblue text-darkblue rounded-full hover:bg-darkblue hover:text-white transition-all duration-200"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-6 py-2 bg-darkblue text-white rounded-full hover:bg-darkblue/90 transition-all duration-200"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-darkblue font-medium">Active filters:</span>
          {filters.status.map(status => (
          <span key={status} className="px-3 py-1 bg-darkblue text-white rounded-full text-xs font-medium capitalize flex items-center gap-1">
              {status.replace('_', ' ')}
              <button
                onClick={() => handleStatusToggle(status)}
                className="ml-2 hover:cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.priority && (
            <span className="px-3 py-1 bg-darkblue text-white rounded-full text-xs font-medium capitalize">
              Priority: {filters.priority}
              <button
                onClick={() => handleFilterChange('priority', '')}
                className="ml-2 hover:text-red-200"
              >
                ×
              </button>
            </span>
          )}
          {filters.certification_level && (
            <span className="px-3 py-1 bg-darkblue text-white rounded-full text-xs font-medium">
              Cert: {filters.certification_level}
              <button
                onClick={() => handleFilterChange('certification_level', '')}
                className="ml-2 hover:text-red-200"
              >
                ×
              </button>
            </span>
          )}
          {filters.start_from && (
            <span className="px-3 py-1 bg-darkblue text-white rounded-full text-xs font-medium">
              From: {filters.start_from}
              <button
                onClick={() => handleFilterChange('start_from', '')}
                className="ml-2 hover:text-red-200"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-darkblue/20">
            <AlertCircle className="w-12 h-12 text-darkblue/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-darkblack mb-2">
              No shifts found
            </h3>
            <p className="text-darkblack/70">
              Try adjusting your filters or post a new shift
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="bg-lightbg rounded-3xl p-6 shadow-sm border border-darkblue/20 hover:shadow-md transition-all duration-300 hover:border-darkblue/40"
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
                  className="rounded-full transition-all duration-200 hover:scale-105"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {pagination.pages > 1 && (
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-lightblue">
          <div className="flex items-center justify-between">
            <div className="text-sm text-darkblack">
              Page {pagination.page} of {pagination.pages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 border border-darkblue/30 rounded-full hover:bg-darkblue hover:text-white disabled:opacity-50 transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-2 border border-darkblue/30 rounded-full hover:bg-darkblue hover:text-white disabled:opacity-50 transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedTask && (
        <ShiftDetailsModal
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          taskDetailLoading={taskDetailLoading}
          updateLoading={updateLoading}
          editFormData={editFormData}
          handleEditChange={handleEditChange}
          updateTask={updateTask}
          getStatusBadge={getStatusBadge}
          getPriorityBadge={getPriorityBadge}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

export default ClinicTasksList;