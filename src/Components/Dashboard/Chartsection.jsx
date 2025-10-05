import React from "react";
import Revanuechart from "./Revanuechart";

const Chartsection = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2">
        <Revanuechart />
      </div>
    </div>
  );
};

export default Chartsection;
