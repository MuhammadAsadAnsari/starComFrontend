import React, { useState, useEffect, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./assets/Pages/Login/Login.jsx";
import Home from "./assets/Pages/Home/Home.jsx";
import Users from "./assets/Pages/Admin/Users/Users.jsx";
import Schedule from "./assets/Pages/subAdmin/Schedule/Schedule.jsx";
import AdminLogin from "./assets/Pages/Admin/Auth/Login/AdminLogin.jsx";
import ClientAndBrandManagament from "./assets/Pages/Admin/ClientAndBrand/ClientAndBrandManagament.jsx";
import DayPartManagement from "./assets/Pages/Admin/DayPart/DayPartManagement.jsx";
import GenreManagment from "./assets/Pages/Admin/Genre/GenreManagment.jsx";
import Summary from "./assets/Pages/Summary/Summary.jsx";

export const AuthContext = createContext();

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["user", "super_user", "admin"]}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/file-history"
            element={
              <ProtectedRoute allowedRoles={["super_user","admin"]}>
                <Schedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PublicRoute>
                <AdminLogin />
              </PublicRoute>
            }
          />
          <Route
            path="summary/"
            element={
              <ProtectedRoute allowedRoles={["user", "super_user", "admin"]}>
                <Summary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/client/brand"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ClientAndBrandManagament />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/day/part"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DayPartManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/genre"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <GenreManagment />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authCookie")
  );

  const [role, setRole] = useState(localStorage.getItem("userRole") || null);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("lastVisitedRoute", location.pathname);
  }, [location.pathname]);

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem("authCookie");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    // Redirect to a not-authorized page or the default home page
    return <Navigate to="/forbidden" />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, role } = useContext(AuthContext);

  if (isAuthenticated) {
    // Redirect based on the role
    if (role === "admin") {
      return <Navigate to="/admin/users" />;
    } else if (role === "user" || role === "sub-admin") {
      return <Navigate to="/" />;
    }
  }

  // If not authenticated, render the public page
  return children;
};

export default App;
