import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { ChartBarDefault } from "@/components/ui/bar-chart";
import data from "@/app/dashboard/data.json";
import { ChartPieSimple } from "./ui/pie-chart";

export function DashboardContent() {
  return (
    <div className=" flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <div className="px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <ChartBarDefault />
          <ChartPieSimple/>
        </div>
      </div>
      <DataTable data={data} />
    </div>
  );
}
