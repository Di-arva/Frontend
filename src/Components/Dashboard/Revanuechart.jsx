import {
  BarChart,
  Bar,
  XAxis,
  YAxis,

  Tooltip,

  ResponsiveContainer,
} from "recharts";

const financeData = [
  { month: "Jan", revenue: 45000, expenses: 3200 },
  { month: "Feb", revenue: 52000, expenses: 4100 },
  { month: "Mar", revenue: 61000, expenses: 5000 },
  { month: "Apr", revenue: 58000, expenses: 4800 },
  { month: "May", revenue: 63000, expenses: 5300 },
  { month: "Jun", revenue: 72000, expenses: 6000 },
  { month: "Jul", revenue: 69000, expenses: 5800 },
  { month: "Aug", revenue: 75000, expenses: 6400 },
  { month: "Sep", revenue: 81000, expenses: 7000 },
  { month: "Oct", revenue: 87000, expenses: 7600 },
  { month: "Nov", revenue: 92000, expenses: 8200 },
  { month: "Dec", revenue: 98000, expenses: 9000 },
];
const Revanuechart = () => {
  return (
    <div className=" bg-lightbg border-2 border-lightblue backdrop-blur-xl rounded-2xl">
      <div className="flex items-center justify-between mb-6 p-6">
        <div>
          <h3 className="text-xl font-semibold text-darkblue font-poppins">Revenue Chart</h3>
          <p className="text-sm text-darkblack font-poppins">Monthly Revenue & Expenses</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#323299] rounded-full"></div>
            <div className="text-sm text-[#323299]">
              <span className="font-poppins text-md font-medium">Revenue</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#8ab4f7] rounded-full border border-[#000080]"></div>
            <div className="text-sm text-[#323299]">
              <span className="font-poppins text-md font-medium">Expenses</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={financeData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
           
            <XAxis dataKey="month" stroke="#000080"
             style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 300, fontSize:"14px"}} />
            <YAxis stroke="#000080"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 300, fontSize:"14px"}} />
          <Tooltip
  formatter={(value) => `$${value.toLocaleString()}`}
  contentStyle={{ 
    backgroundColor: "#D2E2FC", // gray background
    color: "#000080", 
    borderRadius: "8px", 
    fontFamily: 'Poppins, sans-serif',
    cursor: 'pointer' // pointer on hover
  }}
  itemStyle={{ 
    color: "#000080", 
    fontFamily: 'Poppins, sans-serif' 
  }}
  labelStyle={{ 
    color: "#000080", 
    fontFamily: 'Poppins, sans-serif' 
  }}
cursor={{ fill: '#EAF1FE' }}
/>
          
            <Bar dataKey="revenue" fill="#323299" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expenses" fill="#8ab4f7" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

  );
};

export default Revanuechart;
