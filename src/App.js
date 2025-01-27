import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
// import { AuthWrapper } from "./components/AuthWrapper";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import styles from "./App.module.css";
import FamilyPlanPage from "./pages/FamilyPlanPage";

const Index = lazy(() => import("./pages/Index"));
const InputPage = lazy(() => import("./pages/InputPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const ContentPage = lazy(() => import("./pages/Content"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const WorkWithUsPage = lazy(() => import("./pages/WorkWithUsPage"));
const RewardsPage = lazy(() => import("./pages/Rewards"));
const TermsandConditions = lazy(() => import("./pages/TermsandConditions"));
const StudentsPage = lazy(() => import("./pages/Student"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Index />
      </Suspense>
    ),
  },
  {
    path: "/input",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <InputPage />
      </Suspense>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardPage />
      </Suspense>
    ),
  },
  {
    path: "/payment",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <PaymentPage />
      </Suspense>
    ),
  },
  {
    path: "/content",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ContentPage />
      </Suspense>
    ),
  },
  {
    path: "/about",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <AboutPage />
      </Suspense>
    ),
  },
  {
    path: "/terms",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <TermsandConditions />
      </Suspense>
    ),
  },
  {
    path: "/privacy",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <PrivacyPage />
      </Suspense>
    ),
  },
  {
    path: "/work-with-us",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <WorkWithUsPage />
      </Suspense>
    ),
  },
  {
    path: "/rewards",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <RewardsPage />
      </Suspense>
    ),
  },
  {
    path: "/family-plan",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <FamilyPlanPage />
      </Suspense>
    ),
  },
  {
    path: "/students",
    element: (
      <>
        <Suspense fallback={<LoadingSpinner />}>
          <StudentsPage />
        </Suspense>
      </>
    ),
  },
]);

function App() {
  return (
    <div className={styles.app}>
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

export default App;
