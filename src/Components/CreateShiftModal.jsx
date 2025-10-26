import { Plus, X, ChevronDown } from "lucide-react";
import Button from "./Button";
const CreateShiftModal = ({ 
  showShiftModal, 
  setShowShiftModal, 
  newShift, 
  setNewShift, 
  isSubmitting, 
  handleCreateShift 
}) => {
  if (!showShiftModal) return null;

  return (
    <div className="fixed rounded-4xl  inset-0 bg-lightbg/60 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-lightbg border border-lightblue rounded-2xl shadow-2xl w-full max-w-4xl my-8 relative">
        {/* Header with close button */}
        <div className="p-6 border-b border-lightblue bg-lightblue rounded-t-2xl flex items-center justify-between font-poppins">
          <div>
            <h3 className="text-2xl font-bold text-darkblue text-md  ">Post New Shift</h3>
            <p className="text-darkblack text-sm mt-1">Fill in the details to post a new shift opening</p>
          </div>
          <button
            onClick={() => setShowShiftModal(false)}
            className="p-2   rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6 rounded-md text-darkblue cursor-pointer hover:text-lightbg hover:bg-darkblue" />
          </button>
        </div>
        
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto font-poppins">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-darkblue pb-2">Basic Information</h4>
            
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">Title *</label>
              <input
                type="text"
                value={newShift.title}
                onChange={(e) => setNewShift({...newShift, title: e.target.value})}
                placeholder="Emergency Dental Assistant Needed"
                className="block w-full mb-2 rounded-full px-3 py-1.5 text-base text-darkblue border-1 border-darkblue sm:text-sm/6 mt-2"
              />
            </div>

         

            <div className="grid grid-cols-2 gap-4">
            <div className="flex-1 relative">
                <label className="block text-sm/6 font-medium text-darkblack">Priority *</label>
                <select
                  value={newShift.priority}
                  onChange={(e) => setNewShift({...newShift, priority: e.target.value})}
                  className="border w-full appearance-none border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue  mt-2"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <ChevronDown className="absolute right-3 top-[70%] -translate-y-1/2 w-5 h-5 text-darkblue pointer-events-none" />
              </div>
            
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-4">
          <h4 className="text-lg font-semibold text-darkblue pb-2">Requirements</h4>
            
            <div className="grid grid-cols-2 gap-4">
            <div className="flex-1 relative">
              <label className="block text-sm/6 font-medium text-darkblack">Certification Level *</label>
                <select
                  value={newShift.certificationLevel}
                  onChange={(e) => setNewShift({...newShift, certificationLevel: e.target.value})}
                  className="border w-full appearance-none border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue  mt-2"
                >
                  <option value="">Select level</option>
                  <option value="Level_I">Level I</option>
                  <option value="Level_II">Level II</option>
               
                </select>
                <ChevronDown className="absolute right-3 top-[70%] -translate-y-1/2 w-5 h-5 text-darkblue pointer-events-none" />
              </div>
              <div className="flex-1 relative">
              <label className="block text-sm/6 font-medium text-darkblack">Minimum Experience (years) *</label>
              <select
                  value={newShift.minimumExperience}
                  onChange={(e) => setNewShift({...newShift, minimumExperience: e.target.value})}
                  className="border w-full appearance-none border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue  mt-2"
                >
                  <option value="">None Experience</option>
                  <option value="1 year">1 Year</option>
                  <option value="2 years">2 years</option>
                  <option value="3 years">3 years or more</option>
               
                </select>
                <ChevronDown className="absolute right-3 top-[70%] -translate-y-1/2 w-5 h-5 text-darkblue pointer-events-none" />
             
              </div>
            </div>

            <div>
            <label className="block text-sm/6 font-medium text-darkblack">Required Specializations (separated by comma)</label>
              <input
                type="text"
                value={newShift.requiredSpecializations.join(', ')}
                onChange={(e) => setNewShift({...newShift, requiredSpecializations: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                placeholder="Chairside Assisting, Infection Control"
                className="block w-full mb-2 rounded-full px-3 py-1.5 text-base text-darkblue border-1 border-darkblue sm:text-sm/6 mt-2"
              />
            </div>

            <div>
            <label className="block text-sm/6 font-medium text-darkblack">Preferred Skills (comma separated)</label>
              <input
                type="text"
                value={newShift.preferredSkills.join(', ')}
                onChange={(e) => setNewShift({...newShift, preferredSkills: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                placeholder="Patient communication, Digital X-rays"
                className="block w-full mb-2 rounded-full px-3 py-1.5 text-base text-darkblue border-1 border-darkblue sm:text-sm/6 mt-2"
              />
            </div>

        
          </div>

          {/* Schedule */}
          <div className="space-y-4">
          <h4 className="text-lg font-semibold text-darkblue pb-2">Schedule</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                    <label className="block text-sm/6 font-medium text-darkblack">Date *</label>
                <input
                  type="date"
                  value={newShift.date}
                  onChange={(e) => setNewShift({...newShift, date: e.target.value})}
                  className="w-full px-4 py-2 border border-darkblue rounded-full focus:ring-2 focus:ring-darkblue focus:border-darkblue"
                />
              </div>
              <div>
                    <label className="block text-sm/6 font-medium text-darkblack">Application Deadline</label>
                <input
                  type="date"
                  value={newShift.applicationDeadline}
                  onChange={(e) => setNewShift({...newShift, applicationDeadline: e.target.value})}
                  className="w-full px-4 py-2 border border-darkblue rounded-full focus:ring-2 focus:ring-darkblue focus:border-darkblue"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                    <label className="block text-sm/6 font-medium text-darkblack">Start Time *</label>
                <input
                  type="time"
                  value={newShift.startTime}
                  onChange={(e) => setNewShift({...newShift, startTime: e.target.value})}
                  className="w-full px-4 py-2 border border-darkblue rounded-full focus:ring-2focus:ring-2 focus:ring-darkblue focus:border-darkblue"
                />
              </div>
              <div>
                    <label className="block text-sm/6 font-medium text-darkblack">End Time *</label>
                <input
                  type="time"
                  value={newShift.endTime}
                  onChange={(e) => setNewShift({...newShift, endTime: e.target.value})}
                  className="w-full rounded-full px-4 py-2 border border-darkblue  focus:ring-2focus:ring-2 focus:ring-darkblue focus:border-darkblue"
                />
              </div>
           
                    
          
              <div className="flex-1 relative">
              <label className="block text-sm/6 font-medium text-darkblack">Break</label>
              <select
                  value={newShift.breakDuration}
                  onChange={(e) => setNewShift({...newShift, breakDuration: e.target.value})}
                  className="border w-full appearance-none border-darkblue h-10 rounded-3xl text-sm px-4 text-darkblue  mt-2"
                >
                  <option value="">No Break</option>
                  <option value="30 Min">30 Minutes</option>
                  <option value="1 hour">1 Hour</option>
                
               
                </select>
                <ChevronDown className="absolute right-3 top-[70%] -translate-y-1/2 w-5 h-5 text-darkblue pointer-events-none" />
             
              </div>
           
            </div>
          </div>

          {/* Compensation */}
          <div className="space-y-4">
          <h4 className="text-lg font-semibold text-darkblue pb-2">Compensation</h4>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                    <label className="block text-sm/6 font-medium text-darkblack">Hourly Rate (CAD) *</label>
                    <input
                type="text"
                value={newShift.hourlyRate}
                onChange={(e) => setNewShift({...newShift, hourlyRate: e.target.value})}
                placeholder="35"
                className="block w-full mb-2 rounded-full px-3 py-1.5 text-base text-darkblue border-1 border-darkblue sm:text-sm/6 mt-2"
              />
             
              </div>

         
        
        
            </div>
          </div>

   
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
           <Button
      variant="light"
      size="sm"
            onClick={() => setShowShiftModal(false)}
            disabled={isSubmitting}
            className=" disabled:opacity-50 disabled:cursor-not-allowed  hover:text-darkblack hover:bg-lightblue"
          >
            Cancel
          </Button>
            <Button
      variant="dark"
      size="md"
            onClick={handleCreateShift}
            disabled={isSubmitting}
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