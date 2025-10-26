import { Plus, X, ChevronDown } from "lucide-react";
import Button from "../../Button";

const CreateShiftModal = ({
  showShiftModal,
  setShowShiftModal,
  newShift,
  setNewShift,
  isSubmitting,
  handleCreateShift,
}) => {
  if (!showShiftModal) return null;

  // Check if all required fields are filled
  const isFormValid = () => {
    const requiredFields = [
      newShift.title,
      newShift.priority,
      newShift.minimumExperience,
      newShift.date,
      newShift.startTime,
      newShift.endTime,
      newShift.hourlyRate,
    ];

    // If Dental Assistant is selected, certificationLevel is also required
    if (newShift.title === "Dental Assistant") {
      requiredFields.push(newShift.certificationLevel);
    }

    return requiredFields.every((field) => field && field.trim() !== "");
  };

  const getFieldError = (fieldName, value) => {
    if (!value || value.trim() === "") {
      return `${fieldName} is required`;
    }
    return null;
  };

  return (
    <div className="fixed rounded-4xl inset-0 bg-lightbg/60 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-lightbg border border-lightblue rounded-2xl shadow-2xl w-full max-w-4xl my-8 relative">
        {/* Header with close button */}
        <div className="p-6 border-b border-lightblue bg-lightblue rounded-t-2xl flex items-center justify-between font-poppins">
          <div>
            <h3 className="text-2xl font-bold text-darkblue text-md">
              Post New Shift
            </h3>
            <p className="text-darkblack text-sm mt-1">
              Fill in the details to post a new shift opening
            </p>
          </div>
          <button
            onClick={() => setShowShiftModal(false)}
            className="p-2 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6 rounded-md text-darkblue cursor-pointer hover:text-lightbg hover:bg-darkblue" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto font-poppins">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-darkblue pb-2">
              Basic Information
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex-1 relative">
                <label className="block text-sm/6 font-medium text-darkblack">
                  Title <span className="text-red-700">*</span>
                </label>
                <select
                  value={newShift.title}
                  onChange={(e) =>
                    setNewShift({ ...newShift, title: e.target.value })
                  }
                  className={`border w-full appearance-none border-darkblue h-10 rounded-3xl text-sm px-4 mt-2 ${
                    !newShift.title ? "border-red-700" : "text-darkblue"
                  }`}
                >
                  <option value="">Select a role</option>
                  <option value="Dental Assistant">Dental Assistant</option>
                  <option value="Higienist">Higienist</option>
                  <option value="Assistant Dentist">Assistant Dentist</option>
                </select>
                <ChevronDown className="absolute right-3 top-[70%] -translate-y-1/2 w-5 h-5 text-darkblue pointer-events-none" />
                {!newShift.title && (
                  <p className="text-red-700 text-xs mt-1">Title is required</p>
                )}
              </div>

              <div className="flex-1 relative">
                <label className="block text-sm/6 font-medium text-darkblack">
                  Priority <span className="text-red-700">*</span>
                </label>
                <select
                  value={newShift.priority}
                  onChange={(e) =>
                    setNewShift({ ...newShift, priority: e.target.value })
                  }
                  className={`border w-full appearance-none border-darkblue h-10 rounded-3xl text-sm px-4 mt-2 ${
                    !newShift.priority ? "border-red-700" : "text-darkblue"
                  }`}
                >
                  <option value="">Select priority</option>
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <ChevronDown className="absolute right-3 top-[70%]   -translate-y-1/2 w-5 h-5 text-darkblue pointer-events-none" />
                {!newShift.priority && (
                  <p className="text-red-700 text-xs mt-1">
                    Priority is required
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Requirements - Conditionally render Certification Level */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-darkblue pb-2">
              Requirements
            </h4>

            <div className="grid grid-cols-2 gap-4">
              {/* Show Certification Level only for Dental Assistant */}
              {newShift.title === "Dental Assistant" && (
                <div className="flex-1 relative">
                  <label className="block text-sm/6 font-medium text-darkblack">
                    Certification Level <span className="text-red-700">*</span>
                  </label>
                  <select
                    value={newShift.certificationLevel}
                    onChange={(e) =>
                      setNewShift({
                        ...newShift,
                        certificationLevel: e.target.value,
                      })
                    }
                    className={`border w-full appearance-none border-darkblue h-10 rounded-3xl text-sm px-4 mt-2 ${
                      !newShift.certificationLevel
                        ? "border-red-700"
                        : "text-darkblue"
                    }`}
                  >
                    <option value="">Select level</option>
                    <option value="HARP">HARP</option>
                    <option value="Level_I">Level I</option>
                    <option value="Level_II">Level II</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-13 -translate-y-1/2 w-5 h-5 text-darkblue pointer-events-none" />
                  {!newShift.certificationLevel && (
                    <p className="text-red-700 text-xs mt-1">
                      Certification level is required for Dental Assistant
                    </p>
                  )}
                </div>
              )}

              <div className="flex-1 relative">
                <label className="block text-sm/6 font-medium text-darkblack">
                  Minimum Experience
                  <span className="text-red-700">*</span>
                </label>
                <select
                  value={newShift.minimumExperience}
                  onChange={(e) =>
                    setNewShift({
                      ...newShift,
                      minimumExperience: e.target.value,
                    })
                  }
                  className={`border w-full appearance-none border-darkblue h-10 rounded-3xl text-sm px-4 mt-2 ${
                    !newShift.minimumExperience
                      ? "border-red-700"
                      : "text-darkblue"
                  }`}
                >
                  <option value="">Select experience</option>
                  <option value="None Experience">None Experience</option>
                  <option value="1 year">1 Year</option>
                  <option value="2 years">2 years</option>
                  <option value="3 years">3 years or more</option>
                </select>
                <ChevronDown className="absolute right-3 top-13 -translate-y-1/2 w-5 h-5 text-darkblue pointer-events-none" />
                {!newShift.minimumExperience && (
                  <p className="text-red-700 text-xs mt-1">
                    Minimum experience is required
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-darkblue pb-2">
              Schedule
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm/6 font-medium text-darkblack">
                  Date <span className="text-red-700">*</span>
                </label>
                <input
                  type="date"
                  value={newShift.date}
                  onChange={(e) =>
                    setNewShift({ ...newShift, date: e.target.value })
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-darkblue focus:border-darkblue ${
                    !newShift.date ? "border-red-700" : "border-darkblue"
                  }`}
                />
                {!newShift.date && (
                  <p className="text-red-700 text-xs mt-1">Date is required</p>
                )}
              </div>
              <div>
                <label className="block text-sm/6 font-medium text-darkblack">
                  Application Deadline
                </label>
                <input
                  type="date"
                  value={newShift.applicationDeadline}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setNewShift({
                      ...newShift,
                      applicationDeadline: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-darkblue rounded-full focus:ring-2 focus:ring-darkblue focus:border-darkblue"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm/6 font-medium text-darkblack">
                  Start Time <span className="text-red-700">*</span>
                </label>
                <input
                  type="time"
                  value={newShift.startTime}
                  onChange={(e) =>
                    setNewShift({ ...newShift, startTime: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-darkblue focus:border-darkblue ${
                    !newShift.startTime ? "border-red-700" : "border-darkblue"
                  }`}
                />
                {!newShift.startTime && (
                  <p className="text-red-700 text-xs mt-1">
                    Start time is required
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm/6 font-medium text-darkblack">
                  End Time <span className="text-red-700">*</span>
                </label>
                <input
                  type="time"
                  value={newShift.endTime}
                  onChange={(e) =>
                    setNewShift({ ...newShift, endTime: e.target.value })
                  }
                  className={`w-full rounded-full px-4 py-2 border focus:ring-2 focus:ring-darkblue focus:border-darkblue ${
                    !newShift.endTime ? "border-red-700" : "border-darkblue"
                  }`}
                />
                {!newShift.endTime && (
                  <p className="text-red-700 text-xs mt-1">
                    End time is required
                  </p>
                )}
              </div>

              <div className="flex-1 relative">
                <label className="block text-sm/6 font-medium text-darkblack">
                  Break
                </label>
                <select
                  value={newShift.breakDuration}
                  onChange={(e) =>
                    setNewShift({ ...newShift, breakDuration: e.target.value })
                  }
                  className="border w-full appearance-none border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue"
                >
                  <option value="">No Break</option>
                  <option value="30 Min">30 Minutes</option>
                  <option value="1 hour">1 Hour</option>
                </select>
                <ChevronDown className="absolute right-3 top-11 -translate-y-1/2 w-5 h-5 text-darkblue pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Compensation */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-darkblue pb-2">
              Compensation
            </h4>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm/6 font-medium text-darkblack">
                  Hourly Rate (CAD) <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  value={newShift.hourlyRate}
                  onChange={(e) =>
                    setNewShift({ ...newShift, hourlyRate: e.target.value })
                  }
                  placeholder="35"
                  className={`block w-full mb-2 rounded-full px-3 py-1.5 text-base border-1 sm:text-sm/6 mt-2 ${
                    !newShift.hourlyRate
                      ? "border-red-700"
                      : "border-darkblue text-darkblue"
                  }`}
                />
                {!newShift.hourlyRate && (
                  <p className="text-red-700 text-xs mt-1">
                    Hourly rate is required
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Required Fields Summary */}
          {!isFormValid() && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-medium text-sm">
                Please fill in all required fields marked with *
              </p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-lightblue flex justify-end gap-3">
          <Button
            variant="light"
            size="sm"
            onClick={() => setShowShiftModal(false)}
            disabled={isSubmitting}
            className="disabled:opacity-50 disabled:cursor-not-allowed hover:text-darkblack hover:bg-lightblue"
          >
            Cancel
          </Button>
          <Button
            variant="dark"
            size="md"
            onClick={handleCreateShift}
            disabled={isSubmitting || !isFormValid()}
            className="px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Posting...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Post Shift
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateShiftModal;
