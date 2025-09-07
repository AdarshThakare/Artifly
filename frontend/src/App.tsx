import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import DashboardPage from "./screens/Dashboard";
import OnboardingPage from "./screens/Onboarding";
import HomePage from "./screens/Home";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Routes>
      </div>
    </div>
  );
}
