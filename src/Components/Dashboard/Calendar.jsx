import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuthFetch } from '../../hooks/useAuthFetch';

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month', 'week', 'day'
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  
  const { data, loading, error } = useAuthFetch(
    `http://localhost:1080/api/v1/applications/my-applications`
  );

  // Get accepted shifts from the data
  const applications = data?.success 
    ? data.data.filter(app => app.status === 'accepted' || app.status === 'assigned')
    : [];

  // Convert applications to calendar events
  const getCalendarEvents = () => {
    const events = [];
    
    applications.forEach(application => {
      if (application.task_id?.schedule?.start_datetime) {
        const startDate = new Date(application.task_id.schedule.start_datetime);
        const dateKey = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;
        
        const color = application.status === 'accepted' 
          ? "bg-green-100 text-green-700 border border-green-200" 
          : "bg-blue-100 text-blue-700 border border-blue-200";
        
        events.push({
          date: dateKey,
          datetime: startDate,
          title: application.task_id.title,
          time: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          clinic: application.clinic_id?.clinic_name || 'Clinic',
          hourlyRate: application.task_id.compensation?.hourly_rate,
          duration: application.task_id.schedule.duration_hours,
          color: color,
          application: application
        });
      }
    });
    
    return events;
  };

  const events = getCalendarEvents();

  // Navigation functions
  const goToPrevious = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    } else if (view === 'week') {
      setCurrentDate(new Date(currentYear, currentMonth, currentDay - 7));
    } else if (view === 'day') {
      setCurrentDate(new Date(currentYear, currentMonth, currentDay - 1));
    }
  };

  const goToNext = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    } else if (view === 'week') {
      setCurrentDate(new Date(currentYear, currentMonth, currentDay + 7));
    } else if (view === 'day') {
      setCurrentDate(new Date(currentYear, currentMonth, currentDay + 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get week number
  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Get week range for week view
  const getWeekRange = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return { startOfWeek, endOfWeek };
  };

  // Get days for week view
  const getWeekDays = () => {
    const { startOfWeek } = getWeekRange(currentDate);
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  // Get hours for day view (7 AM to 9 PM)
  const getDayHours = () => {
    const hours = [];
    for (let i = 7; i <= 21; i++) {
      hours.push(i);
    }
    return hours;
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return events.filter(event => event.date === dateKey);
  };

  // Render Month View
  const renderMonthView = () => {
    const start = new Date(currentYear, currentMonth, 1);
    const end = new Date(currentYear, currentMonth + 1, 0);
    const firstDay = start.getDay();
    const totalDays = end.getDate();

    const weeks = [];
    let currentDay = 1 - firstDay;
    while (currentDay <= totalDays) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(currentDay > 0 && currentDay <= totalDays ? currentDay : null);
        currentDay++;
      }
      weeks.push(week);
    }

    const formatDate = (d) =>
      `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

    const isToday = (day) => {
      const today = new Date();
      return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
    };

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Day labels header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {days.map((day, i) => (
            <div
              key={i}
              className="py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-[1px] bg-gray-100">
          {weeks.map((week, i) =>
            week.map((day, j) => {
              const dateKey = day ? formatDate(day) : null;
              const dayEvents = events.filter((e) => e.date === dateKey);

              return (
                <div
                  key={`${i}-${j}`}
                  className="bg-white min-h-[110px] p-1.5 flex flex-col relative hover:bg-lightblue/30 transition cursor-pointer"
                >
                  {day && (
                    <div className="flex justify-end mb-1">
                      <div
                        className={`w-6 h-6 flex items-center justify-center text-xs font-medium rounded-full ${
                          isToday(day) ? "bg-darkblue text-white" : "text-gray-600"
                        }`}
                      >
                        {day}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1 flex-1">
                    {dayEvents.slice(0, 3).map((event, idx) => (
                      <div
                        key={idx}
                        className={`text-xs px-2 py-1 rounded-md font-medium ${event.color}`}
                        title={`${event.title} at ${event.clinic} - $${event.hourlyRate}/hr`}
                      >
                        <div className="font-semibold truncate">{event.title}</div>
                        <div className="text-xs opacity-70 truncate">
                          {event.time} • ${event.hourlyRate}/hr
                        </div>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[11px] text-gray-500 pl-1 font-medium">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>

                  {dayEvents.length === 0 && day && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-[11px] text-gray-300">No shifts</div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  // Render Week View
  const renderWeekView = () => {
    const weekDays = getWeekDays();

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Week header - fixed */}
        <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
          <div className="p-3 border-r border-gray-200 text-xs font-semibold text-gray-600">Time</div>
          {weekDays.map((day, index) => {
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div
                key={index}
                className={`p-3 text-center border-r border-gray-200 last:border-r-0 ${
                  isToday ? "bg-darkblue text-white" : ""
                }`}
              >
                <div className="font-semibold text-sm">{days[day.getDay()]}</div>
                <div className="text-xs mt-1">
                  {day.getDate()} {months[day.getMonth()].substring(0, 3)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Week content - scrollable */}
        <div className="overflow-auto max-h-[600px]">
          <div className="grid grid-cols-8">
            <div className="border-r border-gray-200 bg-gray-50">
              {getDayHours().map(hour => (
                <div key={hour} className="h-16 border-b border-gray-100 p-2 text-xs text-gray-600 text-right pr-3">
                  {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </div>
              ))}
            </div>
            
            {weekDays.map((day, dayIndex) => {
              const dayEvents = getEventsForDate(day);
              return (
                <div key={dayIndex} className="border-r border-gray-200 last:border-r-0 relative bg-white">
                  {getDayHours().map(hour => (
                    <div key={hour} className="h-16 border-b border-gray-100 hover:bg-lightblue/30"></div>
                  ))}
                  
                  {/* Events overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {dayEvents.map((event, eventIndex) => {
                      const eventHour = event.datetime.getHours();
                      const eventMinute = event.datetime.getMinutes();
                      const top = ((eventHour - 7) * 64) + (eventMinute / 60) * 64;
                      const height = Math.max((event.duration || 1) * 64 - 4, 48);
                      
                      return (
                        <div
                          key={eventIndex}
                          className={`absolute left-1 right-1 ${event.color} rounded-md p-2 text-xs pointer-events-auto cursor-pointer shadow-sm hover:shadow-md transition-shadow`}
                          style={{ top: `${top}px`, height: `${height}px` }}
                          title={`${event.title} at ${event.clinic} - $${event.hourlyRate}/hr`}
                        >
                          <div className="font-semibold truncate">{event.title}</div>
                          <div className="truncate mt-0.5">{event.time}</div>
                          {height > 60 && (
                            <div className="truncate text-[10px] mt-0.5 opacity-70">{event.clinic}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Render Day View
  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    const isToday = currentDate.toDateString() === new Date().toDateString();

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Day header */}
        <div className={`p-4 text-center border-b border-gray-200 ${isToday ? "bg-darkblue text-white" : "bg-gray-50"}`}>
          <div className="text-lg font-semibold">
            {days[currentDate.getDay()]}, {months[currentDate.getMonth()]} {currentDate.getDate()}, {currentYear}
          </div>
          {isToday && <div className="text-sm mt-1">Today</div>}
        </div>

        {/* Day content - scrollable */}
        <div className="overflow-auto max-h-[600px]">
          <div className="grid grid-cols-12">
            <div className="col-span-2 border-r border-gray-200 bg-gray-50">
              {getDayHours().map(hour => (
                <div key={hour} className="h-20 border-b border-gray-100 p-2 text-sm text-gray-600 text-right pr-4">
                  {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </div>
              ))}
            </div>
            
            <div className="col-span-10 relative bg-white">
              {getDayHours().map(hour => (
                <div key={hour} className="h-20 border-b border-gray-100 hover:bg-lightblue/30"></div>
              ))}
              
              {/* Events overlay */}
              <div className="absolute inset-0 pointer-events-none px-2">
                {dayEvents.map((event, eventIndex) => {
                  const eventHour = event.datetime.getHours();
                  const eventMinute = event.datetime.getMinutes();
                  const top = ((eventHour - 7) * 80) + (eventMinute / 60) * 80;
                  const durationHours = event.duration || 1;
                  const height = Math.max(durationHours * 80 - 4, 60);
                  
                  return (
                    <div
                      key={eventIndex}
                      className={`absolute left-2 right-2 ${event.color} rounded-lg p-3 pointer-events-auto cursor-pointer shadow-md hover:shadow-lg transition-shadow`}
                      style={{ top: `${top}px`, height: `${height}px` }}
                      title={`${event.title} at ${event.clinic} - $${event.hourlyRate}/hr`}
                    >
                      <div className="font-semibold text-sm mb-1">{event.title}</div>
                      <div className="text-xs mb-1">{event.time}</div>
                      <div className="text-xs opacity-70 mb-1">{event.clinic}</div>
                      <div className="text-xs font-semibold">${event.hourlyRate}/hr • {event.duration}hrs</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Get header title based on view
  const getHeaderTitle = () => {
    const monthName = months[currentMonth];
    
    if (view === 'month') {
      return `${monthName} ${currentYear}`;
    } else if (view === 'week') {
      const { startOfWeek, endOfWeek } = getWeekRange(currentDate);
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else if (view === 'day') {
      return `${days[currentDate.getDay()]}, ${monthName} ${currentDate.getDate()}, ${currentYear}`;
    }
  };

  // Handle loading and error states
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-lightblue shadow-sm">
        <div className="flex justify-center items-center h-64">
          <div className="text-darkblue font-poppins">Loading shifts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-lightblue shadow-sm">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600 font-poppins">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-lightblue shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center border border-lightblue rounded-xl overflow-hidden">
            <span className="px-4 py-1 text-xs font-semibold bg-lightblue text-darkblack uppercase tracking-wide">
              {months[currentMonth].substring(0, 3).toUpperCase()}
            </span>
            <span className="px-4 py-2 text-2xl font-bold text-darkblue">
              {currentDate.getDate()}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-semibold font-poppins text-darkblue">
              {getHeaderTitle()}
            </h2>
            {view === 'week' && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-lightblue text-darkblack rounded">
                Week {getWeekNumber(currentDate)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={goToPrevious}
            className="p-2 border border-lightblue rounded-lg text-darkblack hover:bg-lightblue transition"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={goToToday}
            className="px-4 py-2 border border-lightblue rounded-lg text-sm font-medium text-darkblack hover:bg-lightblue transition"
          >
            Today
          </button>
          <button 
            onClick={goToNext}
            className="p-2 border border-lightblue rounded-lg text-darkblack hover:bg-lightblue transition"
          >
            <ChevronRight size={18} />
          </button>
          <div className="relative">
            <select 
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="appearance-none bg-white border border-lightblue rounded-lg text-sm font-medium text-darkblack px-4 py-2 pr-10 cursor-pointer hover:bg-lightblue focus:outline-none focus:ring-2 focus:ring-darkblue"
            >
              <option value="month">Month view</option>
              <option value="week">Week view</option>
              <option value="day">Day view</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-darkblack pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Calendar content */}
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
          <span className="text-darkblack font-medium">Accepted Shifts</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
          <span className="text-darkblack font-medium">Assigned Shifts</span>
        </div>
      </div>
    </div>
  );
}