import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Dental Offices", value: 45, color: "#323299" },
  { name: "Home Care Centers", value: 30, color: "#8ab4f7" },
  { name: "Rehabilitation Clinics", value: 15, color: "#7f7fbf" },
  { name: "Private Practices", value: 10, color: "#cccce5" },
];

const SaleschartCompact = () => {
  return (
    <div className="bg-lightbg backdrop-blur-xl rounded-2xl p-4 border-2 border-lightblue shadow-md">
      {/* Header */}
      <div className="mb-4 text-center">
        
        <h3 className="text-xl font-semibold text-darkblue font-poppins">Sales by Category</h3>
        <p className="text-sm text-darkblack font-poppins">
          Production Distribution
        </p>
      </div>

      {/* Chart Container */}
      <div className="h-[340px] flex flex-col justify-between">
        {/* Pie chart with smaller outerRadius */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50} // smaller inner radius
                outerRadius={80} // smaller outer radius
                paddingAngle={4}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
       
  <Tooltip
  
    formatter={(value) => `${value}%`}
    contentStyle={{
      backgroundColor: "#D2E2FC",
      color: "#000080",
      borderRadius: "8px",
      fontFamily: "Poppins, sans-serif",
      cursor: "pointer",
    }}
    itemStyle={{
      color: "#000080",
      fontFamily: "Poppins, sans-serif",
    }}
    labelStyle={{
      color: "#000080",
      fontFamily: "Poppins, sans-serif",
    }}
    cursor={{ fill: "#EAF1FE" }} // soft blue hover background
  />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-2 pb-2">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-darkblack text-sm font-medium whitespace-nowrap">
                {entry.name} – {entry.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SaleschartCompact;
