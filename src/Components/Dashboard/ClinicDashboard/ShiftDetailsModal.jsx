import useEffect from "react";
import {
  X,
  ChevronDown,
  Loader,
  Calendar,
  Clock,
  DollarSign,
  Users,
} from "lucide-react";
import Button from "../../Button";

const ShiftDetailsModal = ({
  selectedTask,
  setSelectedTask,
  isEditMode,
  setIsEditMode,
  taskDetailLoading,
  updateLoading,
  editFormData,
  handleEditChange,
  updateTask,
  getStatusBadge,
  getPriorityBadge,
  formatDate,
}) => {
  if (!selectedTask) return null;

  return (
    <div className="fixed rounded-4xl inset-0 bg-lightbg/60 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-lightbg border border-lightblue rounded-2xl shadow-2xl w-full max-w-4xl my-8 relative">
        {/* Header with close button */}
        <div className="p-6 border-b border-lightblue bg-lightblue rounded-t-2xl flex items-center justify-between font-poppins">
          <div>
            <h3 className="text-2xl font-bold text-darkblue text-md">
              {isEditMode ? "Edit Shift" : "Shift Details"}
            </h3>
            <p className="text-darkblack text-sm mt-1">
              {isEditMode ? "Update shift details" : "View shift information"}
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedTask(null);
              setIsEditMode(false);
            }}
            className="p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 rounded-md text-darkblue cursor-pointer hover:text-lightbg hover:bg-darkblue" />
          </button>
        </div>

        {taskDetailLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : isEditMode ? (
          <EditShiftForm
            editFormData={editFormData}
            handleEditChange={handleEditChange}
            updateLoading={updateLoading}
            setIsEditMode={setIsEditMode}
            selectedTask={selectedTask}
            updateTask={updateTask}
          />
        ) : (
          <ShiftDetailsView
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            setIsEditMode={setIsEditMode}
            getStatusBadge={getStatusBadge}
            getPriorityBadge={getPriorityBadge}
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  );
};

