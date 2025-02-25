import * as React from "react";
import { Suspense } from "react";
import { Dashboard } from "../components/Dashboard";
import { Routes, Route } from "react-router-dom";
import Loader from "../components/fallback";
const Journal = React.lazy(() => import("./Journal"));

const DashboardPage = () => {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route
        path="journal"
        element={
          <Suspense fallback={<Loader />}>
            <Journal />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default DashboardPage;
