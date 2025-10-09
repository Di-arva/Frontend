
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const events = [
  { date: "2025-10-02", title: "All-hands", time: "12:00 PM", color: "bg-gray-200 text-gray-700" },
  { date: "2025-10-02", title: "Dinner with Ava", time: "2:30 PM", color: "bg-gray-200 text-gray-700" },
  { date: "2025-10-06", title: "Coffee with Raj", time: "7:30 AM", color: "bg-gray-200 text-gray-700" },
  { date: "2025-10-06", title: "Marketing sync", time: "10:30 AM", color: "bg-gray-200 text-gray-700" },
  { date: "2025-10-08", title: "Deep work", time: "5:00 AM", color: "bg-blue-100 text-blue-700" },
  { date: "2025-10-08", title: "One-on-one", time: "6:00 AM", color: "bg-pink-100 text-pink-700" },
  { date: "2025-10-08", title: "Design session", time: "6:30 AM", color: "bg-blue-100 text-blue-700" },
  { date: "2025-10-09", title: "Lunch with Riya", time: "8:00 AM", color: "bg-green-100 text-green-700" },
  { date: "2025-10-10", title: "Friday standup", time: "5:00 AM", color: "bg-gray-200 text-gray-700" },
  { date: "2025-10-10", title: "Olivia x Review", time: "6:00 AM", color: "bg-purple-100 text-purple-700" },
  { date: "2025-10-10", title: "Product sync", time: "9:30 AM", color: "bg-blue-100 text-blue-700" },
  { date: "2025-10-11", title: "House inspection", time: "7:00 AM", color: "bg-orange-100 text-orange-700" },
  { date: "2025-10-12", title: "Ava's engagement", time: "9:00 AM", color: "bg-purple-100 text-purple-700" },
  { date: "2025-10-13", title: "Monday planning", time: "5:00 AM", color: "bg-gray-200 text-gray-700" },
  { date: "2025-10-13", title: "Content review", time: "7:00 AM", color: "bg-blue-100 text-blue-700" },
  { date: "2025-10-14", title: "Product sync", time: "6:30 AM", color: "bg-blue-100 text-blue-700" },
  { date: "2025-10-14", title: "Catch up", time: "10:30 AM", color: "bg-pink-100 text-pink-700" },
  { date: "2025-10-16", title: "Amélie’s session", time: "6:00 AM", color: "bg-pink-100 text-pink-700" },
  { date: "2025-10-16", title: "All-hands", time: "12:00 PM", color: "bg-gray-200 text-gray-700" },
  { date: "2025-10-17", title: "Coffee with team", time: "5:30 AM", color: "bg-gray-200 text-gray-700" },
  { date: "2025-10-17", title: "Design feedback", time: "10:30 AM", color: "bg-blue-100 text-blue-700" },
  { date: "2025-10-18", title: "Half marathon", time: "3:00 AM", color: "bg-green-100 text-green-700" },
  { date: "2025-10-20", title: "Team lunch", time: "8:15 AM", color: "bg-pink-100 text-pink-700" },
  { date: "2025-10-22", title: "Deep work", time: "5:00 AM", color: "bg-blue-100 text-blue-700" },
  { date: "2025-10-22", title: "Design sync", time: "10:30 AM", color: "bg-blue-100 text-blue-700" },
  { date: "2025-10-23", title: "Amélie catch-up", time: "6:00 AM", color: "bg-pink-100 text-pink-700" },
  { date: "2025-10-23", title: "Dinner with client", time: "3:00 PM", color: "bg-gray-200 text-gray-700" },
  { date: "2025-10-24", title: "Accounts review", time: "9:45 AM", color: "bg-yellow-100 text-yellow-700" },
  { date: "2025-10-24", title: "Marketing sync", time: "10:30 AM", color: "bg-gray-200 text-gray-700" },
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
  const year = 2025, month = 9; // October (0-indexed)
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const firstDay = start.getDay();
  const totalDays = end.getDate();

  // Build weeks array
  const weeks = [];
  let current = 1 - firstDay;
  while (current <= totalDays) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(current > 0 && current <= totalDays ? current : null);
      current++;
    }
    weeks.push(week);
  }

  const formatDate = (d) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return (
    <div className="bg-white p-6 rounded-2xl border border-lightblue shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2 ">
            <div className="flex flex-col items-center border border-lightblue  rounded-xl overflow-hidden">
                  <span className="font-poppins  text-darkblack px-6 py-2 h-7 text-xs font-medium bg-lightblue ">
              OCT
            </span>
            <span className="font-poppins text-lg font-semibold text-darkblue">9</span>
            </div>

     <div className="flex flex-col">
  <div className="flex items-center gap-2">
    <h2 className="text-xl font-semibold font-poppins text-darkblue">October 2025</h2>
    <span className="border px-2 py-1 font-poppins rounded-lg border-lightblue text-xs text-darkblack">Week 2</span>
  </div>
  

  <p className=" text-sm mt-1 font-poppins text-darkblack">Oct 1, 2025 – Oct 30, 2025</p>
</div>
           
           
          </div>
         
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1 border rounded-lg text-darkblack hover:bg-lightblue  border-lightblue hover:cursor-pointer bg-gray-50">
            <ChevronLeft size={16} />
          </button>
          <button className="px-3 py-0.5 border font-poppins rounded-lg text-sm  hover:bg-lightblue  border-lightblue hover:cursor-pointer">Today</button>
              <button className="p-1 border rounded-lg text-darkblack hover:bg-lightblue  border-lightblue hover:cursor-pointer bg-gray-50">
            <ChevronRight size={16} />
          </button>
         <div className="relative inline-block">
   <select
    className="appearance-none bg-transparent border border-lightblue rounded-lg text-sm font-poppins text-darkblack px-3 py-1 pr-8 cursor-pointer hover:bg-lightblue focus:outline-none focus:ring-2 focus:ring-lightblue"
  >
    <option value="Month view" >
      Month view
    </option>
    <option value="Week view" >
      Week view
    </option>
  </select>

  <ChevronDown
    size={16}
    className="absolute right-2 top-1/2 -translate-y-1/2 text-darkblack pointer-events-none"
  />
</div>
   
        </div>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 text-center text-darkblack text-sm font-medium border-b border-lightblue pb-2 mb-2">
        {days.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-[1px] bg-gray-100 rounded-lg overflow-hidden">
        {weeks.map((week, i) =>
          week.map((day, j) => {
            const dateKey = day ? formatDate(day) : null;
            const dayEvents = events.filter((e) => e.date === dateKey);
            const isToday = day === 9; // highlight 

            return (
              <div
                key={`${i}-${j}`}
                className="bg-white min-h-[110px] p-1.5 flex flex-col relative hover:bg-lightblue hover:cursor-pointer transition font-poppins"
              >
                {day && (
                  <div className="flex justify-end mb-1">
                    <div
                      className={`w-6 h-6 flex items-center justify-center text-xs font-medium rounded-full ${
                        isToday ? "bg-darkblue text-white" : "text-gray-400"
                      }`}
                    >
                      {day}
                    </div>
                  </div>
                )}

                <div className="space-y-1 flex-1">
                  {dayEvents.slice(0, 3).map((ev, idx) => (
                    <div
                      key={idx}
                      className={`truncate text-xs px-2 py-[2px] rounded-md font-medium ${ev.color}`}
                    >
                      {ev.title}{" "}
                      <span className="font-normal opacity-70">{ev.time}</span>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[11px] text-gray-400 pl-1">
                      +{dayEvents.length - 3} more...
                    </div>
                  )}
                </div>

        
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
