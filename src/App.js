import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PurchaseTestsPage from "./pages/PurchaseTestsPage";

const Index = lazy(() => import("./pages/Index"));
const InputPage = lazy(() => import("./pages/InputPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const Admin = lazy(() => import("./pages/Admin"));
// const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const ContentPage = lazy(() => import("./pages/Content"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const WorkWithUsPage = lazy(() => import("./pages/WorkWithUsPage"));
const RewardsPage = lazy(() => import("./pages/Rewards"));
const Login = lazy(() => import("./pages/Login"));
const TermsandConditions = lazy(() => import("./pages/TermsandConditions"));
const StudentsPage = lazy(() => import("./pages/Student"));
// const FamilyPlanPage = lazy(() => import("./pages/FamilyPlanPage"));

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // return <Navigate to="/login" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={<LoadingSpinner />}><Index /></Suspense>
  },
  {
    path: "/login",
    element: <Suspense fallback={<LoadingSpinner />}><Login /></Suspense>
  },
  {
    path: "/dashboard/*",
    element: <ProtectedRoute><Suspense fallback={<LoadingSpinner />}><DashboardPage /></Suspense></ProtectedRoute>
  },
  {
    path: "/admin",
    element: <ProtectedRoute><Suspense fallback={<LoadingSpinner />}><Admin /></Suspense></ProtectedRoute>
  },
  // {
  //   path: "/payment",
  //   element: <Suspense fallback={<LoadingSpinner />}><PaymentPage /></Suspense>
  // },
  {
    path: "/input",
    element: <Suspense fallback={<LoadingSpinner />}><InputPage /></Suspense>
  },
  {
    path: "/content",
    element: <Suspense fallback={<LoadingSpinner />}><ContentPage /></Suspense>
  },
  {
    path: "/about",
    element: <Suspense fallback={<LoadingSpinner />}><AboutPage /></Suspense>
  },
  {
    path: "/terms",
    element: <Suspense fallback={<LoadingSpinner />}><TermsandConditions /></Suspense>
  },
  {
    path: "/privacy",
    element: <Suspense fallback={<LoadingSpinner />}><PrivacyPage /></Suspense>
  },
  {
    path: "/work-with-us",
    element: <Suspense fallback={<LoadingSpinner />}><WorkWithUsPage /></Suspense>
  },
  {
    path: "/rewards",
    element: <Suspense fallback={<LoadingSpinner />}><RewardsPage /></Suspense>
  },
  {
    path: "/purchase-tests",
    element: <Suspense fallback={<LoadingSpinner />}><PurchaseTestsPage /></Suspense>
  },
  // {
  //   path: "/family-plan",
  //   element: <Suspense fallback={<LoadingSpinner />}><FamilyPlanPage /></Suspense>
  // },
  {
    path: "/students",
    element: <Suspense fallback={<LoadingSpinner />}><StudentsPage /></Suspense>
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}

export default App;