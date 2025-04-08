import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import DashboardCards from "../components/DashboardCards";

function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
        <DashboardCards />
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;