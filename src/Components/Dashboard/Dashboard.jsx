import Activity from "./Activity";
import Chartsection from "./Chartsection";

import Statsgrid from "./Statsgrid";
import Tablesection from "./Tablesection";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <Statsgrid />
      <Chartsection />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Tablesection />
        </div>
        <div>
          <Activity/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
