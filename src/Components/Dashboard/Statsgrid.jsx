import {
  Users,
  ShoppingCart,
  BarChart3,
  Activity,
  CreditCard,
  Briefcase,
  Star,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$128,999",
    change: "+12.98",
    trend: "up",
    icon: DollarSign,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    title: "New Customers",
    value: "3,245",
    change: "+8.12",
    trend: "up",
    icon: Users,
    color: "from-indigo-500 to-blue-600",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-600",
  },
  {
    title: "Orders Processed",
    value: "14,876",
    change: "+4.67",
    trend: "up",
    icon: ShoppingCart,
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
  },
  {
    title: "Churn Rate",
    value: "3.48%",
    change: "-0.26",
    trend: "down",
    icon: Activity,
    color: "from-rose-500 to-red-600",
    bgColor: "bg-rose-50",
    textColor: "text-rose-600",
  },
  {
    title: "Monthly Active Users",
    value: "25,104",
    change: "+15.21",
    trend: "up",
    icon: BarChart3,
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50",
    textColor: "text-violet-600",
  },
  {
    title: "Total Transactions",
    value: "$1.2M",
    change: "+9.84",
    trend: "up",
    icon: CreditCard,
    color: "from-cyan-500 to-sky-600",
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-600",
  },
  {
    title: "Active Subscriptions",
    value: "4,612",
    change: "+2.34",
    trend: "up",
    icon: Briefcase,
    color: "from-teal-500 to-green-600",
    bgColor: "bg-teal-50",
    textColor: "text-teal-600",
  },
  {
    title: "Customer Satisfaction",
    value: "92%",
    change: "+1.10",
    trend: "up",
    icon: Star,
    color: "from-yellow-500 to-amber-500",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-600",
  },
];

const Statsgrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stats, index) => {
        return (
          <div
            className="bg-lightbg backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 group"
            key={index}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-darkblack">
                  {stats.title}
                </p>
                <p className="text-3xl font-bold text-darkblack">
                  {stats.value}
                </p>
                <div className="flex items-center space-x-2">
                  {stats.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 text-darkblue" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      stats.trend === "up" ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {stats.change}
                  </span>
                  <span className="text-sm">vs Last Month</span>
                </div>
              </div>

              <div
                className={`p-3 rounded-xl ${stats.bgColor} group-hover:scale-110 transition-all duration-200`}
              >
                {<stats.icon className={`w-6 h-6 ${stats.textColor}`} />}
              </div>
            </div>
            {/* Progressbar */}

            <div className="mt-4 h-2 bg-lightblue  rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r rounded-full ${stats.color} transition-all duration-100`}
                style={{ width: stats.trend === "up" ? "75%" : "45%" }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Statsgrid;
