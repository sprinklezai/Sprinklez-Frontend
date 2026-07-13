import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Overview from "./pages/Overview";
import BrandDashboard from "./pages/BrandDashboard";
import SalesDashboard from "./pages/SalesDashboard";
import PnLDashboard from "./pages/PnLDashboard";

import ProtectedRoute from "./router/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* Executive Overview */}
        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          }
        />

        {/* Brand Sales Dashboard */}
        <Route
          path="/brand/:brandCode"
          element={
            <ProtectedRoute>
              <SalesDashboard />
            </ProtectedRoute>
          }
        />

        {/* Profit & Loss Dashboard */}
        <Route
          path="/brand/:brandCode/pnl"
          element={
            <ProtectedRoute>
              <PnLDashboard />
            </ProtectedRoute>
          }
        />

        {/* Placeholder Pages */}
        <Route
          path="/brand/:brandCode/delivery"
          element={
            <ProtectedRoute>
              <BrandDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/brand/:brandCode/reviews"
          element={
            <ProtectedRoute>
              <BrandDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/brand/:brandCode/pipeline"
          element={
            <ProtectedRoute>
              <BrandDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;