// Edit Form Component
const EditShiftForm = ({
  editFormData,
  handleEditChange,
  updateLoading,
  setIsEditMode,
  selectedTask,
  updateTask,
}) => {
  const calculateTotalAmount = () => {
    if (
      editFormData?.compensation?.hourly_rate &&
      editFormData?.schedule?.duration_hours
    ) {
      const hourlyRate = parseFloat(editFormData.compensation.hourly_rate);
      const durationHours = parseFloat(editFormData.schedule.duration_hours);

      if (!isNaN(hourlyRate) && !isNaN(durationHours)) {
        return (hourlyRate * durationHours).toFixed(2);
      }
    }
    return "";
  };

  const calculateDuration = (startDateTime, endDateTime) => {
    if (!startDateTime || !endDateTime) return "";

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "";

    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);

    return diffHours > 0 ? diffHours.toString() : "";
  };

  const handleStartDateTimeChange = (e) => {
    const newStartDateTime = new Date(e.target.value).toISOString();
    handleEditChange("schedule.start_datetime", newStartDateTime);

    if (editFormData?.schedule?.end_datetime) {
      const newDuration = calculateDuration(
        newStartDateTime,
        editFormData.schedule.end_datetime
      );
      handleEditChange("schedule.duration_hours", newDuration);
    }
  };

  const handleEndDateTimeChange = (e) => {
    const newEndDateTime = new Date(e.target.value).toISOString();
    handleEditChange("schedule.end_datetime", newEndDateTime);

    if (editFormData?.schedule?.start_datetime) {
      const newDuration = calculateDuration(
        editFormData.schedule.start_datetime,
        newEndDateTime
      );
      handleEditChange("schedule.duration_hours", newDuration);
    }
  };

  const handleHourlyRateChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      handleEditChange("compensation.hourly_rate", value);
    }
  };

  // Check if the title is Dental Assistant
  const isDentalAssistant = selectedTask?.title === "Dental Assistant";

  const validateForm = () => {
    const errors = [];

    if (!editFormData?.compensation?.hourly_rate) {
      errors.push("Hourly rate is required");
    } else if (
      isNaN(parseFloat(editFormData.compensation.hourly_rate)) ||
      parseFloat(editFormData.compensation.hourly_rate) <= 0
    ) {
      errors.push("Hourly rate must be a positive number");
    }

    if (!editFormData?.schedule?.start_datetime) {
      errors.push("Start date/time is required");
    }

    if (!editFormData?.schedule?.end_datetime) {
      errors.push("End date/time is required");
    }

    if (!editFormData?.schedule?.duration_hours) {
      errors.push("Duration is required");
    } else if (parseFloat(editFormData.schedule.duration_hours) <= 0) {
      errors.push("Duration must be greater than 0");
    }

    if (
      editFormData?.schedule?.start_datetime &&
      editFormData?.schedule?.end_datetime
    ) {
      const start = new Date(editFormData.schedule.start_datetime);
      const end = new Date(editFormData.schedule.end_datetime);
      if (end <= start) {
        errors.push("End time must be after start time");
      }
    }

    // Only validate certification level if it's a Dental Assistant role
    if (isDentalAssistant && !editFormData?.requirements?.certification_level) {
      errors.push("Certification level is required for Dental Assistant roles");
    }

    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();

    if (errors.length > 0) {
      alert("Please fix the following errors:\n" + errors.join("\n"));
      return;
    }

    // Prepare data - only include certification level if it's Dental Assistant
    const submitData = {
      compensation: {
        hourly_rate: editFormData.compensation.hourly_rate,
        total_amount: calculateTotalAmount(),
      },
      schedule: {
        start_datetime: editFormData.schedule.start_datetime,
        end_datetime: editFormData.schedule.end_datetime,
        duration_hours: editFormData.schedule.duration_hours.toString(),
        ...(editFormData.schedule.break_duration_minutes && {
          break_duration_minutes: editFormData.schedule.break_duration_minutes,
        }),
      },
      ...(isDentalAssistant &&
        editFormData.requirements?.certification_level && {
          requirements: {
            certification_level: editFormData.requirements.certification_level,
          },
        }),
    };

    console.log("Submitting data:", submitData);

    try {
      await updateTask(selectedTask._id, submitData);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Update failed: " + (error.message || "Unknown error"));
    }
  };

  const totalAmount = calculateTotalAmount();

  return (
    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto font-poppins">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-darkblue pb-2">
          Compensation
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm/6 font-medium text-darkblack">
              Hourly Rate (CAD) <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              value={editFormData?.compensation?.hourly_rate || ""}
              onChange={handleHourlyRateChange}
              className="block w-full rounded-full px-4 py-2 text-base text-darkblue border border-darkblue sm:text-sm/6 mt-2"
            />
          </div>
          <div>
            <label className="block text-sm/6 font-medium text-darkblack">
              Total Amount
            </label>
            <input
              type="text"
              disabled
              value={totalAmount}
              className="block w-full rounded-full px-4 py-2 text-base text-darkblue border border-darkblue sm:text-sm/6 mt-2 bg-gray-100 cursor-not-allowed opacity-70"
            />
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-darkblue pb-2">Schedule</h4>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm/6 font-medium text-darkblack">
              Start Date/Time <span className="text-red-700">*</span>
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
              onChange={handleStartDateTimeChange}
              className="w-full px-4 py-2 border border-darkblue rounded-full focus:ring-2 focus:ring-darkblue focus:border-darkblue"
            />
          </div>
          <div>
            <label className="block text-sm/6 font-medium text-darkblack">
              End Date/Time <span className="text-red-700">*</span>
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
              onChange={handleEndDateTimeChange}
              className="w-full px-4 py-2 border border-darkblue rounded-full focus:ring-2 focus:ring-darkblue focus:border-darkblue"
            />
          </div>
          <div>
            <label className="block text-sm/6 font-medium text-darkblack">
              Duration (hours) <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              disabled
              value={editFormData?.schedule?.duration_hours || ""}
              className="w-full px-4 py-2 border border-darkblue rounded-full focus:ring-2 focus:ring-darkblue focus:border-darkblue bg-gray-100 cursor-not-allowed opacity-70"
            />
          </div>
          <div>
            <label className="block text-sm/6 font-medium text-darkblack">
              Break (minutes)
            </label>
            <input
              type="text"
              value={editFormData?.schedule?.break_duration_minutes || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  handleEditChange("schedule.break_duration_minutes", value);
                }
              }}
              className="w-full px-4 py-2 border border-darkblue rounded-full focus:ring-2 focus:ring-darkblue focus:border-darkblue"
            />
          </div>
        </div>
      </div>

      {/* Requirements - Only show for Dental Assistant */}
      {isDentalAssistant && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-darkblue pb-2">
            Requirements
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex-1 relative">
              <label className="block text-sm/6 font-medium text-darkblack">
                Certification Level <span className="text-red-700">*</span>
              </label>
              <select
                value={editFormData?.requirements?.certification_level || ""}
                onChange={(e) =>
                  handleEditChange(
                    "requirements.certification_level",
                    e.target.value
                  )
                }
                className="border w-full appearance-none border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue mt-2"
              >
                <option value="">Select Level</option>
                <option value="Level_I">Level I</option>
                <option value="Level_II">Level II</option>
                <option value="HARP">HARP</option>
              </select>
              <ChevronDown className="absolute right-3 top-13 -translate-y-1/2 w-5 h-5 text-darkblue pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          variant="light"
          size="sm"
          onClick={() => setIsEditMode(false)}
          disabled={updateLoading}
          className="disabled:opacity-50 disabled:cursor-not-allowed hover:text-darkblack hover:bg-lightblue"
        >
          Cancel
        </Button>
        <Button
          variant="dark"
          size="md"
          onClick={handleSave}
          disabled={updateLoading}
          className="px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {updateLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
};

