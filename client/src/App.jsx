import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import CompanyOverview from "./pages/CompanyOverview.jsx";
import BrandDashboard from "./pages/BrandDashboard.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/overview"
        element={
          <ProtectedRoute>
            <CompanyOverview />
          </ProtectedRoute>
        }
      />

      <Route
        path="/brands/:brand"
        element={
          <ProtectedRoute>
            <BrandDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Placeholder title="Reports" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Placeholder title="Settings" />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
}
