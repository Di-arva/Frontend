import { useState } from 'react';
import Calendar from '../Components/Dashboard/Calendar';
import { Download, Filter } from 'lucide-react';

const Schedule = () => {
  const [dateRange, setDateRange] = useState('month'); // month, week, custom

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-poppins text-darkblack">My Schedule</h1>
            <p className="text-darkblack/70 mt-2 font-poppins">
              View your accepted shifts and work schedule
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-lightblue rounded-lg text-darkblack hover:bg-lightblue transition-colors font-poppins text-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-darkblue text-white rounded-lg hover:bg-darkblue/90 transition-colors font-poppins text-sm">
              <Download className="w-4 h-4" />
              Export Schedule
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-lightblue shadow-sm">
            <h3 className="text-sm font-medium text-darkblack/70 font-poppins">Upcoming Shifts</h3>
            <p className="text-2xl font-bold text-darkblue font-poppins mt-1">5</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-lightblue shadow-sm">
            <h3 className="text-sm font-medium text-darkblack/70 font-poppins">Hours This Week</h3>
            <p className="text-2xl font-bold text-darkblue font-poppins mt-1">24</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-lightblue shadow-sm">
            <h3 className="text-sm font-medium text-darkblack/70 font-poppins">Next Shift</h3>
            <p className="text-lg font-bold text-darkblue font-poppins mt-1">Tomorrow, 9:00 AM</p>
          </div>
        </div>
        
        {/* Calendar Component */}
        <Calendar />
      </div>
    </div>
  );
};

export default Schedule;