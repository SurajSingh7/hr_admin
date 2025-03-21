'use client'

import { Suspense } from "react";
import DashboardContent from "./Dashboard";

export default function Dashboard() {
    return (
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <DashboardContent/>
      </Suspense>
    );
  }