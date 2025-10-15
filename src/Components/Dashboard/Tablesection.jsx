import { TrendingUp, TrendingDown } from "lucide-react";

const customerData = [
  {
    id: "#3856",
    customer: "Nishi Surti",
    amount: "$1200",
    status: "pending",
    date: "24-01-2026",
  },
  {
    id: "#3857",
    customer: "Rohan Mehta",
    amount: "$950",
    status: "cancelled",
    date: "22-01-2026",
  },
  {
    id: "#3858",
    customer: "Anjali Kapoor",
    amount: "$1500",
    status: "pending",
    date: "23-01-2026",
  },
  {
    id: "#3859",
    customer: "Vikram Singh",
    amount: "$800",
    status: "completed",
    date: "21-01-2026",
  },
  {
    id: "#3860",
    customer: "Priya Sharma",
    amount: "$1300",
    status: "pending",
    date: "24-01-2026",
  },
  {
    id: "#3861",
    customer: "Karan Patel",
    amount: "$1100",
    status: "completed",
    date: "24-01-2026",
  },
];

const topClients = [
  {
    name: "Highland Dental Clinic",
    sales: "$4,000",
    trend: "Up",
    change: "+12%",
    total: "$2000",
  },
  {
    name: "Riverside Dental Care",
    sales: "$2,750",
    trend: "Up",
    change: "+6.5%",
    total: "$1562",
  },
  {
    name: "Maple Dental Studio",
    sales: "$9,120",
    trend: "Down",
    change: "-3.2%",
    total: "$2000",
  },

  {
    name: "GreenLeaf Dental Care",
    sales: "$7,300",
    trend: "Up",
    change: "+4.3%",
    total: "$8952",
  },
];

const Tablesection = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-darkblue text-lightbg";
    }
  };
  return (
    <>
      <div className=" rounded-2xl backdrop-blur-xl bg-lightblue overflow-hidden">
        <div className="p-6 ">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-darkblue font-poppins">
                Recent Registartion
              </h3>
              <p className="text-sm text-darkblack font-poppins">Latest </p>
            </div>
            <button className="font-poppins font-medium text-sm hover:cursor-pointer text-darkblue hover:text-blue-800">
              View All
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-darkblue">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-darkblue font-poppins">
                  Order Id
                </th>
                <th className="text-left p-4 text-sm font-semibold text-darkblue font-poppins">
                  Customer
                </th>
                <th className="text-left p-4 text-sm font-semibold text-darkblue font-poppins">
                  Amount
                </th>
                <th className="text-left p-4 text-sm font-semibold text-darkblue font-poppins">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-semibold text-darkblue font-poppins">
                  Date
                </th>
              </tr>
            </thead>

            {/* This line makes blue dividers between rows but none after the last */}
            <tbody className="divide-y divide-darkblue">
              {customerData.map((data, index) => (
                <tr
                  key={index}
                  className="hover:cursor-pointer font-poppins transition-colors"
                >
                  <td className="p-4 text-sm font-medium text-darkblue">
                    {data.id}
                  </td>
                  <td className="p-4 text-sm font-medium text-darkblue">
                    {data.customer}
                  </td>
                  <td className="p-4 text-sm font-medium text-darkblue">
                    {data.amount}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-sm font-medium px-2 rounded-full ${getStatusColor(
                        data.status
                      )}`}
                    >
                      {data.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-darkblue">
                    {data.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Top Clients */}
      <div className="backdrop-blur-xl mt-8 rounded-2xl border-2 border-lightblue overflow-hidden">
        <div className="p-6 border-b-2  border-lightblue">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-darkblack">
              <h3 className="text-xl font-semibold text-darkblue font-poppins">
                Top Clients
              </h3>
              <p className="text-sm text-darkblack font-poppins font-light">
                Latest{" "}
              </p>
            </div>
            <button className="font-poppins font-medium text-sm hover:cursor-pointer text-darkblue hover:text-blue-800">
              View All
            </button>
          </div>
        </div>
        {/* Data */}

        <div className="p-6 space-y-4 font-poppins">
          {topClients.map((client, index) => {
            return (
              <div className="flex items-center justify-between p-4 rounded-xl transition-colors">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-darkblue">
                    {client.name}
                  </h4>
                  <p className="text-sm font-poppins text-darkblack">
                    {client.sales}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-darkblue">
                    {client.total}
                  </p>
                  <div className="flex items-center space-x-1">
                    {client.trend === "Up" ? (
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span
                      className={`${
                        client.trend === "Up"
                          ? "text-emerald-500 font-poppins font-normal"
                          : "text-red-500 font-poppins font-normal"
                      }`}
                    >
                      {client.change}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Tablesection;
