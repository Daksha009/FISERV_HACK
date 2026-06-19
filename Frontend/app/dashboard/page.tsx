import { Suspense } from "react";
import DashboardClient from "./dashboard-client";
import DashboardLoading from "./loading";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardClient />
    </Suspense>
  );
}
