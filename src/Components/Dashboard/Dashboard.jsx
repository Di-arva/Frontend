import Chartsection from "./Chartsection";
import Statsgrid from "./Statsgrid";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <Statsgrid />
      <Chartsection />
    </div>
  );
};

export default Dashboard;
