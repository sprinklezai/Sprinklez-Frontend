import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Overview from "./pages/Overview";
import ProtectedRoute from "./router/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/brand/:brandCode" element={<div>Brand Dashboard Coming Soon</div>} />

        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;