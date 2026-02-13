import RevenueChart from "./revenue-chart";
import { getRevenueData } from "@/app/lib/actions";

export default async function RevenueChartServer() {
  const data = await getRevenueData();

  return <RevenueChart data={data} />;
}
