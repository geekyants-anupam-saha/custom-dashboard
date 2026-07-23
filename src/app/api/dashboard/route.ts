import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/dashboard/getDashboardData";

export async function GET() {
  try {
    const dashboardData = await getDashboardData();

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Dashboard API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch dashboard data",
      },
      {
        status: 500,
      },
    );
  }
}
