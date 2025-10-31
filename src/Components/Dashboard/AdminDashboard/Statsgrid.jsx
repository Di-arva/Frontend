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

  },
  {
    title: "New Customers",
    value: "3,245",
    change: "+8.12",
    trend: "up",
    icon: Users,
  
  },
  {
    title: "Orders Processed",
    value: "14,876",
    change: "+4.67",
    trend: "up",
    icon: ShoppingCart,

  },
  {
    title: "Churn Rate",
    value: "3.48%",
    change: "-0.26",
    trend: "down",
    icon: Activity,

  },
  {
    title: "Active Users",
    value: "25,104",
    change: "+15.21",
    trend: "up",
    icon: BarChart3,

  },
  {
    title: "Total Transactions",
    value: "$1.2M",
    change: "+9.84",
    trend: "up",
    icon: CreditCard,
  
  },
  {
    title: "Active Subscriptions",
    value: "4,612",
    change: "+2.34",
    trend: "up",
    icon: Briefcase,

  },
  {
    title: "Customer Stats",
    value: "92%",
    change: "+1.10",
    trend: "up",
    icon: Star,

  },
];

const Statsgrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 bg-lightbg">
      {stats.map((stats, index) => {
        return (
          <div
            className="bg-lightblue backdrop-blur-xl rounded-2xl p-6  transition-all duration-300 group  hover:cursor-pointer hover:scale-110"
            key={index}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-light text-darkblack font-poppins">
                  {stats.title}
                </p>
                <p className="text-3xl font-medium text-darkblue font-poppins my-2">
                  {stats.value}
                </p>
                <div className={`flex items-center space-x-2 font-poppins`}>
                  {stats.trend === "up" ? (
                    <ArrowUpRight className="w-5 h-5 text-emerald-700" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-red-700" />
                  )}
                  <span
                    className={`text-lg font-semibold ${
                      stats.trend === "up" ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    {stats.change}
                  </span>
                
                </div>
              </div>

              <div
                className={`p-2 rounded-xl bg-darkblue group-hover:scale-110 transition-all duration-200 hover:cursor-pointer`}
              >
                {<stats.icon className={`w-6 h-6 text-lightbg`} />}
              </div>
            </div>
    
          </div>
        );
      })}
    </div>
  );
};

export default Statsgrid;