// Format date only (e.g., "Jan 15, 2024")
const formatDateOnly = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format time only (e.g., "2:30 PM")
const formatTimeOnly = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// View Component
const ShiftDetailsView = ({
  selectedTask,
  setSelectedTask,
  setIsEditMode,
  getStatusBadge,
  getPriorityBadge,
  formatDate,
}) => {
  return (
    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto font-poppins">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-darkblue pb-2">
          Basic Information
        </h4>

        <h3 className="text-xl font-normal text-darkblack mb-3">
          {selectedTask.title}
        </h3>

        <div className="flex items-center gap-3 flex-wrap mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(
              selectedTask.status
            )}`}
          >
            {selectedTask.status.replace("_", " ")}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getPriorityBadge(
              selectedTask.priority
            )}`}
          >
            {selectedTask.priority}
          </span>
          {selectedTask.requirements?.certification_level && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              {selectedTask.requirements.certification_level.replace("_", " ")}
            </span>
          )}
        </div>

        {selectedTask.description && (
          <div className="bg-lightblue/20 rounded-2xl p-4">
            <p className="text-darkblack">{selectedTask.description}</p>
          </div>
        )}
      </div>

      {/* Schedule */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-darkblue pb-2">Schedule</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-lightblue/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-darkblue font-medium">
              <Calendar size={16} />
              Date
            </div>
            <div className="text-darkblack font-medium text-md mt-2">
              {formatDateOnly(selectedTask.schedule?.start_datetime)}
            </div>
          </div>
          <div className="bg-lightblue/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-darkblue font-medium">
              <Clock size={16} />
              Start Time
            </div>
            <div className="text-darkblack font-medium text-md mt-2">
              {formatTimeOnly(selectedTask.schedule?.start_datetime)}
            </div>
          </div>
          <div className="bg-lightblue/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-darkblue font-medium">
              <Clock size={16} />
              End Time
            </div>
            <div className="text-darkblack font-medium text-md mt-2">
              {formatTimeOnly(selectedTask.schedule?.end_datetime)}
            </div>
          </div>
        </div>
      </div>

      {/* Compensation */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-darkblue pb-2">
          Compensation
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-lightblue/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-darkblue font-medium">
              <DollarSign size={16} />
              Hourly Rate
            </div>
            <div className="text-darkblack font-medium text-lg mt-3">
              ${selectedTask.compensation?.hourly_rate}{" "}
              {selectedTask.compensation?.currency}
            </div>
          </div>
          {selectedTask.compensation?.total_amount && (
            <div className="bg-lightblue/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-darkblue font-medium">
                <DollarSign size={16} />
                Total Amount
              </div>
              <div className="text-darkblack font-medium text-lg mt-3">
                ${selectedTask.compensation.total_amount}{" "}
                {selectedTask.compensation.currency}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Applications */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-darkblue pb-2">
          Applications
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-lightblue/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-darkblue font-medium">
              <Users size={16} />
              Total Applicants
            </div>
            <div className="text-darkblack font-medium text-lg mt-3">
              {selectedTask.applications_count || 0}
            </div>
          </div>

          <div className="bg-lightblue/20 rounded-2xl p-4 col-span-2">
            <div className="flex items-center gap-2 text-darkblue font-medium">
              <Calendar size={16} />
              Posted On
            </div>
            <div className="text-darkblack font-medium text-lg mt-3">
              {formatDate(selectedTask.posted_at)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          variant="light"
          size="sm"
          onClick={() => setSelectedTask(null)}
          className="hover:text-darkblack hover:bg-lightblue"
        >
          Close
        </Button>
        <Button
          variant="dark"
          size="md"
          onClick={() => setIsEditMode(true)}
          className="px-6 py-2 flex items-center gap-2"
        >
          Edit Shift
        </Button>
      </div>
    </div>
  );
};

export default ShiftDetailsModal;
