// src/components/TaskDetailModal.jsx
import { useState, useEffect } from "react";
import { X, Save, Edit2, Clock, Calendar, DollarSign, AlertCircle } from "lucide-react";

const formatDate = (iso) => iso.split("T")[0];
const formatTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const TaskDetailModal = ({ task: initialTask, onClose, onUpdated }) => {
  const [editMode, setEditMode] = useState(false);
  const [task, setTask] = useState(initialTask);
  const [saving, setSaving] = useState(false);
  const apiBase = import.meta?.env?.VITE_SERVER_BASE_URL || "http://localhost:1080";

  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch(`${apiBase}/api/v1/clinic/tasks/${task._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Update failed");

      onUpdated(json.data);
      setEditMode(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (path, value) => {
    const keys = path.split(".");
    setTask((prev) => {
      const copy = { ...prev };
      let ref = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        ref[keys[i]] = { ...ref[keys[i]] };
        ref = ref[keys[i]];
      }
      ref[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-2xl font-bold text-gray-800">
            {editMode ? "Edit Shift" : "Shift Details"}
          </h3>
          <div className="flex gap-2">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                >
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            {editMode ? (
              <input
                type="text"
                value={task.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            ) : (
              <p className="text-lg font-medium">{task.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            {editMode ? (
              <textarea
                rows={3}
                value={task.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            ) : (
              <p className="text-gray-600">{task.description || "—"}</p>
            )}
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4" /> Date
              </label>
              {editMode ? (
                <input
                  type="date"
                  value={formatDate(task.schedule.start_datetime)}
                  onChange={(e) => {
                    const newStart = `${e.target.value}T${task.schedule.start_datetime.split("T")[1]}`;
                    updateField("schedule.start_datetime", newStart);
                    const end = new Date(newStart);
                    end.setHours(end.getHours() + task.schedule.duration_hours);
                    updateField("schedule.end_datetime", end.toISOString());
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              ) : (
                <p>{new Date(task.schedule.start_datetime).toLocaleDateString()}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4" /> Time
              </label>
              <p>
                {formatTime(task.schedule.start_datetime)} – {formatTime(task.schedule.end_datetime)}
              </p>
            </div>
          </div>

          {/* Compensation */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-medium">
                {task.compensation.hourly_rate} {task.compensation.currency}/hr
              </span>
            </div>
            {task.compensation.total_amount && (
              <span className="text-sm text-gray-600">
                (Total: {task.compensation.total_amount})
              </span>
            )}
          </div>

          {/* Requirements */}
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Requirements</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Certification: {task.requirements.certification_level}</li>
              <li>Min Experience: {task.requirements.minimum_experience} years</li>
              {task.requirements.required_specializations?.length > 0 && (
                <li>Required: {task.requirements.required_specializations.join(", ")}</li>
              )}
              {task.requirements.preferred_skills?.length > 0 && (
                <li>Preferred: {task.requirements.preferred_skills.join(", ")}</li>
              )}
            </ul>
          </div>

          {/* Status & Priority */}
          <div className="flex gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Status:</span>{" "}
              <span
                className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === "open"
                    ? "bg-green-100 text-green-700"
                    : task.status === "closed"
                    ? "bg-gray-100 text-gray-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {task.status}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Priority:</span>{" "}
              <span
                className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                  task.priority === "urgent"
                    ? "bg-red-100 text-red-700"
                    : task.priority === "high"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {task.priority}
              </span>
            </div>
          </div>

          {/* Applications */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-600" />
            <span>
              {task.applications_count} / {task.max_applications} applications
            </span>
          </div>

          {/* Posted At */}
          <div className="text-sm text-gray-500">
            Posted on {new Date(task.posted_at).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;