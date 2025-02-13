
import { Dashboard } from "../components/Dashboard";
import { Routes, Route } from "react-router-dom";
import Journal from "./Journal";

const DashboardPage = () => {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="journal" element={<Journal />} />
    </Routes>
  );
};

export default DashboardPage;
