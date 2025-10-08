import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
    <div className="bg-lightbg backdrop-blur-xl rounded-b-2xl border border-darkblue">
      <div className="flex items-center justify-between mb-6 p-6">
        <div>
          <h3 className="text-xl font-bold text-darkblack"> Revenue Chart</h3>
          <p className="text-sm text-darkblack">Monthly Revenue & Expenses</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to purple-600 rounded-full"></div>
            <div className=" text-sm">
              <span>Revenue</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-slate-500 to purple-600 rounded-full"></div>
            <div className=" text-sm">
              <span>Expenses</span>
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="revenue" fill="#4ade80" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expenses" fill="#f87171" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Revanuechart;
