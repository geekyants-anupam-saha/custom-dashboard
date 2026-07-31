/* eslint-disable @typescript-eslint/no-explicit-any */

import { getDashboardData } from "@/lib/dashboard/getDashboardData";
import DashboardPage from "./DashboardClient";

interface HomePageProps {
  searchParams: Promise<{
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const startDate = params.startDate;
  const endDate = params.endDate;

  const dashboardData = await getDashboardData(startDate, endDate);

  return <DashboardPage dashboardData={dashboardData} />;
}
