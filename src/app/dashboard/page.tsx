import { getDashboardData } from "@/lib/dashboard/getDashboardData";

import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const dashboardData = await getDashboardData();

  return (
    <DashboardClient
      dashboardData={dashboardData}
    />
  );
}