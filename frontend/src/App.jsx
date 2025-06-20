import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Receptionist from "./pages/receptionist/Dashboard";
import Doctor from "./pages/doctor/Dashboard";

const ProtectedRoute = ({ role, children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token || userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/receptionist"
        element={
          <ProtectedRoute role="receptionist">
            <Receptionist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor"
        element={
          <ProtectedRoute role="doctor">
            <Doctor />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
