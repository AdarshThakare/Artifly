import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import DashboardPage from "./screens/Dashboard";
import OnboardingPage from "./screens/Onboarding";
import HomePage from "./screens/Home";
import ProtectedRoute from "./screens/ProtectedRoute";
import ShareableProductPage from "./screens/ProductsPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route path="/product/:id" element={<ShareableProductPage />} />
        </Routes>
      </div>
    </div>
  );
}
